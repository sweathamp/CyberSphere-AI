import re

from app.agents.agent_router import AgentRouter

from app.tools.whois_runner import run_whois
from app.tools.dns_runner import run_dns
from app.tools.nmap_runner import run_nmap
from app.tools.url_runner import run_url_check
from app.tools.ssh_log_runner import analyze_ssh_log

from app.services.learning_agent import (
    answer_cybersecurity_question
)

from app.services.input_detector import (
    detect_input_type
)

from app.services.target_resolver import (
    resolve_target
)

from app.services.ai_analyzer import (
    analyze_security_findings,
    analyze_network_findings,
    analyze_url_findings,
    analyze_ssh_findings,
)

from app.services.code_analyzer import (
    analyze_code_security
)


router = AgentRouter()


# =====================================================
# STATUS HELPERS
# =====================================================

def build_status(
    soc="waiting",
    threat="waiting",
    mitre="waiting"
):

    return {
        "orchestrator": "completed",
        "soc": soc,
        "threat": threat,
        "mitre": mitre
    }


# =====================================================
# FORMAT SSH FINDINGS
# =====================================================

def format_ssh_findings(ssh_result: dict) -> str:

    total_lines = ssh_result.get(
        "total_lines",
        0
    )

    failed_attempts = ssh_result.get(
        "failed_attempts",
        0
    )

    successful_logins = ssh_result.get(
        "successful_logins",
        0
    )

    failed_by_ip = ssh_result.get(
        "failed_by_ip",
        {}
    )

    failed_by_username = ssh_result.get(
        "failed_by_username",
        {}
    )

    suspicious_ips = ssh_result.get(
        "suspicious_ips",
        []
    )

    failed_events = ssh_result.get(
        "failed_events",
        []
    )

    successful_events = ssh_result.get(
        "successful_events",
        []
    )

    report = (
        "### Authentication Summary\n\n"
        f"- **Total Log Lines Analyzed:** {total_lines}\n"
        f"- **Failed Authentication Attempts:** "
        f"{failed_attempts}\n"
        f"- **Successful Logins:** "
        f"{successful_logins}\n"
    )

    # ---------------------------------
    # FAILED ATTEMPTS BY IP
    # ---------------------------------

    if failed_by_ip:

        report += (
            "\n### Failed Attempts by Source IP\n\n"
        )

        for ip, count in failed_by_ip.items():

            report += (
                f"- `{ip}`: "
                f"{count} failed attempt(s)\n"
            )

    # ---------------------------------
    # TARGETED USERNAMES
    # ---------------------------------

    if failed_by_username:

        report += (
            "\n### Targeted Usernames\n\n"
        )

        for username, count in failed_by_username.items():

            report += (
                f"- `{username}`: "
                f"{count} failed attempt(s)\n"
            )

    # ---------------------------------
    # SUSPICIOUS IPS
    # ---------------------------------

    report += (
        "\n### Suspicious Source IPs\n\n"
    )

    if suspicious_ips:

        for item in suspicious_ips:

            source_ip = item.get(
                "source_ip",
                "Unknown"
            )

            attempts = item.get(
                "failed_attempts",
                0
            )

            report += (
                f"- **{source_ip}** "
                f"({attempts} failed attempt(s))\n"
            )

    else:

        report += (
            "- No suspicious IPs detected "
            "based on configured thresholds.\n"
        )

    # ---------------------------------
    # FAILED EVENTS
    # ---------------------------------

    if failed_events:

        report += (
            "\n### Failed Authentication Events\n\n"
        )

        for event in failed_events:

            username = event.get(
                "username",
                "Unknown"
            )

            source_ip = event.get(
                "source_ip",
                "Unknown"
            )

            report += (
                f"- User `{username}` "
                f"failed to authenticate from "
                f"`{source_ip}`\n"
            )

    # ---------------------------------
    # SUCCESSFUL EVENTS
    # ---------------------------------

    if successful_events:

        report += (
            "\n### Successful Login Events\n\n"
        )

        for event in successful_events:

            username = event.get(
                "username",
                "Unknown"
            )

            source_ip = event.get(
                "source_ip",
                "Unknown"
            )

            report += (
                f"- User `{username}` "
                f"successfully logged in from "
                f"`{source_ip}`\n"
            )

    return report


