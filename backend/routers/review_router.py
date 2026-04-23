from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from datetime import datetime
import models
import auth as auth_module
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/review", tags=["review"])


# ── Pydantic schemas ────────────────────────────────────────────────────────

class ReviewCreate(BaseModel):
    period: str        # 'YYYY-MM'
    notes: Optional[str] = None

class EntryUpsert(BaseModel):
    erp_id: str
    absence_days: Optional[float] = 0
    absence_type: Optional[str] = None        # sick | vacation | unpaid | other
    quality_score: Optional[float] = 100
    productivity_score: Optional[float] = 100
    attitude_score: Optional[float] = 100
    salary_increase: Optional[float] = 0      # permanent – applied on approval
    one_time_bonus: Optional[float] = 0
    transport: Optional[float] = 0
    presence_bonus: Optional[float] = 0
    bonus_amount: Optional[float] = 0         # legacy
    bonus_reason: Optional[str] = None
    suggestion: Optional[str] = None
    notes: Optional[str] = None

class ReviewNote(BaseModel):
    notes: Optional[str] = None


# ── Helpers ─────────────────────────────────────────────────────────────────

def _review_dict(r, entries=None):
    d = {
        "id": r.id,
        "period": r.period,
        "status": r.status,
        "created_by": r.created_by,
        "created_at": r.created_at.isoformat() if r.created_at else None,
        "submitted_at": r.submitted_at.isoformat() if r.submitted_at else None,
        "submitted_by": r.submitted_by,
        "approved_at": r.approved_at.isoformat() if r.approved_at else None,
        "approved_by": r.approved_by,
        "notes": r.notes,
    }
    if entries is not None:
        d["entries"] = entries
    return d

def _entry_dict(e):
    return {
        "id": e.id,
        "review_id": e.review_id,
        "erp_id": e.erp_id,
        "department": e.department,
        "department_en": e.department_en,
        "position_en": e.position_en,
        "absence_days": e.absence_days or 0,
        "absence_type": e.absence_type,
        "quality_score": e.quality_score if e.quality_score is not None else 100,
        "productivity_score": e.productivity_score if e.productivity_score is not None else 100,
        "attitude_score": e.attitude_score if e.attitude_score is not None else 100,
        "salary_increase": e.salary_increase or 0,
        "one_time_bonus": e.one_time_bonus or 0,
        "transport": e.transport or 0,
        "presence_bonus": e.presence_bonus or 0,
        "bonus_amount": e.bonus_amount or 0,
        "bonus_reason": e.bonus_reason,
        "suggestion": e.suggestion,
        "notes": e.notes,
        "updated_by": e.updated_by,
        "updated_at": e.updated_at.isoformat() if e.updated_at else None,
    }


# ── List / Create reviews ───────────────────────────────────────────────────

@router.get("/")
def list_reviews(
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("hr", "payroll", "admin", "manager"))
):
    auth_module.log_access(db, current_user, "GET", "review/list", request.client.host if request.client else None)
    reviews = db.query(models.MonthlyReview).order_by(models.MonthlyReview.period.desc()).all()
    result = []
    for r in reviews:
        d = _review_dict(r)
        entries = db.query(models.MonthlyReviewEntry).filter(
            models.MonthlyReviewEntry.review_id == r.id).all()
        d["entry_count"]          = len(entries)
        d["absence_total"]        = round(sum(e.absence_days or 0 for e in entries), 1)
        d["salary_increase_total"]= round(sum(e.salary_increase or 0 for e in entries), 2)
        d["bonus_total"]          = round(sum(
            (e.one_time_bonus or 0) + (e.transport or 0) + (e.presence_bonus or 0)
            for e in entries), 2)
        result.append(d)
    return result


