from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.agents.orchestrator import Orchestrator
from app.database.connection import get_db
from app.database.models import Conversation

router = APIRouter(prefix="/api")

class ChatRequest(BaseModel):
    message: str

orchestrator = Orchestrator()


@router.post("/chat")
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    result = orchestrator.analyze(request.message)

    conversation = Conversation(
        user_message=request.message,
        bot_reply=result["reply"],
        agent_used=result["agent"]
    )

    db.add(conversation)
    db.commit()

    return result


@router.get("/conversations")
def get_conversations(db: Session = Depends(get_db)):
    conversations = (
        db.query(Conversation)
        .order_by(Conversation.created_at.desc())
        .limit(5)
        .all()
    )

    return [
        {
            "id": c.id,
            "message": c.user_message,
            "agent": c.agent_used,
            "time": c.created_at
        }
        for c in conversations
    ]