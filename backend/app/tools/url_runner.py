import re
import ipaddress
import requests

from urllib.parse import urlparse


# ==========================================
# SUSPICIOUS KEYWORDS
# ==========================================

SUSPICIOUS_KEYWORDS = [
    "login",
    "signin",
    "verify",
    "verification",
    "secure",
    "account",
    "update",
    "confirm",
    "password",
    "wallet",
    "banking",
    "payment",
    "paypal",
    "microsoft",
    "google",
    "apple",
    "facebook",
    "instagram"
]


# ==========================================
# NORMALIZE URL
# ==========================================

def normalize_url(url: str):

    url = url.strip()

    if not url:
        return None

    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    return url


# ==========================================
# CHECK IF HOSTNAME IS IP ADDRESS
# ==========================================

def is_ip_address(hostname: str):

    try:

        ipaddress.ip_address(hostname)

        return True

    except ValueError:

        return False


# ==========================================
# STRUCTURAL URL ANALYSIS
# ==========================================

def analyze_url_structure(parsed):

    hostname = parsed.hostname or ""

    findings = []

    risk_score = 0


    # --------------------------------------
    # HTTP CHECK
    # --------------------------------------

    if parsed.scheme == "http":

        findings.append(
            "URL uses HTTP instead of HTTPS."
        )

        risk_score += 2


    # --------------------------------------
    # IP ADDRESS DOMAIN CHECK
    # --------------------------------------

    if is_ip_address(hostname):

        findings.append(
            "URL uses a direct IP address instead of a domain name."
        )

        risk_score += 3


    # --------------------------------------
    # SUSPICIOUS KEYWORDS
    # --------------------------------------

    hostname_lower = hostname.lower()

    detected_keywords = []


    for keyword in SUSPICIOUS_KEYWORDS:

        if keyword in hostname_lower:

            detected_keywords.append(
                keyword
            )


    if detected_keywords:

        findings.append(
            "Suspicious keywords detected in domain: "
            + ", ".join(detected_keywords)
        )

        risk_score += min(
            len(detected_keywords),
            4
        )


    # --------------------------------------
    # EXCESSIVE HYPHENS
    # --------------------------------------

    hyphen_count = hostname.count("-")

    if hyphen_count >= 2:

        findings.append(
            f"Domain contains multiple hyphens ({hyphen_count})."
        )

        risk_score += 2


    # --------------------------------------
    # EXCESSIVE SUBDOMAINS
    # --------------------------------------

    domain_parts = hostname.split(".")

    if len(domain_parts) > 4:

        findings.append(
            "Domain contains an unusually high number of subdomains."
        )

        risk_score += 2


    # --------------------------------------
    # LONG DOMAIN
    # --------------------------------------

    if len(hostname) > 50:

        findings.append(
            "Domain name is unusually long."
        )

        risk_score += 1


    # --------------------------------------
    # SPECIAL CHARACTERS
    # --------------------------------------

    if re.search(
        r"[^a-zA-Z0-9.\-]",
        hostname
    ):

        findings.append(
            "Domain contains unusual characters."
        )

        risk_score += 2


    return {

        "findings": findings,

        "risk_score": risk_score,

        "detected_keywords":
            detected_keywords,

        "hyphen_count":
            hyphen_count

    }


# ==========================================
# DETERMINE HEURISTIC RISK LEVEL
# ==========================================

def determine_risk_level(score: int):

    if score >= 7:

        return "High"

    if score >= 4:

        return "Medium"

    return "Low"


# ==========================================
# MAIN URL CHECK
# ==========================================

