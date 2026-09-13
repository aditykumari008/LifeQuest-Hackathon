from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import User, Character, Wallet, Streak
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class RegisterInput(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=100)

class LoginInput(BaseModel):
    email: EmailStr
    password: str

def user_response(user):
    return {"id": user.id, "name": user.name, "email": user.email}

@router.post("/register")
def register(data: RegisterInput, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email.lower()).first():
        raise HTTPException(status_code=400, detail="Email is already registered")

    user = User(name=data.name.strip(), email=data.email.lower(), password_hash=hash_password(data.password))
    db.add(user)
    db.commit()
    db.refresh(user)

    db.add(Character(user_id=user.id))
    db.add(Wallet(user_id=user.id))
    db.add(Streak(user_id=user.id))
    db.commit()

    return {"access_token": create_access_token(str(user.id)), "token_type": "bearer", "user": user_response(user)}

@router.post("/login")
def login(data: LoginInput, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email.lower()).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"access_token": create_access_token(str(user.id)), "token_type": "bearer", "user": user_response(user)}
