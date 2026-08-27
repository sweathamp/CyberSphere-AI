from app.services.intent_classifier import classify_with_ai


class AgentRouter:

    def classify(self, message: str):

        text = message.lower().strip()

        # =================================
        # Network / Nmap Scan
        # =================================

        network_keywords = [
            "nmap",
            "port scan",
            "port scanning",
            "scan my machine",
            "scan my local machine",
            "scan this machine",
            "scan this local machine",
            "scan localhost",
            "scan local machine",
            "network scan",
            "network scanning",
            "open ports",
            "check ports",
            "scan ports"
        ]

        if any(keyword in text for keyword in network_keywords):
             return "network_scan"

        # Generic scan intent
        # Handles inputs such as:
        # "scan xyz"
        # "scan this host"
        # "please scan abc"
        if text.startswith("scan ") and not any(
            word in text
            for word in [
                "code",
                "url",
                "website"
            ]
        ):

            return "network_scan"

        # =================================
        # SSH / SOC Analysis
        # =================================

        ssh_keywords = [
            "ssh log",
            "ssh logs",
            "failed ssh",
            "ssh login",
            "authentication failure",
            "brute force ssh"
        ]

        if any(keyword in text for keyword in ssh_keywords):
            return "ssh_log"

        # =================================
        # Code Review
        # =================================

        code_keywords = [
            "review this code",
            "review code",
            "analyze this code",
            "code vulnerability",
            "security vulnerability in code",
            "find vulnerabilities in this code"
        ]

        if any(keyword in text for keyword in code_keywords):
            return "code"

        # =================================
        # Threat Intelligence
        # =================================

        intel_keywords = [
            "whois",
            "dns",
            "domain intelligence",
            "threat intelligence",
            "investigate",
            "domain investigation",
            "domain analysis"
        ]

        if any(keyword in text for keyword in intel_keywords):
            return "intel"

        # =================================
        # URL Analysis
        # =================================

        url_keywords = [
            "analyze url",
            "check url",
            "url analysis",
            "suspicious url",
            "is this url safe"
        ]

        if any(keyword in text for keyword in url_keywords):
            return "url"

        # =================================
        # AI FALLBACK
        # =================================

        return classify_with_ai(message)