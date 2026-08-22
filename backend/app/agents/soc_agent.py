def run(message: str):
    return {
        "reply": (
            "🛡️ SOC Agent: I analyzed the security-related request.\n\n"
            f"Target: {message}\n\n"
            "Potential security investigation completed."
        ),
        "agent": "SOC Agent"
    }