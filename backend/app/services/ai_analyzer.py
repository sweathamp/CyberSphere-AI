import os
import time

from dotenv import load_dotenv
from google import genai


# ==========================================
# ENVIRONMENT SETUP
# ==========================================

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is not configured in .env"
    )


client = genai.Client(
    api_key=API_KEY
)


GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.6-flash"
)

print(f"[AI Analyzer] Using Gemini model: {GEMINI_MODEL}")


# ==========================================
# SAFE GEMINI RESPONSE HELPER
# ==========================================

def generate_ai_response(
    prompt: str,
    fallback_response: str,
    retries: int = 3
) -> str:

    last_error = None

    for attempt in range(retries):

        try:

            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt
            )

            response_text = getattr(
                response,
                "text",
                None
            )

            if response_text:

                cleaned_response = response_text.strip()

                if cleaned_response:
                    return cleaned_response

            print(
                "[AI Analyzer] Empty Gemini response received."
            )

        except Exception as error:

            last_error = error

            print(
                f"[AI Analyzer] Gemini attempt "
                f"{attempt + 1}/{retries} failed: {error}"
            )

            if attempt < retries - 1:

                delay = 2 ** attempt

                print(
                    f"[AI Analyzer] Retrying in "
                    f"{delay} seconds..."
                )

                time.sleep(delay)

    print(
        "[AI Analyzer] Gemini unavailable. "
        "Using fallback analysis."
    )

    if last_error:

        print(
            f"[AI Analyzer] Final error: "
            f"{last_error}"
        )

    return fallback_response


# ==========================================
# DOMAIN / WHOIS / DNS ANALYSIS
# ==========================================

def analyze_security_findings(
    domain: str,
    whois_data: dict,
    dns_data: dict
) -> str:

    prompt = f"""
You are CyberSphere's AI Security Analyst.

Analyze ONLY the evidence provided below.

DOMAIN:
{domain}

WHOIS DATA:
{whois_data}

DNS DATA:
{dns_data}

STRICT RULES:

1. Use ONLY the supplied evidence.
2. Do not invent threat intelligence.
3. Do not claim malicious activity without evidence.
4. Do not claim a domain is safe without evidence.
5. Clearly separate observed facts from interpretation.
6. If evidence is insufficient, explicitly say:
   "Insufficient evidence to determine this."

Produce exactly these sections:

### 1. Risk Assessment

### 2. Observed Findings

### 3. Security Interpretation

### 4. Data Limitations

### 5. Recommended Next Steps
"""

    fallback_response = f"""
### 1. Risk Assessment

- **Risk Level:** Inconclusive
- **Rationale:** WHOIS and DNS information was collected, but Gemini AI analysis is temporarily unavailable. The available infrastructure information alone cannot confirm whether the domain is malicious or safe.

### 2. Observed Findings

**Domain Analyzed:**

`{domain}`

**WHOIS Data Collected:**

{whois_data}

**DNS Data Collected:**

{dns_data}

### 3. Security Interpretation

The collected WHOIS and DNS information provides infrastructure and configuration context.

However, WHOIS and DNS records alone cannot confirm:

- Malware activity
- Phishing activity
- Malicious intent
- Domain reputation
- Website safety

Insufficient evidence to determine this.

### 4. Data Limitations

The following information could not be determined:

- IP reputation
- Domain reputation
- Malware intelligence
- Website behavior
- Web application vulnerabilities
- SSL/TLS security
- Network traffic
- Phishing activity
- Malicious intent

### 5. Recommended Next Steps

- Review WHOIS registration information.
- Review DNS configuration.
- Check trusted threat intelligence sources.
- Analyze website behavior separately.
- Retry AI analysis later.
"""

    return generate_ai_response(
        prompt,
        fallback_response
    )


# ==========================================
# NETWORK / NMAP SECURITY ANALYSIS
# ==========================================

