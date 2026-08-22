from fastapi import APIRouter
from pydantic import BaseModel

from app.agents.orchestrator import Orchestrator

router = APIRouter(prefix="/api")


class ChatRequest(BaseModel):
    message: str


orchestrator = Orchestrator()


@router.post("/chat")
def chat(request: ChatRequest):

    result = orchestrator.analyze(request.message)

    return result