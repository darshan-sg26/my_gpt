from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client: AsyncIOMotorClient = None
db = None

async def connect_to_mongo():
    global client, db
    if settings.MONGODB_URL:
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        db = client.get_database("mygpt")
        print("Connected to MongoDB")
    else:
        print("Warning: MONGODB_URL is not set.")

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("Closed MongoDB connection")

def get_db():
    return db
