from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import Dict, Any, Optional
from services.ai_service import generate_chat_response

router = APIRouter(
    prefix="/api/chat",
    tags=["chat"],
    responses={404: {"description": "Not found"}},
)

class ChatRequest(BaseModel):
    message: str
    context: Dict[str, Any]  # Flexible dictionary to hold profile data
    history: list = [] # List of previous messages [{"role": "user", "content": "..."}]
    lang: str = "en"

@router.post("/")
async def chat_with_profile(request: ChatRequest):
    """
    Chat with the AI assistant about the user's astrological profile.
    """
    try:
        response = generate_chat_response(
            request.message,
            request.context,
            history=request.history,
            lang=request.lang
        )
        return {"response": response}
    except Exception as e:
        print(f"Chat Endpoint Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process chat request")
