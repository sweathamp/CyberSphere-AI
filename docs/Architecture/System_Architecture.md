# CyberSphere System Architecture

## Overview

CyberSphere follows a layered architecture consisting of a React frontend, a FastAPI backend, a central AI Orchestrator, specialized AI agents, databases, and external cybersecurity services.

The Orchestrator acts as the decision-making component of the system. It receives user requests, identifies the intent, selects the appropriate AI agent, collects responses when multiple agents are required, and generates a unified response.

This architecture allows CyberSphere to remain scalable, modular, and easy to extend with new cybersecurity agents in future versions.