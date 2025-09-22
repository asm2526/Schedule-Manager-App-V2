from fastapi import FastAPI, HTTPException
from bson import ObjectId
from .db import db
from .models import Event

app = FastAPI()

def serialize_event(event):
    event["_id"] = str(event["_id"])
    return event

@app.post("/events")
async def create_event(event: Event):
    result = await db["events"].insert_one(event.dict())
    new_event = await db["events"].find_one({"_id": result.inserted_id})
    return serialize_event(new_event)