@router.post("/")
def create_review(
    request: Request,
    body: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("hr", "admin"))
):
    auth_module.log_access(db, current_user, "POST", "review/create", request.client.host if request.client else None)
    existing = db.query(models.MonthlyReview).filter(
        models.MonthlyReview.period == body.period).first()
    if existing:
        raise HTTPException(400, f"Review for {body.period} already exists (id={existing.id})")
    rev = models.MonthlyReview(
        period=body.period,
        status="draft",
        created_by=current_user.username,
        notes=body.notes
    )
    db.add(rev)
    db.commit()
    db.refresh(rev)
    return _review_dict(rev, entries=[])


# ── Get single review ───────────────────────────────────────────────────────

@router.get("/{review_id}/departments")
def get_departments(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("hr", "payroll", "admin", "manager"))
):
    """All departments with employees + current wage data + existing review entries."""
    rev = db.query(models.MonthlyReview).filter(models.MonthlyReview.id == review_id).first()
    if not rev:
        raise HTTPException(404, "Review not found")

    employees = db.query(models.Employee).filter(
        models.Employee.status == "Active"
    ).all()

    band_pos = {bp.erp_id: bp for bp in db.query(models.EmployeeBandPosition).all() if bp.erp_id}

    entries = {e.erp_id: e for e in db.query(models.MonthlyReviewEntry).filter(
        models.MonthlyReviewEntry.review_id == review_id
    ).all()}

    dept_map = {}
    for emp in employees:
        if not emp.erp_id:
            continue
        dept_key = emp.department_en or emp.department or "Unknown"
        if dept_key not in dept_map:
            dept_map[dept_key] = {
                "department_en": dept_key,
                "department": emp.department or dept_key,
                "employees": []
            }
        bp    = band_pos.get(emp.erp_id)
        entry = entries.get(emp.erp_id)
        dept_map[dept_key]["employees"].append({
            "erp_id":            emp.erp_id,
            "first_name":        emp.first_name,
            "last_name":         emp.last_name,
            "position_en":       (bp.en_title if bp else None) or emp.position_en,
            "position_bg":       (bp.position_bg if bp else None) or emp.position_bg,
            "actual_net":        bp.actual_net if bp else None,
            "band_code":         bp.band_code if bp else None,
            "cost_center":       (bp.cost_center if bp else None) or emp.cost_center,
            "employee_type":     emp.employee_type or "Regular",
            "fte":               emp.fte,
            # review entry (defaults if not yet saved)
            "entry_id":          entry.id if entry else None,
            "absence_days":      entry.absence_days if entry else 0,
            "absence_type":      entry.absence_type if entry else None,
            "quality_score":     (entry.quality_score if entry and entry.quality_score is not None else 100),
            "productivity_score":(entry.productivity_score if entry and entry.productivity_score is not None else 100),
            "attitude_score":    (entry.attitude_score if entry and entry.attitude_score is not None else 100),
            "salary_increase":   entry.salary_increase if entry else 0,
            "one_time_bonus":    entry.one_time_bonus if entry else 0,
            "transport":         entry.transport if entry else 0,
            "presence_bonus":    entry.presence_bonus if entry else 0,
            "suggestion":        entry.suggestion if entry else None,
            "updated_at":        entry.updated_at.isoformat() if (entry and entry.updated_at) else None,
        })

    result = sorted(dept_map.values(), key=lambda d: d["department_en"])
    for dept in result:
        dept["employees"].sort(key=lambda e: (e.get("position_en") or "", e.get("last_name") or ""))
        dept["total_employees"] = len(dept["employees"])
        dept["total_absence"]   = round(sum(e["absence_days"] or 0 for e in dept["employees"]), 1)
        dept["entries_count"]   = sum(1 for e in dept["employees"] if e["entry_id"] is not None)
        dept["total_payout"]    = round(sum(
            (e["actual_net"] or 0) + (e["salary_increase"] or 0) +
            (e["one_time_bonus"] or 0) + (e["transport"] or 0) + (e["presence_bonus"] or 0)
            for e in dept["employees"]
        ), 2)
    return result


