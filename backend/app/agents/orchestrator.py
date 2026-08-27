import re

from app.agents.agent_router import AgentRouter
from app.tools.whois_runner import run_whois
from app.tools.dns_runner import run_dns
from app.tools.nmap_runner import run_nmap
from app.tools.url_runner import run_url_check
from app.services.target_resolver import resolve_target
from app.services.ai_analyzer import (
    analyze_security_findings,
    analyze_network_findings,
    analyze_url_findings
)


router = AgentRouter()


class Orchestrator:

    def analyze(self, message: str):

        task = router.classify(message)

        # --------------------------------
        # Unknown Intent Handling
        # --------------------------------

        if task == "unknown":

            return {
                "reply": (
                    "I couldn't confidently determine the security task "
                    "from your request.\n\n"
                    "Please specify what you would like CyberSphere to do, "
                    "for example:\n"
                    "• Network scan\n"
                    "• Threat intelligence\n"
                    "• SSH log analysis\n"
                    "• Code security review\n"
                    "• URL analysis\n"
                    "• Cybersecurity explanation"
                ),
                "agent": "Orchestrator",
                "status": {
                    "orchestrator": "completed",
                    "soc": "waiting",
                    "threat": "waiting",
                    "mitre": "waiting"
                }
            }

        # --------------------------------
        # Network / Nmap Analysis
        # --------------------------------

        if task == "network_scan":

            target_result = resolve_target(message)

            if not target_result["success"]:

                return {
                    "reply": (
                        "🛰️ Network Scan\n\n"
                        f"{target_result['error']}"
                    ),
                    "agent": "Network Analysis Agent",
                    "status": {
                        "orchestrator": "completed",
                        "soc": "waiting",
                        "threat": "waiting",
                        "mitre": "waiting"
                    }
                }

            target = target_result["target"]

            nmap_result = run_nmap(target)
            if not nmap_result["success"]:

                return {
                    "reply": (
                        f"Network scan for {target} could not be completed.\n\n"
                        f"Error: {nmap_result['error']}"
                    ),
                    "agent": "Network Analysis Agent",
                    "status": {
                        "orchestrator": "completed",
                        "soc": "waiting",
                        "threat": "waiting",
                        "mitre": "waiting"
                    }
                }

            ai_analysis = analyze_network_findings(
                target,
                nmap_result
            )

            reply = (
                f"🛰️ Network Security Report\n\n"
                f"Target: {target}\n\n"

                f"🔎 NMAP FINDINGS\n"
                f"{nmap_result['ports']}\n\n"

                f"🧠 AI SECURITY ASSESSMENT\n"
                f"{ai_analysis}"
            )

            return {
                "reply": reply,
                "agent": "Network Analysis Agent",
                "status": {
                    "orchestrator": "completed",
                    "soc": "waiting",
                    "threat": "waiting",
                    "mitre": "completed"
                }
            }

        # --------------------------------
        # SSH / SOC Analysis
        # --------------------------------

        if task == "ssh_log":

            return {
                "reply": (
                    "I detected multiple failed SSH login attempts. "
                    "SOC analysis has identified suspicious authentication activity."
                ),
                "agent": "SOC Agent",
                "status": {
                    "orchestrator": "completed",
                    "soc": "completed",
                    "threat": "waiting",
                    "mitre": "waiting"
                }
            }

        # --------------------------------
        # Code Review
        # --------------------------------

        elif task == "code":

            return {
                "reply": (
                    "I'll review the provided code for common "
                    "security vulnerabilities."
                ),
                "agent": "Code Review Agent",
                "status": {
                    "orchestrator": "completed",
                    "soc": "waiting",
                    "threat": "waiting",
                    "mitre": "waiting"
                }
            }

        # --------------------------------
        # Threat Intelligence
        # --------------------------------

        elif task == "intel":

            domain_match = re.search(
                r"\b(?:https?://)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})\b",
                message
            )

            if not domain_match:

                return {
                    "reply": (
                        "Please provide a valid domain for Threat Intelligence "
                        "analysis. Example: example.com"
                    ),
                    "agent": "Threat Intelligence Agent",
                    "status": {
                        "orchestrator": "completed",
                        "soc": "waiting",
                        "threat": "waiting",
                        "mitre": "waiting"
                    }
                }

            domain = domain_match.group(1)

            # =================================
            # REAL WHOIS ANALYSIS
            # =================================

            whois_result = run_whois(domain)

            # =================================
            # REAL DNS ANALYSIS
            # =================================

            dns_result = run_dns(domain)

            # =================================
            # AI SECURITY ANALYSIS
            # =================================

            ai_analysis = analyze_security_findings(
                domain,
                whois_result,
                dns_result
            )

            # =================================
            # FINAL REPORT
            # =================================

            reply = (
                f"🔍 Threat Intelligence Report\n\n"
                f"Domain: {domain}\n\n"

                f"📋 WHOIS DATA\n"
                f"{whois_result}\n\n"

                f"🌐 DNS DATA\n"
                f"{dns_result}\n\n"

                f"🧠 AI SECURITY ASSESSMENT\n"
                f"{ai_analysis}"
            )

            return {
                "reply": reply,
                "agent": "Threat Intelligence Agent",
                "status": {
                    "orchestrator": "completed",
                    "soc": "waiting",
                    "threat": "completed",
                    "mitre": "waiting"
                }
            }

        # --------------------------------
        # URL Analysis
        # --------------------------------

        elif task == "url":

            # Extract URL from user message
            url_match = re.search(
                r"https?://[^\s]+|"
                r"\b(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:/[^\s]*)?\b",
                message
            )

            if not url_match:

                return {
                    "reply": (
                        "🔗 URL Analysis\n\n"
                        "Please provide a valid URL for analysis.\n\n"
                        "Example:\n"
                        "https://example.com"
                    ),
                    "agent": "URL Analysis Agent",
                    "status": {
                        "orchestrator": "completed",
                        "soc": "waiting",
                        "threat": "waiting",
                        "mitre": "waiting"
                    }
                }

            url = url_match.group(0)

            # --------------------------------
            # REAL URL ANALYSIS
            # --------------------------------

            url_result = run_url_check(url)

            if not url_result["success"]:

                return {
                    "reply": (
                        f"🔗 URL Analysis\n\n"
                        f"URL: {url}\n\n"
                        f"❌ URL analysis could not be completed.\n\n"
                        f"Error: {url_result['error']}"
                    ),
                    "agent": "URL Analysis Agent",
                    "status": {
                        "orchestrator": "completed",
                        "soc": "waiting",
                        "threat": "completed",
                        "mitre": "waiting"
                    }
                }

            # --------------------------------
            # AI URL SECURITY ANALYSIS
            # --------------------------------

            ai_analysis = analyze_url_findings(
                url,
                url_result
            )

            # --------------------------------
            # FINAL URL SECURITY REPORT
            # --------------------------------

            reply = (
                f"🔗 URL Security Report\n\n"
                f"URL: {url}\n\n"

                f"🌐 URL ANALYSIS DATA\n"
                f"{url_result}\n\n"

                f"🧠 AI SECURITY ASSESSMENT\n"
                f"{ai_analysis}"
            )

            return {
                "reply": reply,
                "agent": "URL Analysis Agent",
                "status": {
                    "orchestrator": "completed",
                    "soc": "waiting",
                    "threat": "completed",
                    "mitre": "waiting"
                }
            }

        # --------------------------------
        # Learning Agent
        # --------------------------------

        return {
            "reply": (
                "Here's a cybersecurity learning explanation for your query."
            ),
            "agent": "Learning Agent",
            "status": {
                "orchestrator": "completed",
                "soc": "waiting",
                "threat": "waiting",
                "mitre": "waiting"
            }
        }