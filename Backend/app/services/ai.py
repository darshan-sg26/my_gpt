import google.generativeai as genai
from app.core.config import settings
from typing import AsyncGenerator

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)

# Using gemini-2.5-flash as requested by user
model_name = "gemini-2.5-flash" 

SYSTEM_INSTRUCTION = (
    "You are MyGPT, a premium AI assistant. Your personality is professional, "
    "lively, and sophisticated. Provide well-structured, engaging, and "
    "intelligent responses. Avoid being plain; instead, be insightful and "
    "enthusiastic about helping the user."
)

async def generate_chat_response(messages: list) -> str:
    """
    Generate a full response from the Gemini model based on chat history.
    """
    if not settings.GEMINI_API_KEY:
        return "Error: GEMINI_API_KEY is not configured."
        
    try:
        model = genai.GenerativeModel(
            model_name=model_name,
            system_instruction=SYSTEM_INSTRUCTION
        )
        
        # Convert internal messages to Gemini format
        formatted_messages = []
        for msg in messages:
            role = "model" if msg["role"] == "ai" else "user"
            formatted_messages.append({"role": role, "parts": [msg["content"]]})
            
        history = formatted_messages[:-1]
        last_msg = formatted_messages[-1]["parts"][0]
        
        chat = model.start_chat(history=history)
        # Using async method to avoid blocking
        response = await chat.send_message_async(last_msg)
        return response.text
    except Exception as e:
        return f"Error communicating with AI: {str(e)}"

async def generate_chat_stream(messages: list) -> AsyncGenerator[str, None]:
    """
    Generate a streaming response from the Gemini model.
    """
    if not settings.GEMINI_API_KEY:
        yield "Error: GEMINI_API_KEY is not configured."
        return
        
    try:
        model = genai.GenerativeModel(
            model_name=model_name,
            system_instruction=SYSTEM_INSTRUCTION
        )
        
        formatted_messages = []
        for msg in messages:
            role = "model" if msg["role"] == "ai" else "user"
            formatted_messages.append({"role": role, "parts": [msg["content"]]})
            
        history = formatted_messages[:-1]
        last_msg = formatted_messages[-1]["parts"][0]
        
        chat = model.start_chat(history=history)
        response = await chat.send_message_async(last_msg, stream=True)
        
        async for chunk in response:
            if chunk.text:
                yield chunk.text
    except Exception as e:
        yield f"Error in stream: {str(e)}"

async def generate_summary(text: str) -> str:
    """
    Generate a concise summary of the provided text.
    """
    if not settings.GEMINI_API_KEY:
        return "Error: GEMINI_API_KEY is not configured."
        
    try:
        model = genai.GenerativeModel(
            model_name=model_name,
            system_instruction="You are an expert summarizer. Create clear, professional, and well-structured summaries."
        )
        prompt = f"Please provide a concise, clear, and well-structured summary of the following text:\n\n{text}"
        response = await model.generate_content_async(prompt)
        return response.text
    except Exception as e:
        return f"Error communicating with AI: {str(e)}"

async def generate_image_mock(prompt: str) -> str:
    """
    Generate an image using the Gemini Imagen API. 
    Falls back to Pollinations.ai if the Gemini key is on a free tier or unsupported.
    """
    import urllib.parse
    import random
    import httpx
    
    # Try Gemini Imagen API first
    if settings.GEMINI_API_KEY:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key={settings.GEMINI_API_KEY}"
        payload = {
            "instances": [{"prompt": prompt}],
            "parameters": {"sampleCount": 1}
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload, timeout=30.0)
                if response.status_code == 200:
                    data = response.json()
                    predictions = data.get("predictions", [])
                    if predictions and "bytesBase64Encoded" in predictions[0]:
                        b64_data = predictions[0]["bytesBase64Encoded"]
                        return f"data:image/jpeg;base64,{b64_data}"
        except Exception as e:
            print(f"Gemini Imagen API failed: {e}")
            
    # Fallback to Pollinations.ai if Gemini fails (e.g. free tier restriction)
    encoded_prompt = urllib.parse.quote(prompt)
    seed = random.randint(1, 1000000)
    return f"https://pollinations.ai/p/{encoded_prompt}?width=1024&height=1024&seed={seed}&nologo=true"

