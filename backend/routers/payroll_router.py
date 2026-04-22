from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
import models
import auth as auth_module

router = APIRouter(prefix="/api/payroll", tags=["payroll"])


@router.get("/budget")
def get_budget(
    request: Request,
    month: int = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("payroll", "admin"))
):
    """Budget Control – nur Payroll und Admin"""
    auth_module.log_access(db, current_user, "GET", "payroll/budget", request.client.host if request.client else None)

    query = db.query(models.BudgetControl)
    if month:
        query = query.filter(models.BudgetControl.month == month)

    records = query.order_by(models.BudgetControl.department).all()
    return [
        {
            "month": r.month,
            "department": r.department,
            "cost_center": r.cost_center,
            "approved_annual_budget": r.approved_annual_budget,
            "approved_monthly_budget": r.approved_monthly_budget,
            "actual_payroll": r.actual_payroll,
            "variance": r.variance,
            "variance_pct": round(r.variance_pct * 100, 2) if r.variance_pct else 0,
            "release_status": r.release_status,
            "released_by": r.released_by
        }
        for r in records
    ]


@router.get("/budget/summary")
def get_budget_summary(
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("payroll", "admin", "manager"))
):
    """Aggregierte Budget-Zusammenfassung – auch für Manager sichtbar"""
    auth_module.log_access(db, current_user, "GET", "payroll/budget/summary", request.client.host if request.client else None)

    records = db.query(models.BudgetControl).all()
    if not records:
        return {"total_annual_budget": 0, "total_actual": 0, "total_variance": 0, "departments": 0}

    total_annual = sum(r.approved_annual_budget or 0 for r in records)
    total_monthly_budget = sum(r.approved_monthly_budget or 0 for r in records)
    total_actual = sum(r.actual_payroll or 0 for r in records)
    total_variance = total_actual - total_monthly_budget

    return {
        "total_annual_budget": round(total_annual, 2),
        "total_monthly_budget": round(total_monthly_budget, 2),
        "total_actual_payroll": round(total_actual, 2),
        "total_variance": round(total_variance, 2),
        "total_variance_pct": round(total_variance / total_monthly_budget * 100, 2) if total_monthly_budget else 0,
        "departments_count": len(records)
    }


@router.post("/release/{department}")
def release_payroll(
    department: str,
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("payroll", "admin"))
):
    """Payroll freigeben für eine Abteilung"""
    from datetime import date
    record = db.query(models.BudgetControl).filter(
        models.BudgetControl.department == department
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Abteilung nicht gefunden")

    record.release_status = "Released"
    record.released_by = current_user.full_name
    record.release_date = date.today()
    db.commit()

    auth_module.log_access(db, current_user, "RELEASE", f"payroll/{department}", request.client.host if request.client else None)
    return {"status": "released", "department": department, "released_by": current_user.full_name}


@router.get("/salary")
def get_salary_records(
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("payroll", "admin"))
):
    """Individuelle Gehaltsdaten – nur Payroll und Admin"""
    auth_module.log_access(db, current_user, "GET", "payroll/salary", request.client.host if request.client else None)

    records = db.query(models.SalaryRecord).order_by(models.SalaryRecord.department).all()
    return [
        {
            "erp_id": r.erp_id,
            "department": r.department,
            "cost_center": r.cost_center,
            "base_salary_gross": r.base_salary_gross,
            "prof_exp_gross": r.prof_exp_gross,
            "fixed_bonus": r.fixed_bonus,
            "food_voucher": r.food_voucher,
            "total_gross": r.total_gross,
            "salary_netto": r.salary_netto,
            "total_monthly_netto": r.total_monthly_netto,
            "annual_netto": r.annual_netto,
            "month_employer_cost": r.month_employer_cost,
            "annual_employer_cost": r.annual_employer_cost
        }
        for r in records
    ]