# =====================================================
# FORMAT WHOIS FINDINGS
# PREVENTS RAW DICTIONARY OUTPUT
# =====================================================

def format_whois_findings(
    whois_result: dict
) -> str:

    if not isinstance(
        whois_result,
        dict
    ):

        return (
            "WHOIS information could not be "
            "formatted."
        )

    if not whois_result.get(
        "success",
        True
    ):

        error = whois_result.get(
            "error",
            "WHOIS lookup could not be completed."
        )

        return (
            "### WHOIS Lookup Status\n\n"
            f"- **Status:** Unavailable\n"
            f"- **Details:** {error}\n"
        )

    report = (
        "### Registration Information\n\n"
    )

    field_mapping = [
        (
            "domain",
            "Domain"
        ),
        (
            "domain_name",
            "Domain Name"
        ),
        (
            "registrar",
            "Registrar"
        ),
        (
            "creation_date",
            "Creation Date"
        ),
        (
            "updated_date",
            "Last Updated"
        ),
        (
            "expiration_date",
            "Expiration Date"
        ),
        (
            "country",
            "Country"
        ),
        (
            "org",
            "Organization"
        ),
        (
            "organization",
            "Organization"
        ),
    ]

    found_data = False

    for key, label in field_mapping:

        value = whois_result.get(
            key
        )

        if value:

            if isinstance(
                value,
                list
            ):

                value = ", ".join(
                    str(item)
                    for item in value
                )

            report += (
                f"- **{label}:** "
                f"{value}\n"
            )

            found_data = True

    # ---------------------------------
    # NAME SERVERS
    # ---------------------------------

    name_servers = whois_result.get(
        "name_servers"
    )

    if name_servers:

        report += (
            "\n### WHOIS Name Servers\n\n"
        )

        if not isinstance(
            name_servers,
            list
        ):

            name_servers = [
                name_servers
            ]

        for server in name_servers:

            report += (
                f"- `{server}`\n"
            )

        found_data = True

    # ---------------------------------
    # GENERIC FALLBACK
    # ---------------------------------

    if not found_data:

        report += (
            "- WHOIS lookup completed, but "
            "limited registration information "
            "was available.\n"
        )

    return report


# =====================================================
# FORMAT DNS FINDINGS
# PREVENTS RAW DICTIONARY OUTPUT
# =====================================================

def format_dns_findings(
    dns_result: dict
) -> str:

    if not isinstance(
        dns_result,
        dict
    ):

        return (
            "DNS information could not be "
            "formatted."
        )

    success = dns_result.get(
        "success",
        True
    )

    domain = dns_result.get(
        "domain",
        "Unknown"
    )

    if not success:

        error = dns_result.get(
            "error",
            "DNS lookup could not be completed."
        )

        return (
            "### DNS Lookup Status\n\n"
            f"- **Target:** `{domain}`\n"
            f"- **Status:** Unavailable\n"
            f"- **Details:** {error}\n"
        )

    report = (
        f"### DNS Summary\n\n"
        f"- **Target:** `{domain}`\n"
    )

    # ---------------------------------
    # A RECORDS
    # ---------------------------------

    a_records = dns_result.get(
        "a_records",
        []
    )

    report += (
        "\n### A Records\n\n"
    )

    if a_records:

        for record in a_records:

            report += (
                f"- `{record}`\n"
            )

    else:

        report += (
            "- No A records found.\n"
        )

    # ---------------------------------
    # MX RECORDS
    # ---------------------------------

    mx_records = dns_result.get(
        "mx_records",
        []
    )

    report += (
        "\n### MX Records\n\n"
    )

    if mx_records:

        for record in mx_records:

            report += (
                f"- `{record}`\n"
            )

    else:

        report += (
            "- No MX records found.\n"
        )

    # ---------------------------------
    # NS RECORDS
    # ---------------------------------

    ns_records = dns_result.get(
        "ns_records",
        []
    )

    report += (
        "\n### Name Servers\n\n"
    )

    if ns_records:

        for record in ns_records:

            report += (
                f"- `{record}`\n"
            )

    else:

        report += (
            "- No name server records found.\n"
        )

    # ---------------------------------
    # TXT RECORDS
    # ---------------------------------

    txt_records = dns_result.get(
        "txt_records",
        []
    )

    report += (
        "\n### TXT Records\n\n"
    )

    if txt_records:

        for record in txt_records:

            report += (
                f"- `{record}`\n"
            )

    else:

        report += (
            "- No TXT records found.\n"
        )

    return report


