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


def analyze_security_findings(
    domain: str,
    whois_data: dict,
    dns_data: dict
) -> str:

    prompt = f"""
You are CyberSphere's AI Security Analyst.

Analyze the REAL WHOIS and DNS evidence provided below.

Your job is to interpret the evidence carefully and produce
a professional cybersecurity assessment.

STRICT RULES:

1. Use ONLY the supplied WHOIS and DNS data.
2. Never invent threat intelligence, malware history,
   IP reputation, vulnerabilities, attacks, or security controls.
3. Clearly separate OBSERVED FACTS from SECURITY INTERPRETATION.
4. Do not claim that a security mechanism is enabled unless
   the supplied evidence directly supports that conclusion.
5. If the available evidence is insufficient, explicitly say:
   "Insufficient evidence to determine this."
6. Do not treat domain age alone as proof that a domain is safe.
7. Do not treat Cloudflare usage alone as proof that a domain is safe.
8. Do not claim that SPF controls incoming email.
9. SPF describes which systems are authorized to send email
   using a domain.
10. If there are no MX records, state only that no mail exchanger
    was observed in the supplied DNS data.
11. Do not claim that an IP is malicious or safe unless
    reputation data is actually provided.
12. Do not claim that a vulnerability exists unless evidence
    of that vulnerability is provided.
13. Keep recommendations relevant to the available evidence.

DOMAIN:
{domain}

WHOIS DATA:
{whois_data}

DNS DATA:
{dns_data}


Produce the report using exactly these sections:

1. Risk Assessment

Give:
- Risk Level: Low / Medium / High / Inconclusive
- Short rationale

The risk level must be based ONLY on the supplied evidence.


2. Observed Findings

List factual observations from:
- WHOIS
- DNS


3. Security Interpretation

For every important observation:
- State the fact
- Explain its security significance

Do not overstate conclusions.


4. Data Limitations

Explain what cannot be determined because the current
dataset does not contain:
- IP reputation
- Malware intelligence
- HTTP/HTTPS behavior
- SSL/TLS certificate information
- Web application vulnerabilities
- Network traffic


5. Recommended Next Steps

Give practical next steps that are appropriate
for the available evidence.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return response.text

def analyze_network_findings(
    target: str,
    nmap_data: dict
) -> str:

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
5. If Nmap's service detection contains '?' or has
   an empty version, treat the identification as uncertain.
6. Clearly distinguish observed facts from interpretation.
7. If the evidence is insufficient, explicitly say:
   "Insufficient evidence to determine this."
8. Explain why an exposed service may deserve review,
   but do not claim it is malicious.
9. Keep recommendations practical and defensive.
10. This is an authorized security assessment.

Produce exactly these sections:

1. Risk Assessment

Give:
- Risk Level: Low / Medium / High / Inconclusive
- Short rationale

2. Observed Network Services

For each open port:
- Port
- Protocol
- State
- Service
- Version
- Whether identification is confirmed or uncertain

3. Security Interpretation

Explain the security significance of the observed
services without overstating risk.

4. Data Limitations

Explain what cannot be determined from an Nmap
service scan alone.

5. Recommended Next Steps

Give practical defensive recommendations such as:
- Verify whether the service is required.
- Restrict unnecessary network exposure.
- Review firewall rules.
- Keep services patched.
- Perform deeper authorized assessment when appropriate.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return response.text

def analyze_url_findings(
    url: str,
    url_data: dict
) -> str:

    prompt = f"""
You are CyberSphere's AI URL Security Analyst.

Analyze the REAL HTTP/HTTPS metadata collected for the
provided URL.

URL:
{url}

URL ANALYSIS DATA:
{url_data}

STRICT RULES:

1. Use ONLY the supplied URL analysis evidence.
2. Never invent malware, phishing history, reputation,
   vulnerabilities, CVEs, attacks, or threat intelligence.
3. An HTTP status code alone does NOT prove that a URL
   is safe or malicious.
4. The presence or absence of a security header alone
   does NOT prove that a website is vulnerable.
5. If a security header is missing, describe it as an
   observation that may warrant review, not as a confirmed
   vulnerability.
6. If redirects are observed, describe the redirect behavior
   without assuming malicious intent.
7. Clearly distinguish OBSERVED FACTS from SECURITY INTERPRETATION.
8. If the evidence is insufficient, explicitly say:
   "Insufficient evidence to determine this."
9. Do not claim that the domain or website is malicious
   unless direct evidence is provided.
10. Do not claim that HTTPS guarantees complete security.
11. Keep recommendations practical and defensive.
12. This is an authorized security assessment.

Produce exactly these sections:

1. Risk Assessment

Give:
- Risk Level: Low / Medium / High / Inconclusive
- Short rationale

The risk level must be based ONLY on the supplied evidence.


2. Observed URL Findings

Include:
- Original URL
- Final URL
- Domain
- HTTP status code
- Protocol
- Redirect count
- Content type
- Server
- Security headers


3. Security Interpretation

Explain the security significance of the observed
HTTP/HTTPS behavior and security headers.

Clearly distinguish:
- Fact
- Interpretation

Do not overstate conclusions.


4. Data Limitations

Explain what cannot be determined from this dataset.

Mention limitations such as:
- Domain/IP reputation
- Malware intelligence
- Website content analysis
- Web application vulnerabilities
- Authentication behavior
- Backend infrastructure
- Full SSL/TLS configuration
- Network traffic


5. Recommended Next Steps

Give practical defensive recommendations based ONLY
on the supplied evidence.

Examples:
- Review missing security headers.
- Verify HTTPS configuration.
- Investigate unexpected redirects.
- Perform authorized web application testing when appropriate.
- Check domain/IP reputation using trusted intelligence sources.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return response.text