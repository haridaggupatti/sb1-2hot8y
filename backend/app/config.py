from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    openai_api_key: Optional[str] = None
    redis_url: str = "redis://localhost:6379/0"
    database_url: str = "sqlite:///./app.db"

    class Config:
        env_file = ".env"