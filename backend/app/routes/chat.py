from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api")

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def chat(request: ChatRequest):
    return {
        "reply": f"CyberSphere received: {request.message}",
        "agents": [
            "Orchestrator",
            "SOC Agent"
        ]
    }