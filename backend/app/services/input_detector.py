import re


def detect_input_type(text: str) -> str:
    """
    Detect the type of user input.

    Possible types:
    - code
    - logs
    - ip
    - url
    - domain
    - question
    """

    text = text.strip()

    # -----------------------------
    # URL Detection
    # -----------------------------

    url_pattern = re.compile(
        r"https?://[^\s]+",
        re.IGNORECASE
    )

    if url_pattern.search(text):
        return "url"

    # -----------------------------
    # IPv4 Detection
    # -----------------------------

    ip_pattern = re.compile(
        r"\b(?:\d{1,3}\.){3}\d{1,3}\b"
    )

    if ip_pattern.fullmatch(text):
        return "ip"

    # -----------------------------
    # Domain Detection
    # -----------------------------

    domain_pattern = re.compile(
        r"^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$"
    )

    if domain_pattern.fullmatch(text):
        return "domain"

    # -----------------------------
    # SSH / Security Log Detection
    # -----------------------------

    log_keywords = [
        "sshd",
        "failed password",
        "accepted password",
        "authentication failure",
        "access denied",
        "connection refused",
        "error",
        "warning",
        "critical"
    ]

    lower_text = text.lower()

    log_matches = sum(
        keyword in lower_text
        for keyword in log_keywords
    )

    if log_matches >= 2:
        return "logs"

    # -----------------------------
    # Source Code Detection
    # -----------------------------

    code_patterns = [
        r"\bimport\s+\w+",
        r"\bfrom\s+\w+\s+import",
        r"\bdef\s+\w+\(",
        r"\bclass\s+\w+",
        r"\bfunction\s+\w+\(",
        r"\bconst\s+\w+\s*=",
        r"\blet\s+\w+\s*=",
        r"\bvar\s+\w+\s*=",
        r"#include\s*<",
        r"\bpublic\s+class\b",
        r"\bSELECT\b.*\bFROM\b",
    ]

    for pattern in code_patterns:
        if re.search(
            pattern,
            text,
            re.IGNORECASE
        ):
            return "code"

    # -----------------------------
    # Default
    # -----------------------------

    return "question"