# =====================================================
# EXTRACT DOMAIN OR IP
# =====================================================

def extract_threat_target(
    message: str
):

    # ---------------------------------
    # IPV4
    # ---------------------------------

    ip_match = re.search(

        r"\b(?:25[0-5]|2[0-4][0-9]|"
        r"1[0-9]{2}|[1-9]?[0-9])"
        r"(?:\.(?:25[0-5]|2[0-4][0-9]|"
        r"1[0-9]{2}|[1-9]?[0-9])){3}\b",

        message

    )

    if ip_match:

        return {
            "success": True,
            "target": ip_match.group(0),
            "target_type": "ip"
        }

    # ---------------------------------
    # DOMAIN
    # ---------------------------------

    domain_match = re.search(

        r"\b(?:https?://)?"
        r"(?:www\.)?"
        r"([a-zA-Z0-9-]+"
        r"(?:\.[a-zA-Z0-9-]+)+"
        r")\b",

        message

    )

    if domain_match:

        return {
            "success": True,
            "target": domain_match.group(1),
            "target_type": "domain"
        }

    return {
        "success": False,
        "error": (
            "Please provide a valid domain "
            "or IPv4 address."
        )
    }


# =====================================================
# ORCHESTRATOR
# =====================================================

class Orchestrator:

    def analyze(

        self,

        message: str,

        log_data: str | None = None,

        code_data: str | None = None

    ):

        # =========================================
        # DETECT INPUT TYPE
        # =========================================

        input_type = detect_input_type(
            message
        )

        # =========================================
        # AUTOMATIC INPUT ROUTING
        # =========================================

        if input_type == "logs":

            task = "ssh_log"

        elif input_type == "code":

            task = "code"

        elif input_type == "url":

            task = "url"

        elif input_type in [
            "ip",
            "domain"
        ]:

            task = "intel"

        else:

            task = router.classify(
                message
            )

        # =========================================
        # AUTOMATICALLY USE MESSAGE AS DATA
        # =========================================

        if (
            input_type == "logs"
            and not log_data
        ):

            log_data = message

        if (
            input_type == "code"
            and not code_data
        ):

            code_data = message

        # =========================================
        # UNKNOWN INTENT
        # =========================================

        if task == "unknown":

            return {

                "reply": (

                    "I couldn't confidently determine "
                    "the cybersecurity task from your "
                    "request.\n\n"

                    "Please specify what you would like "
                    "CyberSphere to do, for example:\n\n"

                    "• Network scan\n"
                    "• Threat intelligence\n"
                    "• SSH log analysis\n"
                    "• Code security review\n"
                    "• URL analysis\n"
                    "• Cybersecurity explanation"

                ),

                "agent": "Orchestrator",

                "status": build_status()

            }

        # =========================================
        # NETWORK / NMAP ANALYSIS
        # =========================================

        if task == "network_scan":

            target_result = resolve_target(
                message
            )

            if not target_result.get(
                "success"
            ):

                return {

                    "reply": (

                        "🛰️ Network Scan\n\n"

                        f"{target_result.get('error')}"

                    ),

                    "agent":
                        "Network Analysis Agent",

                    "status":
                        build_status()

                }

            target = target_result.get(
                "target"
            )

            nmap_result = run_nmap(
                target
            )

            if not nmap_result.get(
                "success"
            ):

                return {

                    "reply": (

                        f"🛰️ Network Scan\n\n"

                        f"Network scan for `{target}` "
                        "could not be completed.\n\n"

                        f"Error: "
                        f"{nmap_result.get('error')}"

                    ),

                    "agent":
                        "Network Analysis Agent",

                    "status":
                        build_status()

                }

            ai_analysis = analyze_network_findings(

                target,

                nmap_result

            )

            ports = nmap_result.get(
                "ports",
                "No open ports were identified."
            )

            reply = (

                "🛰️ Network Security Report\n\n"

                f"Target: `{target}`\n\n"


                "🧠 AI SECURITY ASSESSMENT\n\n"

                f"{ai_analysis}"

            )

            return {

                "reply": reply,

                "agent":
                    "Network Analysis Agent",

                "status":
                    build_status(
                        mitre="completed"
                    )

            }

        # =========================================
        # SSH / SOC ANALYSIS
        # =========================================

        elif task == "ssh_log":

            if (

                not log_data

                or not log_data.strip()

            ):

                return {

                    "reply": (

                        "🛡️ SSH / SOC Analysis\n\n"

                        "Please provide the SSH log data "
                        "you want CyberSphere to analyze."

                    ),

                    "agent":
                        "SOC Agent",

                    "status":
                        build_status()

                }

            ssh_result = analyze_ssh_log(
                log_data
            )

            if not ssh_result.get(
                "success"
            ):

                return {

                    "reply": (

                        "🛡️ SSH / SOC Analysis\n\n"

                        "SSH log analysis could not "
                        "be completed.\n\n"

                        f"Error: "
                        f"{ssh_result.get('error')}"

                    ),

                    "agent":
                        "SOC Agent",

                    "status":
                        build_status(
                            soc="failed"
                        )

                }

            formatted_ssh_findings = (
                format_ssh_findings(
                    ssh_result
                )
            )

            ai_analysis = (
                analyze_ssh_findings(
                    ssh_result
                )
            )

            reply = (

                "🛡️ SOC Security Report\n\n"

                "🔐 SSH LOG FINDINGS\n\n"

                f"{formatted_ssh_findings}\n\n"

                "🧠 AI SOC ASSESSMENT\n\n"

                f"{ai_analysis}"

            )

            return {

                "reply": reply,

                "agent":
                    "SOC Agent",

                "status":
                    build_status(
                        soc="completed",
                        mitre="completed"
                    )

            }

        # =========================================
        # CODE SECURITY REVIEW
        # =========================================

        elif task == "code":

            if (

                not code_data

                or not code_data.strip()

            ):

                return {

                    "reply": (

                        "💻 Code Security Review\n\n"

                        "Please provide the source code "
                        "you want CyberSphere to analyze."

                    ),

                    "agent":
                        "Code Review Agent",

                    "status":
                        build_status()

                }

            language = "Unknown"

            message_lower = message.lower()

            if "python" in message_lower:

                language = "Python"

            elif "typescript" in message_lower:

                language = "TypeScript"

            elif "javascript" in message_lower:

                language = "JavaScript"

            elif "java" in message_lower:

                language = "Java"

            elif "c++" in message_lower:

                language = "C++"

            elif "c#" in message_lower:

                language = "C#"

            elif "php" in message_lower:

                language = "PHP"

            try:

                ai_analysis = (
                    analyze_code_security(
                        code_data,
                        language
                    )
                )

            except Exception as error:

                return {

                    "reply": (

                        "💻 Code Security Review\n\n"

                        "Code analysis could not "
                        "be completed.\n\n"

                        f"Error: {str(error)}"

                    ),

                    "agent":
                        "Code Review Agent",

                    "status":
                        build_status()

                }

            reply = (

                "💻 Code Security Report\n\n"

                f"Language: {language}\n\n"

                "🧠 AI SECURITY ASSESSMENT\n\n"

                f"{ai_analysis}"

            )

            return {

                "reply": reply,

                "agent":
                    "Code Review Agent",

                "status":
                    build_status(
                        mitre="completed"
                    )

            }

        # =========================================
        # THREAT INTELLIGENCE
        # =========================================

        elif task == "intel":

            target_result = (
                extract_threat_target(
                    message
                )
            )

            if not target_result.get(
                "success"
            ):

                return {

                    "reply": (

                        "🔍 Threat Intelligence\n\n"

                        f"{target_result.get('error')}\n\n"

                        "Examples:\n"
                        "• example.com\n"
                        "• 185.220.101.45"

                    ),

                    "agent":
                        "Threat Intelligence Agent",

                    "status":
                        build_status()

                }

            target = target_result.get(
                "target"
            )

            target_type = target_result.get(
                "target_type"
            )

            # -------------------------------------
            # WHOIS LOOKUP
            # -------------------------------------

            try:

                whois_result = run_whois(
                    target
                )

            except Exception as error:

                whois_result = {

                    "success": False,

                    "error": str(error)

                }

            # -------------------------------------
            # DNS LOOKUP
            # DNS IS MOST USEFUL FOR DOMAINS
            # -------------------------------------

            if target_type == "domain":

                try:

                    dns_result = run_dns(
                        target
                    )

                except Exception as error:

                    dns_result = {

                        "success": False,

                        "domain": target,

                        "error": str(error)

                    }

            else:

                dns_result = {

                    "success": True,

                    "domain": target,

                    "a_records": [],

                    "mx_records": [],

                    "ns_records": [],

                    "txt_records": [],

                    "note": (
                        "Standard domain DNS record "
                        "lookups are not applicable "
                        "to a direct IPv4 address."
                    )

                }

            # -------------------------------------
            # AI SECURITY ANALYSIS
            # -------------------------------------

            try:

                ai_analysis = (
                    analyze_security_findings(

                        target,

                        whois_result,

                        dns_result

                    )
                )

            except Exception as error:

                ai_analysis = (

                    "AI threat assessment could not "
                    "be completed.\n\n"

                    f"Error: {str(error)}"

                )

            # -------------------------------------
            # FORMAT CLEAN WHOIS OUTPUT
            # -------------------------------------

            formatted_whois = (
                format_whois_findings(
                    whois_result
                )
            )

            # -------------------------------------
            # FORMAT CLEAN DNS OUTPUT
            # -------------------------------------

            formatted_dns = (
                format_dns_findings(
                    dns_result
                )
            )

            # -------------------------------------
            # IP-SPECIFIC NOTE
            # -------------------------------------

            target_label = (

                "IP Address"

                if target_type == "ip"

                else "Domain"

            )

            reply = (

                "🔍 Threat Intelligence Report\n\n"

                f"**{target_label}:** `{target}`\n\n"

                "📋 WHOIS FINDINGS\n\n"

                f"{formatted_whois}\n\n"

                "🌐 DNS FINDINGS\n\n"

                f"{formatted_dns}\n\n"

                "🧠 AI SECURITY ASSESSMENT\n\n"

                f"{ai_analysis}"

            )

            return {

                "reply": reply,

                "agent":
                    "Threat Intelligence Agent",

                "status":
                    build_status(
                        threat="completed"
                    )

            }

        # =========================================
        # URL ANALYSIS
        # =========================================

        elif task == "url":

            url_match = re.search(

                r"https?://[^\s]+|"
                r"\b(?:www\.)?"
                r"[a-zA-Z0-9-]+"
                r"(?:\.[a-zA-Z0-9-]+)+"
                r"(?:/[^\s]*)?\b",

                message

            )

            if not url_match:

                return {

                    "reply": (

                        "🔗 URL Analysis\n\n"

                        "Please provide a valid URL "
                        "for analysis.\n\n"

                        "Example:\n"

                        "https://example.com"

                    ),

                    "agent":
                        "URL Analysis Agent",

                    "status":
                        build_status()

                }

            url = url_match.group(0)

            url_result = run_url_check(
                url
            )

            if not url_result.get(
                "success"
            ):

                return {

                    "reply": (

                        "🔗 URL Analysis\n\n"

                        f"URL: `{url}`\n\n"

                        "❌ URL analysis could not "
                        "be completed.\n\n"

                        f"Error: "
                        f"{url_result.get('error')}"

                    ),

                    "agent":
                        "URL Analysis Agent",

                    "status":
                        build_status(
                            threat="completed"
                        )

                }

            ai_analysis = (
                analyze_url_findings(
                    url,
                    url_result
                )
            )

            reply = (

                "🔗 URL Security Report\n\n"

                f"URL: `{url}`\n\n"

                "🧠 AI SECURITY ASSESSMENT\n\n"

                f"{ai_analysis}"

            )

            return {

                "reply": reply,

                "agent":
                    "URL Analysis Agent",

                "status":
                    build_status(
                        threat="completed"
                    )

            }

        # =========================================
        # LEARNING AGENT
        # =========================================

        elif task == "learning":

            learning_response = (
                answer_cybersecurity_question(
                    message
                )
            )

            return {

                "reply":
                    learning_response,

                "agent":
                    "Learning Agent",

                "status":
                    build_status()

            }

        # =========================================
        # FALLBACK RESPONSE
        # =========================================

        return {

            "reply": (

                "CyberSphere could not complete "
                "the requested analysis.\n\n"

                "Please try again with a valid "
                "cybersecurity query or analysis input."

            ),

            "agent":
                "Orchestrator",

            "status":
                build_status()

        }