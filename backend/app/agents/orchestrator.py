from app.agents.learning_agent import run as learning_run
from app.agents.soc_agent import run as soc_run


class Orchestrator:

    def analyze(self, message: str):

        text = message.lower()

        learning_keywords = [
            "what",
            "explain",
            "learn",
            "how",
            "why",
            "difference"
        ]

        soc_keywords = [
            "log",
            "ssh",
            "attack",
            "incident",
            "failed login",
            "brute force"
        ]

        if any(word in text for word in soc_keywords):
            return soc_run(message)

        if any(word in text for word in learning_keywords):
            return learning_run(message)

        return {
            "reply": (
                "🧠 Orchestrator: Your request has been received.\n\n"
                "A specialized agent will handle this category in future versions."
            ),
            "agent": "Orchestrator"
        }