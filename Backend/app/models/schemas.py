from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr
    profile_picture: str = "male"

class ProfilePictureUpdate(BaseModel):
    profile_picture: str

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: str = Field(alias="_id")
    hashed_password: str
    created_at: datetime
    settings: dict = {}

class UserResponse(UserBase):
    id: str = Field(alias="_id")
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ChatBase(BaseModel):
    title: str

class ChatCreate(ChatBase):
    pass

class ChatResponse(ChatBase):
    id: str = Field(alias="_id")
    user_id: str
    created_at: datetime
    updated_at: datetime

class MessageBase(BaseModel):
    role: str # "user" or "ai"
    content: str

class MessageCreate(MessageBase):
    chat_id: str

class MessageResponse(MessageBase):
    id: str = Field(alias="_id")
    chat_id: str
    user_id: str
    created_at: datetime

class SummaryBase(BaseModel):
    original_text: str

class SummaryCreate(SummaryBase):
    pass

class SummaryResponse(SummaryBase):
    id: str = Field(alias="_id")
    user_id: str
    summary_text: str
    created_at: datetime

class ImageBase(BaseModel):
    prompt: str

class ImageCreate(ImageBase):
    pass

class ImageResponse(ImageBase):
    id: str = Field(alias="_id")
    user_id: str
    image_url: str
    created_at: datetime
