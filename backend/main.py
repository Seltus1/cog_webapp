from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import json
from supabase import create_client, Client
from mangum import Mangum
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_ANON_KEY")

if SUPABASE_URL and SUPABASE_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    print("Warning: Supabase credentials not found.")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    session_id: str  # Now sent from frontend
    hypothesis: str
    attempts: List[Attempt]
    genAttempts: List[Attempt]
    rule_guess: Optional[str] = "N/A" # Default to N/A for partial saves
    comments: Optional[str] = None
    age: Optional[str] = None
    gender: Optional[str] = None

async def upsert_to_supabase(data: dict):
    if not supabase: return False
    
    # .upsert() looks for a unique column (session_id) and updates if found
    # Make sure 'session_id' is marked as UNIQUE in your Supabase table schema!
    response = supabase.table("experiments").upsert({
        "session_id": data["session_id"], 
        "data": data
    }, on_conflict="session_id").execute()
    
    return response

@app.post("/submit")
async def submit_results(data: ExperimentData):
    payload = json.loads(data.json())
    try:
        await upsert_to_supabase(payload)
        return {"status": "success", "session_id": data.session_id}
    except Exception as e:
        print(f"Error: {e}")
        return {"status": "error", "message": str(e)}, 500

handler = Mangum(app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
