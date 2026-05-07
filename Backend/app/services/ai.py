import google.generativeai as genai
from app.core.config import settings

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)

# Using gemini-2.5-flash for fast responses
model_name = "gemini-2.5-flash" 

async def generate_chat_response(messages: list) -> str:
    """
    Generate a response from the Gemini model based on chat history.
    """
    if not settings.GEMINI_API_KEY:
        return "Error: GEMINI_API_KEY is not configured."
        
    try:
        model = genai.GenerativeModel(model_name)
        
        # Convert internal messages to Gemini format
        formatted_messages = []
        for msg in messages:
            role = "model" if msg["role"] == "ai" else "user"
            formatted_messages.append({"role": role, "parts": [msg["content"]]})
            
        history = formatted_messages[:-1]
        last_msg = formatted_messages[-1]["parts"][0]
        
        chat = model.start_chat(history=history)
        response = chat.send_message(last_msg)
        return response.text
    except Exception as e:
        return f"Error communicating with AI: {str(e)}"

async def generate_summary(text: str) -> str:
    """
    Generate a concise summary of the provided text.
    """
    if not settings.GEMINI_API_KEY:
        return "Error: GEMINI_API_KEY is not configured."
        
    try:
        model = genai.GenerativeModel(model_name)
        prompt = f"Please provide a concise, clear, and well-structured summary of the following text:\n\n{text}"
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error communicating with AI: {str(e)}"

async def generate_image_mock(prompt: str) -> str:
    """
    Using Pollinations.ai for free prompt-based image generation without API keys.
    """
    import urllib.parse
    import random
    encoded_prompt = urllib.parse.quote(prompt)
    seed = random.randint(1, 1000000)
    # Adding a random seed ensures fresh images instead of cached corrupted ones
    return f"https://pollinations.ai/p/{encoded_prompt}?width=1024&height=1024&seed={seed}&nologo=true"
