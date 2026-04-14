from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import uuid
import json
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Simplified for dev, adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Attempt(BaseModel):
    time: int
    doorId: int
    doorNumber: int
    doorSymbol: str
    keyId: int
    keyName: Optional[str] = None
    keyNumber: Optional[int] = None
    keySymbol: Optional[str] = None
    correct: bool
    phase: Optional[str] = None

class ExperimentData(BaseModel):
    hypothesis: str
    attempts: List[Attempt]
    genAttempts: List[Attempt]
    rule_guess: Optional[str] = None
    comments: Optional[str] = None
    age: Optional[str] = None
    gender: Optional[str] = None

DATA_FILE = 'data.json'

def save_to_json(session_id, data: dict):
    existing_data = {}
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r') as f:
                existing_data = json.load(f)
        except json.JSONDecodeError:
            existing_data = {}
    
    existing_data[session_id] = data
    
    with open(DATA_FILE, 'w') as f:
        json.dump(existing_data, f, indent=4)

@app.post("/submit")
async def submit_results(data: ExperimentData):
    session_id = str(uuid.uuid4())
    payload = data.dict()
    
    print(f"Received complete data for session {session_id}")
    save_to_json(session_id, payload)
    
    return {"status": "success", "uuid": session_id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
