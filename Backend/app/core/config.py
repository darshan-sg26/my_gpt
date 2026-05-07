import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "MyGPT API"
    MONGODB_URL: str = os.getenv("MONGODB_URL", "")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "secret")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

settings = Settings()
