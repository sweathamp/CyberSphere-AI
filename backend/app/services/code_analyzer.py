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
# Code Security Analyzer
# --------------------------------

def analyze_code_security(
    code: str,
    language: str
) -> str:

    prompt = f"""
You are CyberSphere's AI Code Security Analyst.

Your task is to perform a DEFENSIVE source-code security
review of the supplied code.

The code may intentionally contain insecure patterns for
security testing, educational purposes, or vulnerability
demonstration.

You ARE allowed to analyze intentionally vulnerable code.

You are NOT being asked to:
- exploit the code
- generate attack payloads
- bypass authentication
- provide instructions for unauthorized access
- perform an attack

Your job is ONLY to:
- identify security weaknesses visible in the source code
- explain the evidence
- explain the security significance
- recommend defensive remediation

PROGRAMMING LANGUAGE:
{language}

SOURCE CODE:

{code}

STRICT ANALYSIS RULES:

1. Use ONLY the supplied source code as evidence.

2. Never invent:
- vulnerabilities
- dependencies
- CVEs
- configuration
- infrastructure
- database schema
- authentication mechanisms
- deployment details
- runtime behavior that is not supported by the code

3. If a security issue is not directly supported by the
supplied code, do not claim that it exists.

4. Clearly distinguish:
- OBSERVED FACT
- SECURITY INTERPRETATION

5. If the evidence is insufficient to determine something,
explicitly state:
"Insufficient evidence to determine this."

6. Do not treat a coding pattern as a confirmed exploitable
vulnerability unless the supplied code provides enough
evidence to support that conclusion.

7. Security issues may include, when supported by the code:
- SQL Injection
- Command Injection
- Cross-Site Scripting
- Path Traversal
- Hardcoded Secrets
- Insecure Deserialization
- Weak Cryptography
- Unsafe File Handling
- Improper Input Validation
- Sensitive Data Exposure
- Authentication / Authorization weaknesses
- Insecure configuration
- Other insecure coding practices

8. For every finding, provide the relevant code evidence
or a concise description of the evidence.

9. Do not generate exploit payloads.

10. Do not claim that secure code is vulnerable merely because
a potentially dangerous function exists. Consider how the
function is actually used in the supplied code.

11. Recommendations must be defensive and practical.

12. If no meaningful security issue is identified, clearly
state that no security weakness was identified from the
supplied source code.

13. This is an authorized defensive security assessment.

Produce the report using EXACTLY these sections:

1. Risk Assessment

Give:
- Risk Level: Low / Medium / High / Inconclusive
- Short rationale

The risk level must be based ONLY on the supplied source code.

2. Observed Code Findings

For each security finding include:
- Finding
- Severity
- Evidence
- Location, if it can be determined
- Security significance

If there are no security findings, state that explicitly.

3. Security Interpretation

For every important finding:
- Observed Fact
- Security Interpretation

Do not overstate conclusions.

4. Data Limitations

Explain what cannot be determined from the source code alone.

Consider limitations such as:
- Runtime environment
- Database schema
- Authentication configuration
- Authorization configuration
- Network exposure
- Dependency versions
- Server configuration
- Operating system configuration
- Secret storage outside the source code
- Actual exploitability
- Production deployment behavior

5. Recommended Remediation

For every identified security issue:
- Explain the recommended defensive fix.
- Provide a secure coding approach when appropriate.

Do not provide exploit instructions or attack payloads.

IMPORTANT OUTPUT RULES:

- Return only the security assessment.
- Do not refuse to analyze vulnerable source code.
- Do not provide attack payloads.
- Do not invent facts.
- Do not return JSON.
"""

    # --------------------------------
    # Gemini Analysis
    # --------------------------------

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return response.text.strip()