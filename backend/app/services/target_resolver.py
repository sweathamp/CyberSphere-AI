import ipaddress
import re
import socket


def resolve_target(message: str):

    text = message.strip()

    # --------------------------------
    # Local machine
    # --------------------------------

    local_patterns = [
        "local machine",
        "local pc",
        "my machine",
        "my pc",
        "localhost"
    ]

    if any(pattern in text.lower() for pattern in local_patterns):
        return {
            "success": True,
            "target": "127.0.0.1",
            "target_type": "local"
        }

    # --------------------------------
    # IPv4 address extraction
    # --------------------------------

    ip_match = re.search(
        r"\b(?:\d{1,3}\.){3}\d{1,3}\b",
        text
    )

    if ip_match:

        target = ip_match.group(0)

        try:
            ipaddress.ip_address(target)

            return {
                "success": True,
                "target": target,
                "target_type": "ip"
            }

        except ValueError:

            return {
                "success": False,
                "error": f"Invalid IP address: {target}"
            }

    # --------------------------------
    # Hostname extraction
    # --------------------------------

    hostname_match = re.search(
        r"\b(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\b",
        text
    )

    if hostname_match:

        target = hostname_match.group(0)

        try:
            socket.gethostbyname(target)

            return {
                "success": True,
                "target": target,
                "target_type": "hostname"
            }

        except socket.gaierror:

            return {
                "success": False,
                "error": f"Unable to resolve hostname: {target}"
            }

    # --------------------------------
    # No target found
    # --------------------------------

    return {
        "success": False,
        "error": (
            "No valid scan target was found. "
            "Please provide a local machine, IP address, "
            "or hostname."
        )
    }