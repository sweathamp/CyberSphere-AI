import dns.resolver


def run_dns(domain: str):

    result = {
        "success": True,
        "domain": domain,
        "a_records": [],
        "mx_records": [],
        "ns_records": [],
        "txt_records": [],
    }

    # --------------------------------
    # A Records
    # --------------------------------

    try:
        answers = dns.resolver.resolve(domain, "A")

        result["a_records"] = [
            str(answer)
            for answer in answers
        ]

    except Exception:
        result["a_records"] = []

    # --------------------------------
    # MX Records
    # --------------------------------

    try:
        answers = dns.resolver.resolve(domain, "MX")

        result["mx_records"] = [
            str(answer.exchange).rstrip(".")
            for answer in answers
            if str(answer.exchange).rstrip(".")
        ]

    except Exception:
        result["mx_records"] = []

    # --------------------------------
    # NS Records
    # --------------------------------

    try:
        answers = dns.resolver.resolve(domain, "NS")

        result["ns_records"] = [
            str(answer).rstrip(".")
            for answer in answers
        ]

    except Exception:
        result["ns_records"] = []

    # --------------------------------
    # TXT Records
    # --------------------------------

    try:
        answers = dns.resolver.resolve(domain, "TXT")

        result["txt_records"] = [
            str(answer)
            for answer in answers
        ]

    except Exception:
        result["txt_records"] = []

    return result