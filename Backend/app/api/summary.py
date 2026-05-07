from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.models.schemas import SummaryCreate, SummaryResponse, UserInDB
from app.api.deps import get_current_user
from app.core.database import get_db
from app.services.ai import generate_summary
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.get("/", response_model=List[SummaryResponse])
async def get_summaries(current_user: UserInDB = Depends(get_current_user)):
    db = get_db()
    cursor = db.summaries.find({"user_id": current_user.id}).sort("created_at", -1)
    summaries = []
    async for s in cursor:
        s["_id"] = str(s["_id"])
        summaries.append(s)
    return summaries

@router.post("/", response_model=SummaryResponse)
async def create_summary(summary_in: SummaryCreate, current_user: UserInDB = Depends(get_current_user)):
    db = get_db()
    
    summary_text = await generate_summary(summary_in.original_text)
    
    summary_dict = {
        "user_id": current_user.id,
        "original_text": summary_in.original_text,
        "summary_text": summary_text,
        "created_at": datetime.utcnow()
    }
    
    result = await db.summaries.insert_one(summary_dict)
    summary_dict["_id"] = str(result.inserted_id)
    return summary_dict

@router.delete("/{summary_id}")
async def delete_summary(summary_id: str, current_user: UserInDB = Depends(get_current_user)):
    db = get_db()
    try:
        obj_id = ObjectId(summary_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")
        
    result = await db.summaries.delete_one({"_id": obj_id, "user_id": current_user.id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Summary not found")
    return {"message": "Summary deleted"}
