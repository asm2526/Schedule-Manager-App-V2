from fastapi import FastAPI, HTTPException, Body
from datetime import datetime
from bson import ObjectId
from .db import db
from .models import Event
from .auth import hash_password, verify_password, create_access_token
from .user_models import UserCreate, UserLogin, UserOut
from fastapi.middleware.cors import CORSMiddleware
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
import random, os

app = FastAPI()

# allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# email config 
conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS=True,   # 👈 use this instead of MAIL_TLS
    MAIL_SSL_TLS=False,   # 👈 use this instead of MAIL_SSL
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)


# Store reset codes in-memory (later user DB)
reset_codes = {}

#auth routes

@app.post("/register", response_model=UserOut)
async def register(user: UserCreate):
    existing = await db["users"].find_one({"username": user.username})
    if existing:
        raise HTTPException(status_code=400, detail = "Username already exists")
    
    hashed = hash_password(user.password)
    user_doc = {
        "username": user.username,
        "email": user.email,
        "phone": user.phone,
        "hashed_password": hashed,
        "created_at": datetime.utcnow()
    }
    result = await db["users"].insert_one(user_doc)
    new_user = await db["users"].find_one({"_id": result.inserted_id})

    return {
        "id": str(new_user["_id"]),
        "username": new_user["username"],
        "email": new_user["email"],
        "phone": new_user["phone"],
        "created_at": new_user["created_at"]
    }

@app.post("/login")
async def login(user: UserLogin):
    existing = await db["users"].find_one({"username": user.username})
    if not existing or not verify_password(user.password, existing["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user.username})
    return{"access_token": token, "token_type": "bearer"}

@app.post("/forgot-password-request-email")
async def forgot_password_request_email(email: EmailStr = Body(..., embed=True)):
    user = await db["users"].find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")
    
    # Generate a reset code
    code = str(random.randint(100000, 999999))
    reset_codes[email] = code

    #send email
    message = MessageSchema(
        subject = "Your DayPlanner Reset Code",
        recipients=[email],
        body=f"Your password reset code is: {code}",
        subtype="plain",
    )
    fm = FastMail(conf)
    await fm.send_message(message)

    return {"detail": "Reset code sent via email"}

@app.post("/forgot-password-confirm-email")
async def forgot_password_confirm_email(
    email: EmailStr = Body(...),
    code: str = Body(...),
    new_password: str = Body(...)
):
    
    # Check code first
    stored_code = reset_codes.get(email)
    if not stored_code or stored_code != code:
        raise HTTPException(status_code=400, detail="Invalid or expired code")
    
    # normailze email
    normalized_email = email.strip().lower()

    # look up user
    user = await db["users"].find_one({"email": normalized_email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # hash new password
    hashed = hash_password(new_password)
    await db["users"].update_one(
        {"_id": user["_id"]},
        {"$set": {"hashed_password": hashed}}
    )

    # remove used code
    del reset_codes[email]

    return {"detail": "Password updated succesfully"}
    