from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
import models
import auth as auth_module

router = APIRouter(prefix="/api/users", tags=["users"])


class UserCreate(BaseModel):
    username: str
    full_name: str
    role: str
    password: str


class UserUpdate(BaseModel):
    full_name: str = None
    role: str = None
    is_active: bool = None
    password: str = None


VALID_ROLES = ["admin", "manager", "hr", "payroll"]


@router.get("/")
def list_users(
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("admin"))
):
    auth_module.log_access(db, current_user, "GET", "users", request.client.host if request.client else None)
    users = db.query(models.User).all()
    return [
        {
            "id": u.id,
            "username": u.username,
            "full_name": u.full_name,
            "role": u.role,
            "is_active": u.is_active,
            "last_login": u.last_login,
            "created_at": u.created_at
        }
        for u in users
    ]


@router.post("/")
def create_user(
    user_data: UserCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("admin"))
):
    if user_data.role not in VALID_ROLES:
        raise HTTPException(status_code=400, detail=f"Ungültige Rolle. Erlaubt: {VALID_ROLES}")

    existing = db.query(models.User).filter(models.User.username == user_data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Benutzername bereits vergeben")

    new_user = models.User(
        username=user_data.username,
        full_name=user_data.full_name,
        role=user_data.role,
        hashed_password=auth_module.hash_password(user_data.password),
        is_active=True
    )
    db.add(new_user)
    db.commit()
    auth_module.log_access(db, current_user, "CREATE", f"users/{user_data.username}", request.client.host if request.client else None)
    return {"message": f"User '{user_data.username}' erstellt", "id": new_user.id}


@router.put("/{user_id}")
def update_user(
    user_id: int,
    user_data: UserUpdate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("admin"))
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User nicht gefunden")
    if user_data.full_name:
        user.full_name = user_data.full_name
    if user_data.role:
        if user_data.role not in VALID_ROLES:
            raise HTTPException(status_code=400, detail="Ungültige Rolle")
        user.role = user_data.role
    if user_data.is_active is not None:
        user.is_active = user_data.is_active
    if user_data.password:
        user.hashed_password = auth_module.hash_password(user_data.password)
    db.commit()
    auth_module.log_access(db, current_user, "UPDATE", f"users/{user_id}", request.client.host if request.client else None)
    return {"message": "User aktualisiert"}


@router.get("/audit-log")
def get_audit_log(
    request: Request,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_roles("admin"))
):
    logs = db.query(models.AuditLog).order_by(models.AuditLog.timestamp.desc()).limit(limit).all()
    return [
        {
            "id": l.id,
            "username": l.username,
            "action": l.action,
            "resource": l.resource,
            "timestamp": l.timestamp,
            "ip_address": l.ip_address
        }
        for l in logs
    ]
