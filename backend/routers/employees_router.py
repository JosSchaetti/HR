from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from database import get_db
import models
import auth as auth_module

router = APIRouter(prefix="/api/employees", tags=["employees"])


@router.get("/")
def get_employees(
    request: Request,
    department: str = None,
    status: str = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.get_current_user)
):
    auth_module.log_access(db, current_user, "GET", "employees", request.client.host if request.client else None)
    query = db.query(models.Employee)
    if department:
        query = query.filter(models.Employee.department.ilike(f"%{department}%"))
    if status:
        query = query.filter(models.Employee.status == status)
    employees = query.order_by(models.Employee.department).all()
    # Build erp_id -> en_title map from band positions
    band_pos_all = db.query(models.EmployeeBandPosition).all()
    en_title_map = {bp.erp_id: bp.en_title for bp in band_pos_all if bp.erp_id}
    result = []
    for e in employees:
        result.append({
            "id": e.id,
            "erp_id": e.erp_id,
            "first_name": e.first_name,
            "last_name": e.last_name,
            "gender": e.gender,
            "birth_date": e.birth_date.isoformat() if e.birth_date else None,
            "department": e.department,
            "department_en": e.department_en,
            "position_bg": e.position_bg,
            "position_en": en_title_map.get(e.erp_id) or e.position_en,
            "entry_date": e.entry_date.isoformat() if e.entry_date else None,
            "fte": e.fte,
            "cost_center": e.cost_center,
            "status": e.status,
            "employee_type": e.employee_type or "Regular"
        })
    return result


@router.get("/stats")
def get_stats(
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.get_current_user)
):
    from sqlalchemy import func
    auth_module.log_access(db, current_user, "GET", "employees/stats", request.client.host if request.client else None)

    from datetime import date, timedelta
    today = date.today()
    cutoff = today - timedelta(days=365)
    total = db.query(models.Employee).count()
    active = db.query(models.Employee).filter(models.Employee.status == "Active").count()
    inactive = db.query(models.Employee).filter(models.Employee.status == "Inactive").count()
    new_count = db.query(models.Employee).filter(
        models.Employee.entry_date >= cutoff,
        models.Employee.status == "Active"
    ).count()

    # By department - sorted ascending by count
    by_dept = db.query(
        models.Employee.department,
        func.count(models.Employee.id).label("count")
    ).filter(models.Employee.status == "Active").group_by(
        models.Employee.department
    ).order_by(func.count(models.Employee.id).asc()).all()

    # Monthly payroll per department from budget_control
    dept_pay_raw = db.query(
        models.BudgetControl.department,
        func.sum(models.BudgetControl.actual_payroll).label("payroll")
    ).group_by(models.BudgetControl.department).all()
    dept_payroll = {row[0]: round(row[1] or 0, 0) for row in dept_pay_raw}

    # By cost center raw — include department name for labels
    by_cc_raw = db.query(
        models.Employee.cost_center,
        models.Employee.department,
        func.count(models.Employee.id).label("count")
    ).filter(
        models.Employee.status == "Active",
        models.Employee.cost_center.isnot(None)
    ).group_by(models.Employee.cost_center, models.Employee.department).all()

    # Build headcount hierarchy (bereich + abteilung only)
    bereich   = {}
    abteilung = {}
    b_names   = {}
    abt_names = {}

    for cc, dept, cnt in by_cc_raw:
        try:
            n = int(str(cc).strip())
            if n < 1000:
                continue
            b, a = n // 1000, n // 100
            bereich[b] = bereich.get(b, 0) + cnt
            abteilung[a] = abteilung.get(a, 0) + cnt
            for key, nm in [(b, b_names), (a, abt_names)]:
                if key not in nm:
                    nm[key] = {}
                nm[key][dept or ""] = nm[key].get(dept or "", 0) + cnt
        except (ValueError, TypeError):
            continue

    # Monthly payroll per bereich / abteilung from budget_control
    bc_raw = db.query(
        models.BudgetControl.cost_center,
        func.sum(models.BudgetControl.actual_payroll).label("payroll")
    ).group_by(models.BudgetControl.cost_center).all()

    b_payroll  = {}
    abt_payroll= {}
    for cc, pay in bc_raw:
        try:
            n = int(str(cc).strip()) if cc else 0
            if n < 1000:
                continue
            b_payroll[n // 1000]  = b_payroll.get(n // 1000, 0) + (pay or 0)
            abt_payroll[n // 100] = abt_payroll.get(n // 100, 0) + (pay or 0)
        except (ValueError, TypeError):
            continue

    def dominant_name(nm_dict, key):
        names = nm_dict.get(key, {})
        return max(names, key=names.get) if names else ""

    def by_count_named(d, nm_dict, pay_dict):
        return sorted(
            [{"cc": str(k), "count": v, "name": dominant_name(nm_dict, k),
              "payroll": round(pay_dict.get(k, 0), 0)} for k, v in d.items()],
            key=lambda x: x["count"]
        )

    def by_key_desc(d, nm_dict, pay_dict):
        return sorted(
            [{"cc": str(k), "count": v, "name": dominant_name(nm_dict, k),
              "payroll": round(pay_dict.get(k, 0), 0)} for k, v in d.items()],
            key=lambda x: int(x["cc"]), reverse=True
        )

    return {
        "total": total,
        "active": active,
        "inactive": inactive,
        "new_count": new_count,
        "by_department": [{"department": d, "count": c, "payroll": dept_payroll.get(d, 0)} for d, c in by_dept],
        "by_bereich": by_count_named(bereich, b_names, b_payroll),
        "by_abteilung": by_key_desc(abteilung, abt_names, abt_payroll),
    }
