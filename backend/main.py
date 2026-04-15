from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid
import os
from supabase import create_client, Client
from mangum import Mangum
from dotenv import load_dotenv

# Load environment variables (for local dev)
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_ANON_KEY")

if SUPABASE_URL and SUPABASE_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    print("Warning: Supabase credentials not found. DB storage will fail.")

app = FastAPI()

# Configure CORS
# For local dev, allow all. For production, you could restrict this to your Netlify URL.
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
    hypothesis: str
    attempts: List[Attempt]
    genAttempts: List[Attempt]
    rule_guess: Optional[str] = None
    comments: Optional[str] = None
    age: Optional[str] = None
    gender: Optional[str] = None

async def save_to_supabase(session_id, data: dict):
    if not supabase:
        print("Supabase client not initialized.")
        return False
    
    # Add the session_id into the data object so it's still saved
    data["session_id"] = session_id
    
    # Only insert into the 'data' column. 
    # This assumes your 'id' column in Supabase is set to 'Identity' (auto-incrementing bigint).
    response = supabase.table("experiments").insert({
        "data": data
    }).execute()
    
    return response

@app.post("/submit")
async def submit_results(data: ExperimentData):
    session_id = str(uuid.uuid4())
    payload = data.dict()
    
    print(f"Received complete data for session {session_id}")
    
    # Save to Supabase
    try:
        await save_to_supabase(session_id, payload)
        return {"status": "success", "uuid": session_id}
    except Exception as e:
        print(f"Error saving to Supabase: {e}")
        return {"status": "error", "message": str(e)}, 500

# This is the entry point for Netlify Functions
handler = Mangum(app)

if __name__ == "__main__":
    import uvicorn
    # Local dev still works with: python main.py
    uvicorn.run(app, host="0.0.0.0", port=8000)
