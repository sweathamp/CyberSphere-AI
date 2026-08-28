import os

from dotenv import load_dotenv
from google import genai


# --------------------------------
# Environment Configuration
# --------------------------------

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is not configured in .env"
    )


# --------------------------------
# Gemini Client
# --------------------------------

client = genai.Client(api_key=API_KEY)


# --------------------------------
# Learning Agent
# --------------------------------

def answer_cybersecurity_question(
    question: str
) -> str:

    prompt = f"""
You are CyberSphere's Cybersecurity Learning Agent.

Your role is to explain cybersecurity concepts clearly,
accurately, and safely.

The user is asking an educational cybersecurity question.

USER QUESTION:
{question}

Instructions:

1. Explain the concept in simple language.
2. Assume the user may be a beginner.
3. Use practical examples when useful.
4. Explain important technical terms.
5. Structure the answer with clear headings and bullet points.
6. If a concept involves security attacks, focus on understanding,
   detection, prevention, and defensive practices.
7. Do not provide instructions for unauthorized access,
   credential theft, malware deployment, or destructive activity.
8. Do not invent facts.
9. If the question is ambiguous, explain the likely interpretation
   and mention what additional information would be useful.
10. Keep the explanation focused on the user's question.

Produce the answer with this structure when appropriate:

### 1. What is it?

### 2. How does it work?

### 3. Simple Example

### 4. Security Importance

### 5. How to Stay Protected

For very simple questions, you may use a shorter structure.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return response.text.strip()