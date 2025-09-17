from fastapi import FastAPI
from .db import db

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "backend is running"}

@app.get("/test-mongo")
async def test_mongo():
    result = await db["test"].insert_one({"msg": "hello mongo"})
    doc = await db["test"].find_one({"_id": result.inserted_id})
    return {"inserted": str(result.inserted_id), "doc": {"msg": doc["msg"]}}