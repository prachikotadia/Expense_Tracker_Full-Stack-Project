from pydantic import BaseSettings, Field, AnyUrl
from typing import List


class Settings(BaseSettings):
    DATABASE_URL: AnyUrl = Field(..., env="DATABASE_URL")
    JWT_SECRET_KEY: str = Field(..., env="JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost",
        "http://localhost:3000",
    ]

    # Rate limit for login attempts per IP (optional add-on)
    LOGIN_RATE_LIMIT: int = 5

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'


settings = Settings() 