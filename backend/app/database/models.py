from sqlalchemy import Column, Integer, Text, String, TIMESTAMP
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)

    user_message = Column(Text, nullable=False)

    bot_reply = Column(Text, nullable=False)

    agent_used = Column(String(100), nullable=False)

    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )