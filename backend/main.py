from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import uuid
import json

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
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
    keyNumber: int
    keySymbol: str
    correct: bool

class ExperimentData(BaseModel):
    attempts: List[Attempt]
    genAttempts: List[Attempt]

@app.post("/submit")
async def submit_results(data: ExperimentData):
    session_id = str(uuid.uuid4())
    
    payload = {
        session_id: {
            "attempts": [a.dict() for a in data.attempts],
            "genAttempts": [a.dict() for a in data.genAttempts]
        }
    }
    
    print(f"Received data {session_id}:")
    print(payload)
    
    with open('data.json', 'w') as file:
        json.dump(payload, file, indent=4)
    
    return {"status": "success", "uuid": session_id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    # uvicorn main:app --reload