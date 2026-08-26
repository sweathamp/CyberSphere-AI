import re
import subprocess


def parse_nmap_output(output: str):

    ports = []

    for line in output.splitlines():

        line = line.strip()

        # Example:
        # 5432/tcp open  postgresql  PostgreSQL DB
        match = re.match(
            r"^(\d+)/(\w+)\s+(\w+)\s+(\S+)(?:\s+(.*))?$",
            line
        )

        if not match:
            continue

        port = int(match.group(1))
        protocol = match.group(2)
        state = match.group(3)
        service = match.group(4)
        version = match.group(5) or ""

        ports.append({
            "port": port,
            "protocol": protocol,
            "state": state,
            "service": service,
            "version": version
        })

    return ports


def run_nmap(target: str):

    try:

        result = subprocess.run(
            [
                "nmap",
                "-sV",
                "--open",
                target
            ],
            capture_output=True,
            text=True,
            timeout=120
        )

        if result.returncode != 0:

            return {
                "success": False,
                "target": target,
                "ports": [],
                "error": result.stderr.strip()
            }

        ports = parse_nmap_output(result.stdout)

        return {
            "success": True,
            "target": target,
            "ports": ports,
            "raw_output": result.stdout
        }

    except subprocess.TimeoutExpired:

        return {
            "success": False,
            "target": target,
            "ports": [],
            "error": "Nmap scan timed out."
        }

    except FileNotFoundError:

        return {
            "success": False,
            "target": target,
            "ports": [],
            "error": "Nmap executable was not found."
        }

    except Exception as e:

        return {
            "success": False,
            "target": target,
            "ports": [],
            "error": str(e)
        }