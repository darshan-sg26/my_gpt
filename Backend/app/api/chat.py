from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.models.schemas import ChatCreate, ChatResponse, MessageCreate, MessageResponse, UserInDB
from app.api.deps import get_current_user
from app.core.database import get_db
from app.services.ai import generate_chat_response
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.get("/", response_model=List[ChatResponse])
async def get_chats(current_user: UserInDB = Depends(get_current_user)):
    db = get_db()
    chats_cursor = db.chats.find({"user_id": current_user.id}).sort("updated_at", -1)
    chats = []
    async for chat in chats_cursor:
        chat["_id"] = str(chat["_id"])
        chats.append(chat)
    return chats

@router.post("/", response_model=ChatResponse)
async def create_chat(chat_in: ChatCreate, current_user: UserInDB = Depends(get_current_user)):
    db = get_db()
    chat_dict = {
        "user_id": current_user.id,
        "title": chat_in.title,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    result = await db.chats.insert_one(chat_dict)
    chat_dict["_id"] = str(result.inserted_id)
    return chat_dict

@router.get("/{chat_id}/messages", response_model=List[MessageResponse])
async def get_messages(chat_id: str, current_user: UserInDB = Depends(get_current_user)):
    db = get_db()
    try:
        chat_obj_id = ObjectId(chat_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid chat ID format")

    chat = await db.chats.find_one({"_id": chat_obj_id, "user_id": current_user.id})
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
        
    messages_cursor = db.messages.find({"chat_id": chat_id}).sort("created_at", 1)
    messages = []
    async for msg in messages_cursor:
        msg["_id"] = str(msg["_id"])
        messages.append(msg)
    return messages

@router.post("/{chat_id}/messages", response_model=MessageResponse)
async def create_message(chat_id: str, msg_in: MessageCreate, current_user: UserInDB = Depends(get_current_user)):
    db = get_db()
    try:
        chat_obj_id = ObjectId(chat_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid chat ID format")

    chat = await db.chats.find_one({"_id": chat_obj_id, "user_id": current_user.id})
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
        
    user_msg_dict = {
        "chat_id": chat_id,
        "user_id": current_user.id,
        "role": "user",
        "content": msg_in.content,
        "created_at": datetime.utcnow()
    }
    await db.messages.insert_one(user_msg_dict)
    
    history_cursor = db.messages.find({"chat_id": chat_id}).sort("created_at", 1)
    history = []
    async for h_msg in history_cursor:
        history.append({"role": h_msg["role"], "content": h_msg["content"]})
        
    ai_content = await generate_chat_response(history)
    
    ai_msg_dict = {
        "chat_id": chat_id,
        "user_id": current_user.id,
        "role": "ai",
        "content": ai_content,
        "created_at": datetime.utcnow()
    }
    result = await db.messages.insert_one(ai_msg_dict)
    ai_msg_dict["_id"] = str(result.inserted_id)
    
    await db.chats.update_one(
        {"_id": chat_obj_id},
        {"$set": {"updated_at": datetime.utcnow()}}
    )
    
    return ai_msg_dict

@router.delete("/{chat_id}")
async def delete_chat(chat_id: str, current_user: UserInDB = Depends(get_current_user)):
    db = get_db()
    try:
        chat_obj_id = ObjectId(chat_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid chat ID format")
        
    result = await db.chats.delete_one({"_id": chat_obj_id, "user_id": current_user.id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Chat not found")
        
    # Delete associated messages
    await db.messages.delete_many({"chat_id": chat_id})
    return {"message": "Chat deleted successfully"}


