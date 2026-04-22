from sqlalchemy import Column, Integer, String, Float, Boolean, Date, DateTime, Text
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False)  # admin | manager | hr | payroll
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    last_login = Column(DateTime, nullable=True)


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    username = Column(String, nullable=False)
    action = Column(String, nullable=False)
    resource = Column(String, nullable=False)
    timestamp = Column(DateTime, server_default=func.now())
    ip_address = Column(String, nullable=True)


class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    erp_id = Column(String, nullable=True, index=True)
    department = Column(String, nullable=False)
    department_en = Column(String, nullable=True)
    position_bg = Column(String, nullable=True)
    position_en = Column(String, nullable=True)
    entry_date = Column(Date, nullable=True)
    fte = Column(Float, default=1.0)
    cost_center = Column(String, nullable=True)
    status = Column(String, default="Active")  # Active | Inactive
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    gender = Column(String, nullable=True)    # M | F | D | NULL
    birth_date = Column(Date, nullable=True)
    employee_type = Column(String, default="Regular")  # Regular | Trainee | Apprentice


class WageBand(Base):
    __tablename__ = "wage_bands"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    section = Column(String, nullable=True)
    department = Column(String, nullable=False)
    bg_title = Column(String, nullable=True)
    en_title = Column(String, nullable=False)
    surcharge = Column(String, default="C")
    min_net = Column(Float, nullable=False)
    target_net = Column(Float, nullable=False)
    max_net = Column(Float, nullable=False)
    notes = Column(Text, nullable=True)


class EmployeeBandPosition(Base):
    __tablename__ = "employee_band_positions"
    id = Column(Integer, primary_key=True, index=True)
    erp_id = Column(String, nullable=True, index=True)
    section = Column(String, nullable=True)
    department_group = Column(String, nullable=True)
    position_bg = Column(String, nullable=True)
    band_code = Column(String, nullable=True)
    en_title = Column(String, nullable=True)
    surcharge = Column(String, nullable=True)
    min_net = Column(Float, nullable=True)
    target_net = Column(Float, nullable=True)
    max_net = Column(Float, nullable=True)
    actual_net = Column(Float, nullable=True)
    band_position = Column(String, nullable=True)
    cost_center = Column(String, nullable=True)


class SalaryRecord(Base):
    __tablename__ = "salary_records"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, nullable=False, index=True)
    erp_id = Column(String, nullable=True)
    effective_date = Column(Date, nullable=True)
    department = Column(String, nullable=True)
    cost_center = Column(String, nullable=True)
    base_salary_gross = Column(Float, nullable=True)
    prof_exp_gross = Column(Float, nullable=True)
    fixed_bonus = Column(Float, nullable=True)
    food_voucher = Column(Float, nullable=True)
    total_gross = Column(Float, nullable=True)
    salary_netto = Column(Float, nullable=True)
    total_monthly_netto = Column(Float, nullable=True)
    annual_netto = Column(Float, nullable=True)
    month_employer_cost = Column(Float, nullable=True)
    annual_employer_cost = Column(Float, nullable=True)


class BudgetControl(Base):
    __tablename__ = "budget_control"
    id = Column(Integer, primary_key=True, index=True)
    month = Column(Integer, nullable=False)
    department = Column(String, nullable=False)
    cost_center = Column(Integer, nullable=True)
    approved_annual_budget = Column(Float, nullable=True)
    approved_monthly_budget = Column(Float, nullable=True)
    actual_payroll = Column(Float, nullable=True)
    variance = Column(Float, nullable=True)
    variance_pct = Column(Float, nullable=True)
    release_status = Column(String, nullable=True)
    released_by = Column(String, nullable=True)
    release_date = Column(Date, nullable=True)
