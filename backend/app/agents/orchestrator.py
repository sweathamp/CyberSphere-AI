import re

from app.agents.agent_router import AgentRouter

from app.tools.whois_runner import run_whois
from app.tools.dns_runner import run_dns
from app.tools.nmap_runner import run_nmap
from app.tools.url_runner import run_url_check
from app.tools.ssh_log_runner import analyze_ssh_log
from app.services.learning_agent import answer_cybersecurity_question

from app.services.target_resolver import resolve_target

from app.services.ai_analyzer import (
    analyze_security_findings,
    analyze_network_findings,
    analyze_url_findings,
    analyze_ssh_findings,
)

from app.services.code_analyzer import analyze_code_security


router = AgentRouter()


class Orchestrator:

    def analyze(
        self,
        message: str,
        log_data: str | None = None,
        code_data: str | None = None
    ):

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

            # --------------------------------
            # Validate SSH Log Input
            # --------------------------------

            if not log_data or not log_data.strip():

                return {
                    "reply": (
                        "🛡️ SSH / SOC Analysis\n\n"
                        "Please provide the SSH log data you want "
                        "CyberSphere to analyze.\n\n"
                        "Example:\n"
                        "Failed password for root from 192.168.1.50"
                    ),
                    "agent": "SOC Agent",
                    "status": {
                        "orchestrator": "completed",
                        "soc": "waiting",
                        "threat": "waiting",
                        "mitre": "waiting"
                    }
                }

            # --------------------------------
            # REAL SSH LOG ANALYSIS
            # --------------------------------

            ssh_result = analyze_ssh_log(log_data)

            if not ssh_result["success"]:

                return {
                    "reply": (
                        "🛡️ SSH / SOC Analysis\n\n"
                        "SSH log analysis could not be completed.\n\n"
                        f"Error: {ssh_result['error']}"
                    ),
                    "agent": "SOC Agent",
                    "status": {
                        "orchestrator": "completed",
                        "soc": "failed",
                        "threat": "waiting",
                        "mitre": "waiting"
                    }
                }

            # --------------------------------
            # AI SOC SECURITY ANALYSIS
            # --------------------------------

            ai_analysis = analyze_ssh_findings(
                ssh_result
            )

            # --------------------------------
            # FINAL SOC REPORT
            # --------------------------------

            reply = (
                f"🛡️ SOC Security Report\n\n"
                f"🔐 SSH LOG FINDINGS\n"
                f"{ssh_result}\n\n"
                f"🧠 AI SOC ASSESSMENT\n"
                f"{ai_analysis}"
            )

            return {
                "reply": reply,
                "agent": "SOC Agent",
                "status": {
                    "orchestrator": "completed",
                    "soc": "completed",
                    "threat": "waiting",
                    "mitre": "completed"
                }
            }

        # --------------------------------
        # Code Review
        # --------------------------------

        elif task == "code":

            # --------------------------------
            # Validate Code Input
            # --------------------------------

            if not code_data or not code_data.strip():

                return {
                    "reply": (
                        "💻 Code Security Review\n\n"
                        "Please provide the source code you want "
                        "CyberSphere to analyze.\n\n"
                        "Example:\n"
                        "SELECT * FROM users WHERE username = '"
                        "+ username"
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
            # Detect Programming Language
            # --------------------------------

            language = "Unknown"

            message_lower = message.lower()

            if "python" in message_lower:
                language = "Python"

            elif "java" in message_lower:
                language = "Java"

            elif "javascript" in message_lower or "js" in message_lower:
                language = "JavaScript"

            elif "typescript" in message_lower or "ts" in message_lower:
                language = "TypeScript"

            elif "c++" in message_lower:
                language = "C++"

            elif "c#" in message_lower:
                language = "C#"

            elif "php" in message_lower:
                language = "PHP"

            # --------------------------------
            # REAL CODE SECURITY ANALYSIS
            # --------------------------------

            try:

                ai_analysis = analyze_code_security(
                    code_data,
                    language
                )

            except Exception as e:

                return {
                    "reply": (
                        "💻 Code Security Review\n\n"
                        "Code analysis could not be completed.\n\n"
                        f"Error: {str(e)}"
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
            # FINAL CODE SECURITY REPORT
            # --------------------------------

            reply = (
                f"💻 Code Security Report\n\n"
                f"Language: {language}\n\n"
                f"🧠 AI SECURITY ASSESSMENT\n"
                f"{ai_analysis}"
            )

            return {
                "reply": reply,
                "agent": "Code Review Agent",
                "status": {
                    "orchestrator": "completed",
                    "soc": "waiting",
                    "threat": "waiting",
                    "mitre": "completed"
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

        if task == "learning":

            learning_response = answer_cybersecurity_question(message)

            return {
                "reply": learning_response,
                "agent": "Learning Agent",
                "status": {
                    "orchestrator": "completed",
                    "soc": "waiting",
                    "threat": "waiting",
                    "mitre": "waiting"
                }
            }