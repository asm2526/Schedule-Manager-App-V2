from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class RepeatRule(BaseModel):
    type: str = Field(default="none", description="none, daily, weekly, biweekly, monthly, custom")
    days: Optional[List[str]] = None  # e.g. ["monday", "wednesday"]

class Event(BaseModel):
    title: str
    description: Optional[str] = None
    color: str = "#3b82f6"
    start: datetime
    end: datetime
    repeat: RepeatRule = RepeatRule()
