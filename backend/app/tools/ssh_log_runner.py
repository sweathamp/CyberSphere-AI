import re
from collections import Counter


def analyze_ssh_log(log_text: str) -> dict:

    if not log_text or not log_text.strip():
        return {
            "success": False,
            "error": "No SSH log data was provided."
        }

    failed_attempts = []
    successful_logins = []

    lines = log_text.splitlines()

    for line in lines:

        # --------------------------------
        # Failed SSH authentication
        # --------------------------------

        failed_match = re.search(
            r"Failed password for (?:invalid user )?(\S+) from ([0-9a-fA-F:.]+)",
            line,
            re.IGNORECASE
        )

        if failed_match:
            username = failed_match.group(1)
            source_ip = failed_match.group(2)

            failed_attempts.append({
                "username": username,
                "source_ip": source_ip,
                "log_line": line.strip()
            })

        # --------------------------------
        # Successful SSH authentication
        # --------------------------------

        success_match = re.search(
            r"Accepted (?:password|publickey) for (\S+) from ([0-9a-fA-F:.]+)",
            line,
            re.IGNORECASE
        )

        if success_match:
            username = success_match.group(1)
            source_ip = success_match.group(2)

            successful_logins.append({
                "username": username,
                "source_ip": source_ip,
                "log_line": line.strip()
            })

    failed_by_ip = Counter(
        attempt["source_ip"]
        for attempt in failed_attempts
    )

    failed_by_user = Counter(
        attempt["username"]
        for attempt in failed_attempts
    )

    suspicious_ips = [
        {
            "source_ip": ip,
            "failed_attempts": count
        }
        for ip, count in failed_by_ip.items()
        if count >= 3
    ]

    return {
        "success": True,
        "total_lines": len(lines),
        "failed_attempts": len(failed_attempts),
        "successful_logins": len(successful_logins),
        "failed_by_ip": dict(failed_by_ip),
        "failed_by_username": dict(failed_by_user),
        "suspicious_ips": suspicious_ips,
        "failed_events": failed_attempts,
        "successful_events": successful_logins
    }