def run_url_check(url: str):


    # ======================================
    # NORMALIZE URL
    # ======================================

    normalized_url = normalize_url(url)


    if not normalized_url:

        return {

            "success": False,

            "url": url,

            "error":
                "No URL was provided."

        }


    # ======================================
    # VALIDATE URL
    # ======================================

    try:

        parsed = urlparse(
            normalized_url
        )


        if not parsed.hostname:

            return {

                "success": False,

                "url":
                    normalized_url,

                "error":
                    "Invalid URL: hostname could not be determined."

            }


    except Exception as error:

        return {

            "success": False,

            "url":
                normalized_url,

            "error":
                str(error)

        }


    # ======================================
    # STRUCTURAL ANALYSIS
    # ALWAYS RUNS
    # ======================================

    structure_analysis = (
        analyze_url_structure(
            parsed
        )
    )


    hostname = (
        parsed.hostname
        or ""
    )


    # ======================================
    # BASE RESPONSE
    # ======================================

    result = {

        "success": True,

        "original_url":
            normalized_url,

        "final_url":
            normalized_url,

        "domain":
            hostname,

        "protocol":
            parsed.scheme,

        "connection_status":
            "not_checked",

        "status_code":
            None,

        "redirect_count":
            0,

        "content_type":
            None,

        "server":
            None,

        "security_headers": {

            "strict_transport_security":
                None,

            "content_security_policy":
                None,

            "x_frame_options":
                None,

            "x_content_type_options":
                None

        },

        "structural_analysis": {

            "findings":
                structure_analysis[
                    "findings"
                ],

            "risk_score":
                structure_analysis[
                    "risk_score"
                ],

            "risk_level":
                determine_risk_level(
                    structure_analysis[
                        "risk_score"
                    ]
                ),

            "detected_keywords":
                structure_analysis[
                    "detected_keywords"
                ],

            "hyphen_count":
                structure_analysis[
                    "hyphen_count"
                ]

        },

        "connection_error":
            None

    }


    # ======================================
    # LIVE CONNECTION CHECK
    # OPTIONAL
    # ======================================

    try:

        response = requests.get(

            normalized_url,

            timeout=10,

            allow_redirects=True,

            headers={

                "User-Agent":
                    "CyberSphere-AI-Security-Scanner/1.0"

            }

        )


        # ==================================
        # CONNECTION SUCCESS
        # ==================================

        result[
            "connection_status"
        ] = "reachable"


        result[
            "final_url"
        ] = response.url


        result[
            "status_code"
        ] = response.status_code


        result[
            "redirect_count"
        ] = len(
            response.history
        )


        result[
            "content_type"
        ] = response.headers.get(
            "Content-Type"
        )


        result[
            "server"
        ] = response.headers.get(
            "Server"
        )


        result[
            "security_headers"
        ] = {

            "strict_transport_security":

                response.headers.get(
                    "Strict-Transport-Security"
                ),

            "content_security_policy":

                response.headers.get(
                    "Content-Security-Policy"
                ),

            "x_frame_options":

                response.headers.get(
                    "X-Frame-Options"
                ),

            "x_content_type_options":

                response.headers.get(
                    "X-Content-Type-Options"
                )

        }


        return result


    # ======================================
    # CONNECTION TIMEOUT
    # ======================================

    except requests.exceptions.Timeout:

        result[
            "connection_status"
        ] = "timeout"


        result[
            "connection_error"
        ] = (
            "Request timed out. "
            "Structural analysis was still completed."
        )


        return result


    # ======================================
    # SSL ERROR
    # ======================================

    except requests.exceptions.SSLError:

        result[
            "connection_status"
        ] = "ssl_error"


        result[
            "connection_error"
        ] = (
            "SSL/TLS certificate verification failed. "
            "Structural analysis was still completed."
        )


        return result


    # ======================================
    # CONNECTION ERROR
    # ======================================

    except requests.exceptions.ConnectionError:

        result[
            "connection_status"
        ] = "unreachable"


        result[
            "connection_error"
        ] = (
            "Unable to connect to the target URL. "
            "Structural analysis was still completed."
        )


        return result


    # ======================================
    # OTHER REQUEST ERROR
    # ======================================

    except requests.exceptions.RequestException as error:

        result[
            "connection_status"
        ] = "error"


        result[
            "connection_error"
        ] = (
            f"Connection error: {str(error)}. "
            "Structural analysis was still completed."
        )


        return result