@router.get("/{review_id}")
def get_review(
    review_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("hr", "payroll", "admin", "manager"))
):
    auth_module.log_access(db, current_user, "GET", f"review/{review_id}", request.client.host if request.client else None)
    rev = db.query(models.MonthlyReview).filter(models.MonthlyReview.id == review_id).first()
    if not rev:
        raise HTTPException(404, "Review not found")
    entries = db.query(models.MonthlyReviewEntry).filter(
        models.MonthlyReviewEntry.review_id == review_id
    ).order_by(models.MonthlyReviewEntry.erp_id).all()
    return _review_dict(rev, [_entry_dict(e) for e in entries])


# ── Upsert entry ────────────────────────────────────────────────────────────

@router.put("/{review_id}/entry")
def upsert_entry(
    review_id: int,
    body: EntryUpsert,
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("hr", "payroll", "admin", "manager"))
):
    rev = db.query(models.MonthlyReview).filter(models.MonthlyReview.id == review_id).first()
    if not rev:
        raise HTTPException(404, "Review not found")
    if rev.status == "approved":
        raise HTTPException(400, "Cannot edit an approved review")

    emp = db.query(models.Employee).filter(models.Employee.erp_id == body.erp_id).first()
    bp  = db.query(models.EmployeeBandPosition).filter(
        models.EmployeeBandPosition.erp_id == body.erp_id).first()

    entry = db.query(models.MonthlyReviewEntry).filter(
        models.MonthlyReviewEntry.review_id == review_id,
        models.MonthlyReviewEntry.erp_id == body.erp_id
    ).first()

    fields = dict(
        absence_days       = body.absence_days or 0,
        absence_type       = body.absence_type,
        quality_score      = body.quality_score if body.quality_score is not None else 100,
        productivity_score = body.productivity_score if body.productivity_score is not None else 100,
        attitude_score     = body.attitude_score if body.attitude_score is not None else 100,
        salary_increase    = body.salary_increase or 0,
        one_time_bonus     = body.one_time_bonus or 0,
        transport          = body.transport or 0,
        presence_bonus     = body.presence_bonus or 0,
        bonus_amount       = body.bonus_amount or 0,
        bonus_reason       = body.bonus_reason,
        suggestion         = body.suggestion,
        notes              = body.notes,
        updated_by         = current_user.username,
        updated_at         = datetime.utcnow(),
    )

    if entry:
        for k, v in fields.items():
            setattr(entry, k, v)
    else:
        entry = models.MonthlyReviewEntry(
            review_id     = review_id,
            erp_id        = body.erp_id,
            department    = emp.department if emp else None,
            department_en = emp.department_en if emp else None,
            position_en   = (bp.en_title if bp else None) or (emp.position_en if emp else None),
            **fields
        )
        db.add(entry)

    db.commit()
    db.refresh(entry)
    return _entry_dict(entry)


# ── Delete entry ────────────────────────────────────────────────────────────

@router.delete("/{review_id}/entry/{erp_id}")
def delete_entry(
    review_id: int,
    erp_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("hr", "payroll", "admin", "manager"))
):
    rev = db.query(models.MonthlyReview).filter(models.MonthlyReview.id == review_id).first()
    if not rev:
        raise HTTPException(404, "Review not found")
    if rev.status == "approved":
        raise HTTPException(400, "Cannot edit an approved review")
    entry = db.query(models.MonthlyReviewEntry).filter(
        models.MonthlyReviewEntry.review_id == review_id,
        models.MonthlyReviewEntry.erp_id == erp_id
    ).first()
    if entry:
        db.delete(entry)
        db.commit()
    return {"ok": True}


# ── Workflow actions ─────────────────────────────────────────────────────────

