import os

from dotenv import load_dotenv
from google import genai


load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is not configured in .env"
    )


client = genai.Client(api_key=API_KEY)


VALID_INTENTS = {
    "network_scan",
    "intel",
    "ssh_log",
    "code",
    "url",
    "learning",
    "unknown"
}


def classify_with_ai(message: str) -> str:

    prompt = f"""
You are the intent classifier for CyberSphere,
an AI-powered cybersecurity assistant.

Classify the user's request into EXACTLY ONE of these labels:

network_scan
intel
ssh_log
code
url
learning
unknown

Definitions:

network_scan:
Requests involving Nmap, port scanning, open ports,
network scanning, scanning a machine, host discovery,
or checking network services.

intel:
Requests involving WHOIS, DNS, domain investigation,
domain ownership, domain intelligence, or threat intelligence.

ssh_log:
Requests involving SSH logs, failed SSH authentication,
login failures, suspicious SSH activity, or SSH brute-force analysis.

code:
Requests asking to review source code or identify
security vulnerabilities in code.

url:
Requests involving analysis or safety checking of URLs.

learning:
General cybersecurity questions, explanations,
tutorials, or educational requests.

unknown:
Use this when the request does not clearly belong
to any of the above categories.

IMPORTANT:
- Return ONLY one label.
- Do not explain your answer.
- Do not return markdown.
- Do not return JSON.
- Do not invent a new label.

USER REQUEST:
{message}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    intent = response.text.strip().lower()

    # Safety check: only accept known labels
    if intent not in VALID_INTENTS:
        return "unknown"

    return intent