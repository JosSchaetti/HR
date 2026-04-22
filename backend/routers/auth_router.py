from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
import models
import auth as auth_module

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login")
def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Case-insensitive username lookup
    user = db.query(models.User).filter(
        models.User.username == form_data.username.lower().strip()
    ).first()
    if not user or not auth_module.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Benutzername oder Passwort falsch",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account deaktiviert")

    user.last_login = datetime.utcnow()
    db.commit()

    ip = request.client.host if request.client else None
    auth_module.log_access(db, user, "LOGIN", "auth", ip)

    token = auth_module.create_access_token({"sub": user.username})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "full_name": user.full_name,
            "role": user.role
        }
    }


@router.get("/me")
def get_me(current_user: models.User = Depends(auth_module.get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "last_login": current_user.last_login
    }