@router.post("/{review_id}/submit")
def submit_review(
    review_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("hr", "payroll", "admin", "manager"))
):
    rev = db.query(models.MonthlyReview).filter(models.MonthlyReview.id == review_id).first()
    if not rev:
        raise HTTPException(404, "Review not found")
    if rev.status != "draft":
        raise HTTPException(400, f"Cannot submit review with status '{rev.status}'")
    rev.status       = "submitted"
    rev.submitted_at = datetime.utcnow()
    rev.submitted_by = current_user.username
    db.commit()
    auth_module.log_access(db, current_user, "POST", f"review/{review_id}/submit",
                           request.client.host if request.client else None)
    return _review_dict(rev)


@router.post("/{review_id}/approve")
def approve_review(
    review_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("hr", "admin"))
):
    """Approve review AND apply salary_increase to actual_net in employee_band_positions."""
    rev = db.query(models.MonthlyReview).filter(models.MonthlyReview.id == review_id).first()
    if not rev:
        raise HTTPException(404, "Review not found")
    if rev.status != "submitted":
        raise HTTPException(400, f"Can only approve submitted reviews (current: {rev.status})")

    # Apply permanent salary increases
    entries = db.query(models.MonthlyReviewEntry).filter(
        models.MonthlyReviewEntry.review_id == review_id
    ).all()
    applied = 0
    for entry in entries:
        if entry.salary_increase and entry.salary_increase > 0:
            bp = db.query(models.EmployeeBandPosition).filter(
                models.EmployeeBandPosition.erp_id == entry.erp_id
            ).first()
            if bp:
                bp.actual_net = round((bp.actual_net or 0) + entry.salary_increase, 2)
                applied += 1

    rev.status      = "approved"
    rev.approved_at = datetime.utcnow()
    rev.approved_by = current_user.username
    db.commit()
    auth_module.log_access(db, current_user, "POST", f"review/{review_id}/approve",
                           request.client.host if request.client else None)
    return {**_review_dict(rev), "salary_increases_applied": applied}


@router.post("/{review_id}/reopen")
def reopen_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("hr", "admin"))
):
    rev = db.query(models.MonthlyReview).filter(models.MonthlyReview.id == review_id).first()
    if not rev:
        raise HTTPException(404, "Review not found")
    if rev.status == "draft":
        raise HTTPException(400, "Already in draft")
    rev.status       = "draft"
    rev.submitted_at = None
    rev.submitted_by = None
    rev.approved_at  = None
    rev.approved_by  = None
    db.commit()
    return _review_dict(rev)


# ── Absence import ───────────────────────────────────────────────────────────

@router.post("/{review_id}/import-absences")
async def import_absences(
    review_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("hr", "admin"))
):
    rev = db.query(models.MonthlyReview).filter(models.MonthlyReview.id == review_id).first()
    if not rev:
        raise HTTPException(404, "Review not found")
    if rev.status == "approved":
        raise HTTPException(400, "Cannot edit an approved review")

    data  = await request.json()
    rows  = data.get("rows", [])
    stats = {"updated": 0, "inserted": 0, "skipped": 0}

    for row in rows:
        erp_id = str(row.get("erp_id", "")).strip()
        if not erp_id:
            stats["skipped"] += 1
            continue
        days  = float(row.get("absence_days", 0) or 0)
        atype = str(row.get("absence_type", "") or "").strip() or None

        emp = db.query(models.Employee).filter(models.Employee.erp_id == erp_id).first()
        bp  = db.query(models.EmployeeBandPosition).filter(
            models.EmployeeBandPosition.erp_id == erp_id).first()
        entry = db.query(models.MonthlyReviewEntry).filter(
            models.MonthlyReviewEntry.review_id == review_id,
            models.MonthlyReviewEntry.erp_id == erp_id
        ).first()

        if entry:
            entry.absence_days = days
            entry.absence_type = atype
            entry.updated_by   = current_user.username
            entry.updated_at   = datetime.utcnow()
            stats["updated"] += 1
        else:
            entry = models.MonthlyReviewEntry(
                review_id     = review_id,
                erp_id        = erp_id,
                department    = emp.department if emp else None,
                department_en = emp.department_en if emp else None,
                position_en   = (bp.en_title if bp else None) or (emp.position_en if emp else None),
                absence_days  = days,
                absence_type  = atype,
                updated_by    = current_user.username,
                updated_at    = datetime.utcnow()
            )
            db.add(entry)
            stats["inserted"] += 1

    db.commit()
    auth_module.log_access(db, current_user, "POST", f"review/{review_id}/import-absences",
                           request.client.host if request.client else None)
    return {"ok": True, "stats": stats}