def analyze_network_findings(
    target: str,
    nmap_data: dict
) -> str:

    # ------------------------------------------
    # BUILD CLEAN SERVICE OUTPUT FOR FALLBACK
    # ------------------------------------------

    ports = nmap_data.get("ports", [])

    if ports:

        service_lines = []

        for item in ports:

            port = item.get("port", "Unknown")
            protocol = item.get("protocol", "tcp")
            state = item.get("state", "Unknown")
            service = item.get("service", "Unknown")
            version = item.get("version", "")

            version_text = (
                version
                if version
                else "Identification uncertain"
            )

            service_lines.append(
                f"- **Port:** {port}/{protocol}\n"
                f"  - **State:** {state}\n"
                f"  - **Service:** {service}\n"
                f"  - **Version:** {version_text}"
            )

        services_output = "\n\n".join(
            service_lines
        )

    else:

        services_output = (
            "No open network services were identified "
            "in the supplied scan results."
        )

    # ------------------------------------------
    # AI PROMPT
    # ------------------------------------------

    prompt = f"""
You are CyberSphere's AI Network Security Analyst.

Analyze the REAL Nmap scan results provided below.

TARGET:
{target}

NMAP FINDINGS:
{nmap_data}

STRICT RULES:

1. Use ONLY the supplied Nmap evidence.
2. Never invent vulnerabilities, exploits, malware,
   CVEs, or attack activity.
3. An open port does NOT automatically mean a vulnerability.
4. Do not call a service vulnerable unless evidence
   of a vulnerability is actually provided.
5. If service identification is uncertain, clearly
   state that uncertainty.
6. Clearly distinguish observed facts from interpretation.
7. If evidence is insufficient, explicitly say:
   "Insufficient evidence to determine this."
8. Explain why an exposed service may deserve review,
   but do not claim it is malicious.
9. Keep recommendations practical and defensive.
10. This is an authorized security assessment.

Produce exactly these sections:

### 1. Risk Assessment

Give:
- Risk Level: Low / Medium / High / Inconclusive
- Short rationale

### 2. Observed Network Services

For each open port include:
- Port
- Protocol
- State
- Service
- Version
- Whether identification is confirmed or uncertain

### 3. Security Interpretation

Explain the security significance of the observed
services without overstating risk.

### 4. Data Limitations

Explain what cannot be determined from an Nmap
service scan alone.

### 5. Recommended Next Steps

Give practical defensive recommendations.
"""

    # ------------------------------------------
    # FALLBACK RESPONSE
    # ------------------------------------------

    fallback_response = f"""
### 1. Risk Assessment

- **Risk Level:** Inconclusive
- **Rationale:** The Nmap scan completed successfully, but Gemini AI analysis is temporarily unavailable. Open ports and detected services alone do not prove that a vulnerability exists.

### 2. Observed Network Services

**Target:** `{target}`

{services_output}

### 3. Security Interpretation

The scan identified network services that appear to be reachable on the target.

However:

- An open port does not automatically indicate a vulnerability.
- A detected service does not automatically indicate compromise.
- Service exposure should be reviewed based on operational or business requirements.
- Version information alone cannot confirm whether a service is exploitable.
- Services with uncertain identification require additional verification.

Insufficient evidence to determine whether the observed services contain exploitable vulnerabilities.

### 4. Data Limitations

An Nmap service scan alone cannot determine:

- Whether a service contains a vulnerability
- Whether a CVE is exploitable
- Whether the target is compromised
- Whether malware is present
- Whether credentials have been exposed
- Whether web application vulnerabilities exist
- Whether suspicious activity is occurring
- Complete network architecture
- Complete firewall configuration
- Application-level security weaknesses

### 5. Recommended Next Steps

- Verify whether each exposed service is required.
- Disable unnecessary services where appropriate.
- Restrict unnecessary network exposure.
- Review firewall and access-control rules.
- Review exposed service configurations.
- Keep exposed software and operating systems patched.
- Verify service versions against supported vendor releases.
- Perform deeper authorized security assessment where appropriate.
"""

    # ------------------------------------------
    # GENERATE AI RESPONSE OR USE FALLBACK
    # ------------------------------------------

    return generate_ai_response(
        prompt,
        fallback_response
    )

# ==========================================
# CODE SECURITY ANALYSIS
# ==========================================

