from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from datetime import datetime
import models
import auth as auth_module
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/qualifications", tags=["qualifications"])

LEVEL_LABELS = {1: "No skills", 2: "Supervised", 3: "Independent", 4: "Trainer"}


class EntrySet(BaseModel):
    erp_id: str
    wc_code: str
    level: Optional[int] = None   # None = remove assessment


# ── Work centers ─────────────────────────────────────────────────────────────

@router.get("/workcenters")
def list_workcenters(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("hr", "qs", "admin"))
):
    wcs = db.query(models.WorkCenter).order_by(models.WorkCenter.col_index).all()
    return [{"code": w.code, "machine": w.machine, "dept_group": w.dept_group} for w in wcs]


# ── Full matrix ───────────────────────────────────────────────────────────────

@router.get("/matrix")
def get_matrix(
    dept_group: str = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("hr", "qs", "admin"))
):
    """Returns employees × workcenters grid."""
    # Work centers
    wc_query = db.query(models.WorkCenter).order_by(models.WorkCenter.col_index)
    if dept_group:
        wc_query = wc_query.filter(models.WorkCenter.dept_group == dept_group)
    wcs = wc_query.all()
    wc_codes = [w.code for w in wcs]

    # Active employees (sorted by dept + name)
    employees = db.query(models.Employee).filter(
        models.Employee.status == "Active",
        models.Employee.erp_id.isnot(None)
    ).order_by(models.Employee.department_en, models.Employee.last_name).all()

    # Qualification map: {(erp_id, wc_code): level}
    quals = db.query(models.Qualification).all()
    qual_map = {(q.erp_id, q.wc_code): q.level for q in quals}

    rows = []
    for emp in employees:
        scores = {wc: qual_map.get((emp.erp_id, wc)) for wc in wc_codes}
        assessed  = sum(1 for v in scores.values() if v is not None)
        ind_plus  = sum(1 for v in scores.values() if v and v >= 3)
        trainer   = sum(1 for v in scores.values() if v == 4)
        pct       = round(assessed / len(wc_codes) * 100, 1) if wc_codes else 0
        rows.append({
            "erp_id":    emp.erp_id,
            "name":      " ".join(filter(None, [emp.last_name, emp.first_name])) or f"ERP {emp.erp_id}",
            "dept":      emp.department_en or emp.department or "–",
            "position":  emp.position_en or "–",
            "scores":    scores,
            "assessed":  assessed,
            "ind_plus":  ind_plus,
            "trainer":   trainer,
            "pct":       pct,
        })

    # Dept groups for filter
    all_groups = sorted(set(w.dept_group for w in db.query(models.WorkCenter).all() if w.dept_group))

    return {
        "workcenters": [{"code": w.code, "machine": w.machine, "dept_group": w.dept_group} for w in wcs],
        "employees":   rows,
        "dept_groups": all_groups,
    }


# ── Set/update a single entry ─────────────────────────────────────────────────

@router.put("/entry")
def set_entry(
    body: EntrySet,
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("hr", "qs", "admin"))
):
    if body.level is not None and body.level not in (1, 2, 3, 4):
        raise HTTPException(400, "Level must be 1–4 or null")

    wc = db.query(models.WorkCenter).filter(models.WorkCenter.code == body.wc_code).first()
    if not wc:
        raise HTTPException(404, f"Work center {body.wc_code} not found")

    entry = db.query(models.Qualification).filter(
        models.Qualification.erp_id  == body.erp_id,
        models.Qualification.wc_code == body.wc_code
    ).first()

    if body.level is None:
        # Remove assessment
        if entry:
            db.delete(entry)
            db.commit()
        return {"ok": True, "erp_id": body.erp_id, "wc_code": body.wc_code, "level": None}

    if entry:
        entry.level       = body.level
        entry.assessed_by = current_user.username
        entry.assessed_at = datetime.utcnow()
    else:
        entry = models.Qualification(
            erp_id      = body.erp_id,
            wc_code     = body.wc_code,
            level       = body.level,
            assessed_by = current_user.username,
            assessed_at = datetime.utcnow()
        )
        db.add(entry)

    db.commit()
    auth_module.log_access(db, current_user, "PUT", f"qualifications/entry/{body.erp_id}/{body.wc_code}",
                           request.client.host if request.client else None)
    return {"ok": True, "erp_id": body.erp_id, "wc_code": body.wc_code, "level": body.level}


# ── Employee profile ──────────────────────────────────────────────────────────

@router.get("/employee/{erp_id}")
def get_employee_profile(
    erp_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("hr", "qs", "admin"))
):
    emp = db.query(models.Employee).filter(models.Employee.erp_id == erp_id).first()
    if not emp:
        raise HTTPException(404, "Employee not found")
    wcs   = db.query(models.WorkCenter).order_by(models.WorkCenter.col_index).all()
    quals = {q.wc_code: q for q in db.query(models.Qualification).filter(
        models.Qualification.erp_id == erp_id).all()}
    return {
        "erp_id":   erp_id,
        "name":     " ".join(filter(None, [emp.last_name, emp.first_name])),
        "dept":     emp.department_en or emp.department,
        "position": emp.position_en,
        "scores":   [{
            "wc_code":     w.code,
            "machine":     w.machine,
            "dept_group":  w.dept_group,
            "level":       quals[w.code].level if w.code in quals else None,
            "assessed_by": quals[w.code].assessed_by if w.code in quals else None,
            "assessed_at": quals[w.code].assessed_at.isoformat() if (w.code in quals and quals[w.code].assessed_at) else None,
        } for w in wcs]
    }


# ── Department coverage summary ───────────────────────────────────────────────

@router.get("/coverage")
def get_coverage(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("hr", "qs", "admin"))
):
    """Per-WC: how many employees at each level."""
    wcs   = db.query(models.WorkCenter).order_by(models.WorkCenter.col_index).all()
    quals = db.query(models.Qualification).all()
    emp_count = db.query(models.Employee).filter(
        models.Employee.status == "Active", models.Employee.erp_id.isnot(None)).count()

    result = []
    for wc in wcs:
        levels = [q.level for q in quals if q.wc_code == wc.code and q.level]
        result.append({
            "wc_code":    wc.code,
            "machine":    wc.machine,
            "dept_group": wc.dept_group,
            "count_1":    levels.count(1),
            "count_2":    levels.count(2),
            "count_3":    levels.count(3),
            "count_4":    levels.count(4),
            "assessed":   len(levels),
            "trainers":   levels.count(4),
            "independent":sum(1 for l in levels if l >= 3),
            "emp_total":  emp_count,
        })
    return result