# ── Salary History / Analysis ───────────────────────────────────────────────

@router.get("/salary-history")
def salary_history(
    request: Request,
    months: int = 12,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("hr", "payroll", "admin", "manager"))
):
    """Salary increases per employee over last N months, plus current net from band positions."""
    from datetime import date
    import calendar

    # Compute cutoff period string e.g. "2025-05"
    today = date.today()
    cutoff_month = today.month - months
    cutoff_year  = today.year + (cutoff_month - 1) // 12
    cutoff_month = ((cutoff_month - 1) % 12) + 1
    cutoff_period = f"{cutoff_year:04d}-{cutoff_month:02d}"

    # All approved reviews within window
    reviews = db.query(models.MonthlyReview).filter(
        models.MonthlyReview.period >= cutoff_period,
        models.MonthlyReview.status == "approved"
    ).order_by(models.MonthlyReview.period).all()

    review_map = {r.id: r.period for r in reviews}

    # All entries from those reviews with salary_increase > 0
    if not review_map:
        all_entries = []
    else:
        all_entries = db.query(models.MonthlyReviewEntry).filter(
            models.MonthlyReviewEntry.review_id.in_(list(review_map.keys())),
            models.MonthlyReviewEntry.salary_increase > 0
        ).all()

    # Group by employee
    emp_data = {}
    for e in all_entries:
        if e.erp_id not in emp_data:
            emp_data[e.erp_id] = {
                "erp_id": e.erp_id,
                "department": e.department_en or e.department,
                "position": e.position_en,
                "increases": [],
                "total_increase": 0.0,
                "last_increase_period": None,
                "last_increase_amount": 0.0,
            }
        period = review_map[e.review_id]
        emp_data[e.erp_id]["increases"].append({
            "period": period,
            "amount": round(e.salary_increase, 2)
        })
        emp_data[e.erp_id]["total_increase"] = round(
            emp_data[e.erp_id]["total_increase"] + e.salary_increase, 2)
        if (emp_data[e.erp_id]["last_increase_period"] is None or
                period > emp_data[e.erp_id]["last_increase_period"]):
            emp_data[e.erp_id]["last_increase_period"] = period
            emp_data[e.erp_id]["last_increase_amount"] = round(e.salary_increase, 2)

    # Enrich with current actual_net from band positions
    bp_map = {bp.erp_id: bp for bp in db.query(models.EmployeeBandPosition).all()}
    emp_map = {e.erp_id: e for e in db.query(models.Employee).filter(
        models.Employee.status == "Active").all()}

    # Employees with NO increase in window (for completeness flag)
    result = list(emp_data.values())
    for r in result:
        bp = bp_map.get(r["erp_id"])
        emp = emp_map.get(r["erp_id"])
        r["actual_net"] = bp.actual_net if bp else None
        r["band_code"]  = bp.band_code if bp else None
        r["dept_group"] = bp.department_group if bp else (emp.department if emp else r["department"])

    # Sort: most recent increase first, then by total
    result.sort(key=lambda x: (x["last_increase_period"] or ""), reverse=True)

    return {
        "months": months,
        "cutoff_period": cutoff_period,
        "approved_reviews": len(review_map),
        "employees_with_increase": len(result),
        "items": result
    }
