# CyberSphere AI Agent Workflow

## Overview

CyberSphere uses an orchestrated multi-agent architecture in which a central Orchestrator receives user requests, identifies the intent, plans the required tasks, selects appropriate specialized agents, and combines their outputs into a unified response.

## Workflow

1. User submits a request through the frontend.
2. FastAPI receives and validates the request.
3. The CyberSphere Orchestrator analyzes the user's intent.
4. The Orchestrator determines whether the request requires one or multiple specialized agents.
5. Relevant agents are invoked.
6. Agents perform their assigned analysis.
7. The Orchestrator aggregates and validates the agent outputs.
8. A unified response is returned to the user.
9. Relevant conversation and agent execution data are stored in PostgreSQL.

## Initial Specialized Agents

### Learning Agent
Provides cybersecurity explanations, examples, quizzes, and guided learning assistance.

### Secure Code Review Agent
Analyzes source code for common security weaknesses and provides remediation guidance.

### Threat Intelligence Agent
Analyzes indicators such as IP addresses, domains, URLs, and hashes using approved threat intelligence sources.

### SOC Agent
Analyzes security logs and events to identify suspicious patterns and potential incidents.

## Agent Collaboration

A request may require multiple agents. For example, a suspicious server log may be analyzed by the SOC Agent, enriched by the Threat Intelligence Agent, and mapped to relevant MITRE ATT&CK techniques before the Orchestrator generates the final response.

## Safety Boundary

CyberSphere is designed initially as an analysis, education, and defensive assistance platform. It does not autonomously execute arbitrary offensive security actions against external systems.