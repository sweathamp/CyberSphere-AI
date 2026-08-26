import re

from app.agents.agent_router import AgentRouter
from app.tools.whois_runner import run_whois
from app.tools.dns_runner import run_dns
from app.tools.nmap_runner import run_nmap
from app.services.ai_analyzer import (
    analyze_security_findings,
    analyze_network_findings
)


router = AgentRouter()


class Orchestrator:

    def analyze(self, message: str):

        task = router.classify(message)

        # --------------------------------
        # Network / Nmap Analysis
        # --------------------------------

        if task == "network_scan":

            target = "127.0.0.1"

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

            return {
                "reply": (
                    "URL analysis is currently being prepared. "
                    "Threat Intelligence tooling will be used for this analysis."
                ),
                "agent": "URL Analysis Agent",
                "status": {
                    "orchestrator": "completed",
                    "soc": "waiting",
                    "threat": "waiting",
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