import requests
from urllib.parse import urlparse


def run_url_check(url: str):

    # --------------------------------
    # Normalize URL
    # --------------------------------

    url = url.strip()

    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    # --------------------------------
    # Validate URL
    # --------------------------------

    try:
        parsed = urlparse(url)

        if not parsed.hostname:
            return {
                "success": False,
                "url": url,
                "error": "Invalid URL: hostname could not be determined."
            }

    except Exception as error:

        return {
            "success": False,
            "url": url,
            "error": str(error)
        }

    # --------------------------------
    # HTTP / HTTPS Request
    # --------------------------------

    try:

        response = requests.get(
            url,
            timeout=10,
            allow_redirects=True,
            headers={
                "User-Agent": "CyberSphere-AI-Security-Scanner/1.0"
            }
        )

        # --------------------------------
        # Extract response information
        # --------------------------------

        security_headers = {
            "strict_transport_security":
                response.headers.get("Strict-Transport-Security"),

            "content_security_policy":
                response.headers.get("Content-Security-Policy"),

            "x_frame_options":
                response.headers.get("X-Frame-Options"),

            "x_content_type_options":
                response.headers.get("X-Content-Type-Options")
        }

        return {
            "success": True,
            "original_url": url,
            "final_url": response.url,
            "domain": parsed.hostname,
            "status_code": response.status_code,
            "protocol": parsed.scheme,
            "redirect_count": len(response.history),
            "content_type": response.headers.get("Content-Type"),
            "server": response.headers.get("Server"),
            "security_headers": security_headers
        }

    except requests.exceptions.Timeout:

        return {
            "success": False,
            "url": url,
            "error": "Request timed out."
        }

    except requests.exceptions.SSLError:

        return {
            "success": False,
            "url": url,
            "error": "SSL/TLS certificate verification failed."
        }

    except requests.exceptions.ConnectionError:

        return {
            "success": False,
            "url": url,
            "error": "Unable to connect to the target URL."
        }

    except requests.exceptions.RequestException as error:

        return {
            "success": False,
            "url": url,
            "error": str(error)
        }