from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
import models
import auth as auth_module

router = APIRouter(prefix="/api/wageband", tags=["wageband"])


@router.get("/overview")
def get_overview(
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.get_current_user)
):
    """Summary stats – alle Rollen sehen aggregierte Daten"""
    auth_module.log_access(db, current_user, "GET", "wageband/overview", request.client.host if request.client else None)

    positions = db.query(models.EmployeeBandPosition).all()

    # Build trainee set (excluded from below_min alert)
    trainees = {
        e.erp_id for e in db.query(models.Employee).filter(
            models.Employee.employee_type == "Trainee"
        ).all()
    }

    def is_trainee(p): return p.erp_id in trainees

    total = len(positions)
    below_min = sum(1 for p in positions if p.band_position and "\u26a0" in p.band_position and not is_trainee(p))
    below_min_trainee = sum(1 for p in positions if p.band_position and "\u26a0" in p.band_position and is_trainee(p))
    below_target = sum(1 for p in positions if p.band_position and "\u25b2" in p.band_position)
    on_target = sum(1 for p in positions if p.band_position and ("\u2713" in p.band_position or "\u2605" in p.band_position))
    no_data = sum(1 for p in positions if not p.band_position or p.band_position == "\u2013")

    # By section
    sections = {}
    for p in positions:
        sec = p.section or "Unknown"
        if sec not in sections:
            sections[sec] = {"total": 0, "below_min": 0, "below_target": 0, "on_target": 0}
        sections[sec]["total"] += 1
        if p.band_position:
            if "\u26a0" in p.band_position:
                sections[sec]["below_min"] += 1
            elif "\u25b2" in p.band_position:
                sections[sec]["below_target"] += 1
            elif "\u2713" in p.band_position or "\u2605" in p.band_position:
                sections[sec]["on_target"] += 1

    # By department group
    dept_groups = {}
    for p in positions:
        dg = p.department_group or "Unknown"
        if dg not in dept_groups:
            dept_groups[dg] = {"total": 0, "below_min": 0, "below_target": 0, "on_target": 0, "section": p.section}
        dept_groups[dg]["total"] += 1
        if p.band_position:
            if "\u26a0" in p.band_position:
                dept_groups[dg]["below_min"] += 1
            elif "\u25b2" in p.band_position:
                dept_groups[dg]["below_target"] += 1
            elif "\u2713" in p.band_position or "\u2605" in p.band_position:
                dept_groups[dg]["on_target"] += 1

    return {
        "summary": {
            "total": total,
            "below_min": below_min,
            "below_min_trainee": below_min_trainee,
            "below_target": below_target,
            "on_target": on_target,
            "no_data": no_data,
            "pct_on_target": round(on_target / total * 100, 1) if total > 0 else 0
        },
        "by_section": sections,
        "by_department": dept_groups
    }


@router.get("/detail")
def get_detail(
    request: Request,
    section: str = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("hr", "payroll", "admin"))
):
    """Detail-Ansicht – nur HR, Payroll, Admin"""
    auth_module.log_access(db, current_user, "GET", "wageband/detail", request.client.host if request.client else None)

    query = db.query(models.EmployeeBandPosition)
    if section:
        query = query.filter(models.EmployeeBandPosition.section == section)

    positions = query.all()

    # Build employee_type lookup
    emp_types = {e.erp_id: e.employee_type for e in db.query(models.Employee).filter(
        models.Employee.erp_id.isnot(None)).all()}

    return [
        {
            "erp_id": p.erp_id,
            "section": p.section,
            "department_group": p.department_group,
            "position_bg": p.position_bg,
            "band_code": p.band_code,
            "en_title": p.en_title,
            "surcharge": p.surcharge,
            "min_net": p.min_net,
            "target_net": p.target_net,
            "max_net": p.max_net,
            "actual_net": p.actual_net,
            "band_position": p.band_position,
            "cost_center": p.cost_center,
            "employee_type": emp_types.get(p.erp_id, "Regular") or "Regular"
        }
        for p in positions
    ]


