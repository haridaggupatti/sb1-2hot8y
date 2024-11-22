from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import List
import os

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demo purposes
users_db = {
    "test@example.com": {
        "email": "test@example.com",
        "hashed_password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKxcQw/IIHR3/1W",  # password123
        "is_active": True,
        "is_admin": True,
        "expires_at": (datetime.utcnow() + timedelta(days=30)).isoformat()
    }
}

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_db.get(form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    # For demo purposes, we're accepting any password for test@example.com
    if form_data.username == "test@example.com" and form_data.password == "password123":
        return {
            "access_token": "demo_token",
            "token_type": "bearer"
        }
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password"
    )

@app.get("/api/users")
async def get_users():
    return list(users_db.values())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)