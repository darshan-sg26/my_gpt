from fastapi import APIRouter, Depends
from app.models.schemas import UserResponse, UserInDB
from app.api.deps import get_current_user
from app.core.database import get_db

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: UserInDB = Depends(get_current_user)):
    return current_user.model_dump(by_alias=True)

@router.get("/dashboard")
async def get_dashboard(current_user: UserInDB = Depends(get_current_user)):
    db = get_db()
    user_id = current_user.id
    
    # Get recent chats
    recent_chats_cursor = db.chats.find({"user_id": user_id}).sort("updated_at", -1).limit(5)
    recent_chats = []
    async for chat in recent_chats_cursor:
        chat["_id"] = str(chat["_id"])
        recent_chats.append(chat)
        
    # Get recent summaries
    recent_summaries_cursor = db.summaries.find({"user_id": user_id}).sort("created_at", -1).limit(5)
    recent_summaries = []
    async for summary in recent_summaries_cursor:
        summary["_id"] = str(summary["_id"])
        recent_summaries.append(summary)
        
    # Get recent images
    recent_images_cursor = db.generated_images.find({"user_id": user_id}).sort("created_at", -1).limit(5)
    recent_images = []
    async for image in recent_images_cursor:
        image["_id"] = str(image["_id"])
        recent_images.append(image)
        
    # Usage stats (counts)
    chats_count = await db.chats.count_documents({"user_id": user_id})
    summaries_count = await db.summaries.count_documents({"user_id": user_id})
    images_count = await db.generated_images.count_documents({"user_id": user_id})
    
    return {
        "recent_chats": recent_chats,
        "recent_summaries": recent_summaries,
        "recent_images": recent_images,
        "stats": {
            "chats_count": chats_count,
            "summaries_count": summaries_count,
            "images_count": images_count
        }
    }