@router.get("/bands")
def get_bands(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.get_current_user)
):
    """Alle Wage Band Definitionen"""
    bands = db.query(models.WageBand).order_by(models.WageBand.department, models.WageBand.code).all()
    return [
        {
            "code": b.code,
            "department": b.department,
            "en_title": b.en_title,
            "surcharge": b.surcharge,
            "min_net": b.min_net,
            "target_net": b.target_net,
            "max_net": b.max_net,
            "notes": b.notes
        }
        for b in bands
    ]


@router.get("/transparency/list")
def list_transparency_employees(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("hr", "admin"))
):
    """All employees with band data — for transparency page dropdown"""
    positions = db.query(models.EmployeeBandPosition).order_by(models.EmployeeBandPosition.erp_id).all()
    seen = set()
    result = []
    for p in positions:
        if p.erp_id in seen:
            continue
        seen.add(p.erp_id)
        emp = db.query(models.Employee).filter(models.Employee.erp_id == p.erp_id).first()
        result.append({
            "erp_id": p.erp_id,
            "en_title": p.en_title or p.position_bg,
            "department_group": p.department_group,
            "section": p.section,
            "status": emp.status if emp else "Active",
        })
    return result


@router.get("/transparency/{erp_id}")
def get_transparency(
    erp_id: str,
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("hr", "admin"))
):
    """EU Pay Transparency Directive 2023/970/EU - per-employee disclosure data"""
    from datetime import date

    auth_module.log_access(db, current_user, "GET", f"wageband/transparency/{erp_id}", request.client.host if request.client else None)

    bp = db.query(models.EmployeeBandPosition).filter(models.EmployeeBandPosition.erp_id == erp_id).first()
    if not bp:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="No band data found for this employee")

    emp = db.query(models.Employee).filter(models.Employee.erp_id == erp_id).first()

    # Peer group: same band_code + surcharge
    peers = db.query(models.EmployeeBandPosition).filter(
        models.EmployeeBandPosition.band_code == bp.band_code,
        models.EmployeeBandPosition.surcharge == bp.surcharge,
        models.EmployeeBandPosition.actual_net != None
    ).all()
    peer_salaries = [p.actual_net for p in peers if p.actual_net]
    peer_avg = round(sum(peer_salaries) / len(peer_salaries), 2) if peer_salaries else None
    peer_min = round(min(peer_salaries), 2) if peer_salaries else None
    peer_max = round(max(peer_salaries), 2) if peer_salaries else None

    pct = None
    if bp.min_net and bp.max_net and bp.actual_net and bp.max_net > bp.min_net:
        pct = round((bp.actual_net - bp.min_net) / (bp.max_net - bp.min_net) * 100, 1)

    tenure_years = None
    entry_date = None
    fte = None
    department = None
    if emp:
        if emp.entry_date:
            delta = date.today() - emp.entry_date
            tenure_years = round(delta.days / 365.25, 1)
            entry_date = emp.entry_date.isoformat()
        fte = emp.fte
        department = emp.department_en or emp.department

    return {
        "generated_date": date.today().isoformat(),
        "erp_id": erp_id,
        "position_en": bp.en_title or bp.position_bg,
        "position_bg": bp.position_bg,
        "department": department,
        "department_group": bp.department_group,
        "section": bp.section,
        "entry_date": entry_date,
        "fte": fte,
        "cost_center": bp.cost_center,
        "tenure_years": tenure_years,
        "band_code": bp.band_code,
        "surcharge": bp.surcharge,
        "min_net": bp.min_net,
        "target_net": bp.target_net,
        "max_net": bp.max_net,
        "actual_net": bp.actual_net,
        "band_position": bp.band_position,
        "band_pct": pct,
        "peer_count": len(peers),
        "peer_avg_net": peer_avg,
        "peer_min_net": peer_min,
        "peer_max_net": peer_max,
    }
