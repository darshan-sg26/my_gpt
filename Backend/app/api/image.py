from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.models.schemas import ImageCreate, ImageResponse, UserInDB
from app.api.deps import get_current_user
from app.core.database import get_db
from app.services.ai import generate_image_mock
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.get("/", response_model=List[ImageResponse])
async def get_images(current_user: UserInDB = Depends(get_current_user)):
    db = get_db()
    cursor = db.generated_images.find({"user_id": current_user.id}).sort("created_at", -1)
    images = []
    async for img in cursor:
        img["_id"] = str(img["_id"])
        images.append(img)
    return images

@router.post("/", response_model=ImageResponse)
async def create_image(image_in: ImageCreate, current_user: UserInDB = Depends(get_current_user)):
    db = get_db()
    
    image_url = await generate_image_mock(image_in.prompt)
    
    image_dict = {
        "user_id": current_user.id,
        "prompt": image_in.prompt,
        "image_url": image_url,
        "created_at": datetime.utcnow()
    }
    
    result = await db.generated_images.insert_one(image_dict)
    image_dict["_id"] = str(result.inserted_id)
    return image_dict

@router.delete("/{image_id}")
async def delete_image(image_id: str, current_user: UserInDB = Depends(get_current_user)):
    db = get_db()
    try:
        obj_id = ObjectId(image_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")
        
    result = await db.generated_images.delete_one({"_id": obj_id, "user_id": current_user.id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    return {"message": "Image deleted"}
