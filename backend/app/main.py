from fastapi import FastAPI, HTTPException
from datetime import datetime
from bson import ObjectId
from .db import db
from .models import Event
from .auth import hash_password, verify_password, create_access_token
from .user_models import UserCreate, UserLogin, UserOut
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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