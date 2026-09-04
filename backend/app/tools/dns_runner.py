import dns.resolver
import dns.reversename
import ipaddress
from urllib.parse import urlparse


def run_dns(target: str):

    # --------------------------------
    # Normalize Input
    # --------------------------------

    target = target.strip()

    # Remove protocol if user gives URL
    if target.startswith(("http://", "https://")):

        parsed = urlparse(target)
        target = parsed.hostname or target

    # Remove path if present without protocol
    target = target.split("/")[0]

    # --------------------------------
    # Base Result
    # --------------------------------

    result = {
        "success": True,
        "input": target,
        "target_type": None,
        "domain": None,
        "ip_address": None,
        "a_records": [],
        "mx_records": [],
        "ns_records": [],
        "txt_records": [],
        "reverse_dns": [],
        "ip_classification": None,
        "errors": []
    }

    # --------------------------------
    # Detect IP Address
    # --------------------------------

    try:

        ip = ipaddress.ip_address(target)

        result["target_type"] = "ip_address"
        result["ip_address"] = str(ip)

        # --------------------------------
        # IP Classification
        # --------------------------------

        if ip.is_private:

            result["ip_classification"] = "private"

        elif ip.is_loopback:

            result["ip_classification"] = "loopback"

        elif ip.is_multicast:

            result["ip_classification"] = "multicast"

        elif ip.is_reserved:

            result["ip_classification"] = "reserved"

        else:

            result["ip_classification"] = "public"

        # --------------------------------
        # Reverse DNS Lookup
        # --------------------------------

        try:

            reverse_name = dns.reversename.from_address(
                str(ip)
            )

            answers = dns.resolver.resolve(
                reverse_name,
                "PTR"
            )

            result["reverse_dns"] = [
                str(answer).rstrip(".")
                for answer in answers
            ]

        except dns.resolver.NXDOMAIN:

            result["errors"].append(
                "No reverse DNS record found for this IP address."
            )

        except dns.resolver.NoAnswer:

            result["errors"].append(
                "No PTR record available for this IP address."
            )

        except Exception as error:

            result["errors"].append(
                f"Reverse DNS lookup failed: {str(error)}"
            )

        return result

    except ValueError:

        pass

    # --------------------------------
    # Validate Domain
    # --------------------------------

    if not target or "." not in target:

        return {
            "success": False,
            "input": target,
            "target_type": "unknown",
            "error": "Please provide a valid domain or IP address."
        }

    # --------------------------------
    # Domain Input
    # --------------------------------

    result["target_type"] = "domain"
    result["domain"] = target

    # --------------------------------
    # A Records
    # --------------------------------

    try:

        answers = dns.resolver.resolve(
            target,
            "A"
        )

        result["a_records"] = [
            str(answer)
            for answer in answers
        ]

    except dns.resolver.NXDOMAIN:

        result["errors"].append(
            "Domain does not exist or DNS resolution failed."
        )

    except dns.resolver.NoAnswer:

        result["errors"].append(
            "No A records found."
        )

    except Exception as error:

        result["errors"].append(
            f"A record lookup failed: {str(error)}"
        )

    # --------------------------------
    # MX Records
    # --------------------------------

    try:

        answers = dns.resolver.resolve(
            target,
            "MX"
        )

        result["mx_records"] = [
            str(answer.exchange).rstrip(".")
            for answer in answers
            if str(answer.exchange).rstrip(".")
        ]

    except dns.resolver.NoAnswer:

        result["errors"].append(
            "No MX records found."
        )

    except Exception:

        pass

    # --------------------------------
    # NS Records
    # --------------------------------

    try:

        answers = dns.resolver.resolve(
            target,
            "NS"
        )

        result["ns_records"] = [
            str(answer).rstrip(".")
            for answer in answers
        ]

    except dns.resolver.NoAnswer:

        result["errors"].append(
            "No NS records found."
        )

    except Exception:

        pass

    # --------------------------------
    # TXT Records
    # --------------------------------

    try:

        answers = dns.resolver.resolve(
            target,
            "TXT"
        )

        result["txt_records"] = [
            str(answer)
            for answer in answers
        ]

    except dns.resolver.NoAnswer:

        result["errors"].append(
            "No TXT records found."
        )

    except Exception:

        pass

    # --------------------------------
    # Determine Success
    # --------------------------------

    if (
        not result["a_records"]
        and not result["mx_records"]
        and not result["ns_records"]
        and not result["txt_records"]
    ):

        result["success"] = False

    return result