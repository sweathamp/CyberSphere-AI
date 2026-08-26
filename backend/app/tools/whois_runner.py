import whois


def run_whois(domain: str):

    try:
        data = whois.whois(domain)

        return {
            "success": True,
            "domain": domain,
            "registrar": data.registrar,
            "creation_date": str(data.creation_date),
            "expiration_date": str(data.expiration_date),
            "name_servers": data.name_servers,
        }

    except Exception as e:
        return {
            "success": False,
            "domain": domain,
            "error": str(e),
        }

    