def analyze_code_findings(
    code: str,
    language: str = "Unknown"
) -> str:

    prompt = f"""
You are CyberSphere's AI Code Security Analyst.

Analyze ONLY the supplied source code.

LANGUAGE:
{language}

SOURCE CODE:
{code}

STRICT RULES:

1. Use ONLY the supplied source code.
2. Do not invent vulnerabilities.
3. Do not claim a vulnerability unless evidence exists in the code.
4. Clearly separate observed facts from interpretation.
5. If information is missing, explicitly say:
   "Insufficient evidence to determine this."
6. Provide defensive remediation guidance.

Produce exactly these sections:

### 1. Risk Assessment

### 2. Observed Code Findings

### 3. Security Interpretation

### 4. Data Limitations

### 5. Recommended Remediation
"""

    fallback_response = f"""
### 1. Risk Assessment

- **Risk Level:** Inconclusive
- **Rationale:** Source code was supplied for analysis, but Gemini AI analysis is temporarily unavailable.

### 2. Observed Code Findings

**Language:**

`{language}`

The source code was successfully received for security analysis.

### 3. Security Interpretation

A complete AI-based security interpretation could not be generated at this time.

Manual security review is recommended.

Insufficient evidence to determine specific vulnerabilities from the fallback analysis alone.

### 4. Data Limitations

The following cannot be determined from source code alone:

- Runtime configuration
- Deployment environment
- Network configuration
- Dependency vulnerabilities
- Production secrets
- Actual runtime behavior
- External service configuration

### 5. Recommended Remediation

- Perform manual code review.
- Validate user input.
- Use parameterized database queries.
- Avoid exposing secrets in source code.
- Use secure authentication practices.
- Keep dependencies updated.
- Retry AI analysis later.
"""

    return generate_ai_response(
        prompt,
        fallback_response
    )


# ==========================================
# SOC / SECURITY LOG ANALYSIS
# ==========================================

def analyze_soc_findings(
    log_data: dict
) -> str:

    prompt = f"""
You are CyberSphere's AI SOC Security Analyst.

Analyze ONLY the supplied security log evidence.

LOG DATA:
{log_data}

STRICT RULES:

1. Use ONLY the supplied evidence.
2. Do not invent attacker activity.
3. Do not claim compromise without evidence.
4. Clearly separate observations from interpretation.
5. If evidence is insufficient, explicitly say:
   "Insufficient evidence to determine this."

Produce exactly these sections:

### 1. Risk Assessment

### 2. Observed Security Findings

### 3. Security Interpretation

### 4. Data Limitations

### 5. Recommended Next Steps
"""

    fallback_response = f"""
### 1. Risk Assessment

- **Risk Level:** Inconclusive
- **Rationale:** Security log data was collected, but Gemini AI analysis is temporarily unavailable.

### 2. Observed Security Findings

**Collected Log Data:**

{log_data}

### 3. Security Interpretation

The supplied logs should be reviewed for:

- Repeated authentication failures
- Unusual login patterns
- Unexpected successful access
- Suspicious source activity

However, logs alone may not confirm malicious activity or account compromise.

Insufficient evidence to determine compromise status.

### 4. Data Limitations

The available logs may not determine:

- IP reputation
- User legitimacy
- Account compromise
- Post-authentication activity
- Malware presence
- Full network activity
- Attacker identity

### 5. Recommended Next Steps

- Verify suspicious login activity.
- Review surrounding authentication logs.
- Investigate unusual authentication patterns.
- Review account access controls.
- Check relevant threat intelligence sources.
- Retry AI analysis later.
"""

    return generate_ai_response(
        prompt,
        fallback_response
    )


# ==========================================
# URL SECURITY ANALYSIS
# ==========================================

def analyze_url_findings(
    url: str,
    url_data: dict
) -> str:

    prompt = f"""
You are CyberSphere's AI URL Security Analyst.

Analyze ONLY the supplied URL evidence.

URL:
{url}

URL ANALYSIS DATA:
{url_data}

STRICT RULES:

1. Use ONLY supplied evidence.
2. Do not claim phishing without evidence.
3. Do not claim malware without evidence.
4. Clearly separate observations from interpretation.
5. If a website is unreachable, do not claim that missing
   security headers are confirmed vulnerabilities.
6. If evidence is insufficient, explicitly say:
   "Insufficient evidence to determine this."

Produce exactly these sections:

### 1. Risk Assessment

### 2. Observed URL Findings

### 3. Security Interpretation

### 4. Data Limitations

### 5. Recommended Next Steps
"""

    fallback_response = f"""
### 1. Risk Assessment

- **Risk Level:** Inconclusive
- **Rationale:** URL analysis data was collected, but Gemini AI analysis is temporarily unavailable.

### 2. Observed URL Findings

**URL:**

`{url}`

**Collected URL Analysis Data:**

{url_data}

### 3. Security Interpretation

The collected URL structure and connection information may indicate areas requiring further investigation.

However, URL structure alone cannot confirm:

- Phishing
- Malware
- Malicious intent
- Website compromise

Insufficient evidence to determine this.

### 4. Data Limitations

The available data may not determine:

- Domain reputation
- IP reputation
- Malware presence
- Website content safety
- Phishing activity
- Web application vulnerabilities
- Complete SSL/TLS configuration
- Full website behavior

### 5. Recommended Next Steps

- Verify domain reputation.
- Check trusted threat intelligence sources.
- Review website behavior.
- Verify HTTPS configuration.
- Review certificate information.
- Retry AI analysis later.
"""

    return generate_ai_response(
        prompt,
        fallback_response
    )
# ==========================================
# SSH LOG SECURITY ANALYSIS
# ==========================================

def analyze_ssh_findings(
    log_data: dict
) -> str:

    prompt = f"""
You are CyberSphere's AI SOC Security Analyst.

Analyze ONLY the supplied SSH authentication evidence.

SSH LOG FINDINGS:

{log_data}

STRICT RULES:

1. Use only the supplied evidence.
2. Do not invent attack activity, malware, compromise,
   threat intelligence, or IP reputation.
3. Clearly distinguish observed facts from interpretation.
4. Repeated failed logins may indicate password guessing,
   credential probing, or legitimate authentication mistakes.
5. A successful login following failed attempts does not
   automatically prove account compromise.
6. If evidence is insufficient, explicitly state:
   "Insufficient evidence to determine this."
7. Provide defensive recommendations only.

Produce exactly these sections:

### 1. Risk Assessment

Give:
- Risk Level: Low / Medium / High / Inconclusive
- Short rationale

### 2. Observed SSH Findings

Include:
- Total log lines analyzed
- Failed authentication attempts
- Successful logins
- Source IPs
- Targeted usernames

### 3. Security Interpretation

Explain the significance of the authentication pattern
without claiming compromise unless directly supported
by evidence.

### 4. Data Limitations

Explain what cannot be determined from the supplied
SSH authentication logs alone.

### 5. Recommended Next Steps

Provide practical defensive recommendations.
"""

    failed_attempts = log_data.get(
        "failed_attempts",
        0
    )

    successful_logins = log_data.get(
        "successful_logins",
        0
    )

    fallback_response = f"""
### 1. Risk Assessment

- **Risk Level:** Inconclusive
- **Rationale:** SSH authentication data was collected, but AI analysis is temporarily unavailable.

### 2. Observed SSH Findings

- **Failed Authentication Attempts:** {failed_attempts}
- **Successful Logins:** {successful_logins}

### 3. Security Interpretation

The available SSH log data indicates authentication activity.

Repeated failed authentication attempts may require investigation,
but the supplied data alone cannot confirm whether an account
was compromised.

### 4. Data Limitations

The supplied SSH logs alone cannot determine:

- IP reputation
- Malicious intent
- Account compromise
- Malware presence
- Post-authentication activity
- Password strength
- MFA configuration
- Firewall configuration

### 5. Recommended Next Steps

- Verify whether successful logins were authorized.
- Review repeated failed authentication attempts.
- Inspect surrounding authentication logs.
- Review SSH access controls.
- Consider rate limiting and automated blocking for repeated failures.
- Review whether privileged accounts require stronger authentication controls.
"""

    return generate_ai_response(
        prompt,
        fallback_response
    )