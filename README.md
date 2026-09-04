# 🛡️ CyberSphere AI

> Intelligent Cybersecurity Analysis Platform for Security Logs, Threat Indicators, and Source Code

CyberSphere AI is an intelligent cybersecurity analysis platform designed to help users investigate security-related data through a unified interface.

The platform allows users to submit security logs, suspicious IP addresses, domains, URLs, and source code for structured cybersecurity analysis and defensive recommendations.

---

## 📌 Overview

Cybersecurity analysis often requires multiple tools for log investigation, threat intelligence, and source code security review.

CyberSphere AI brings these capabilities together into a single platform where users can interact with an AI-powered cybersecurity assistant and analyze different types of security-related information.

The platform focuses on helping users:

- Analyze security logs
- Investigate suspicious indicators
- Review source code for potential security issues
- Maintain investigation history
- Receive structured cybersecurity insights and defensive recommendations

---

# 🎯 Problem Statement

Security analysts and developers often need to investigate different types of cybersecurity data using separate tools and platforms.

For example:

- Security logs may need manual inspection
- Suspicious IP addresses and domains require investigation
- Source code needs security review
- Investigation information may become difficult to organize

CyberSphere AI aims to provide a unified environment for performing these cybersecurity analysis tasks through a single intelligent interface.

---

# 💡 Solution

CyberSphere AI provides an AI-powered cybersecurity analysis environment where users can submit security-related information and receive structured responses.

The system supports multiple cybersecurity workflows including:

- Security Log Analysis
- Threat and Indicator Investigation
- Code Security Analysis

Users can interact with the CyberSphere AI assistant and perform investigations through a centralized dashboard.

---

# 🚀 Key Features

## 🔐 Secure User Authentication

Users can create an account and log in to access the CyberSphere platform.

The application is designed to start from the landing page and require authentication before accessing protected application features.

---

## 📊 Security Log Analysis

Users can submit security logs for analysis.

The system can assist with identifying:

- Suspicious authentication attempts
- Brute-force activity
- SSH-related security events
- Unusual access patterns
- Potential security incidents

---

## 🌐 Threat Intelligence Analysis

CyberSphere AI can assist in investigating suspicious indicators such as:

- IP Addresses
- Domains
- URLs
- Potential threat indicators

The platform provides structured observations and defensive recommendations based on the submitted information.

---

## 💻 Code Security Analysis

Users can submit source code for security analysis.

The system helps identify potential issues such as:

- Injection risks
- Insecure coding practices
- Hardcoded secrets
- Common security weaknesses
- Areas requiring secure coding improvements

---

## 🤖 AI-Powered Cybersecurity Assistant

The CyberSphere AI Assistant provides a unified interface for cybersecurity-related queries.

Users can submit:

- Security logs
- Source code
- IP addresses
- Domains
- URLs
- Cybersecurity questions

The assistant provides structured analysis and defensive recommendations.

---

## 📝 Investigation History

CyberSphere maintains investigation information so users can review previous analysis activities.

This helps users keep track of cybersecurity investigations performed within the platform.

---

## 🎨 Modern Cybersecurity Interface

The application features a modern cybersecurity-themed interface designed for security analysis workflows.

Key interface sections include:

- Landing Page
- Authentication
- Dashboard
- AI Assistant
- Security Analysis Capabilities
- Investigation History
- Upload and Analysis Features

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │       USER           │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │   CyberSphere UI     │
                    └──────────┬───────────┘
                               │
                               │ API Requests
                               ▼
                    ┌──────────────────────┐
                    │   FastAPI Backend    │
                    │   CyberSphere API    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    AI Analyzer       │
                    │   Security Analysis  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Security Insights &  │
                    │ Defensive Guidance   │
                    └──────────────────────┘

# 🛠️ Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React

## Backend

- Python
- FastAPI
- Uvicorn

## AI Integration

- Google Gemini API

## Development Tools

- Git
- GitHub
- VS Code
- Python Virtual Environment

---

# 🤖 CyberSphere AI Architecture

CyberSphere AI follows a modular architecture where the frontend communicates with the backend API to process cybersecurity-related inputs.

```text
USER
  │
  ▼
CYBERSPHERE FRONTEND
React + TypeScript
  │
  ▼
FASTAPI BACKEND
  │
  ▼
INPUT CLASSIFICATION
  │
  ▼
AGENT ROUTING
  │
  ├── Network Security Analysis
  │
  ├── Security Log Analysis
  │
  ├── Code Security Analysis
  │
  └── Cybersecurity Learning Assistance
  │
  ▼
AI ANALYSIS
Google Gemini
  │
  ▼
STRUCTURED SECURITY REPORT
  │
  ▼
USER


# 📂 Project Structure

```text
CyberSphere-AI
│
├── backend
│   │
│   ├── app
│   │   │
│   │   ├── agents
│   │   │   ├── agent_router.py
│   │   │   ├── learning_agent.py
│   │   │   ├── orchestrator.py
│   │   │   └── soc_agent.py
│   │   │
│   │   ├── routes
│   │   │   ├── chat.py
│   │   │   └── health.py
│   │   │
│   │   ├── services
│   │   │   ├── ai_analyzer.py
│   │   │   ├── code_analyzer.py
│   │   │   ├── input_detector.py
│   │   │   ├── intent_classifier.py
│   │   │   ├── learning_agent.py
│   │   │   └── target_resolver.py
│   │   │
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── ai-studio-frontend
│   │
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── data
│   │   ├── pages
│   │   ├── utils
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── docs
├── design
└── README.md

---

# ⚙️ Installation and Setup

## Prerequisites

Before running CyberSphere AI, make sure the following are installed:

- Python 3.11 or later
- Node.js
- npm
- Git

---

# 🖥️ Backend Installation

## Step 1: Clone the Repository

```bash
git clone https://github.com/sweathamp/CyberSphere-AI.git
```

Move into the project folder:

```bash
cd CyberSphere-AI
```

---

## Step 2: Navigate to the Backend

```bash
cd backend
```

---

## Step 3: Create a Python Virtual Environment

```bash
python -m venv venv
```

---

## Step 4: Activate the Virtual Environment

### Windows PowerShell

```powershell
venv\Scripts\Activate.ps1
```

If PowerShell blocks execution, you may need to run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```

Then activate again:

```powershell
venv\Scripts\Activate.ps1
```

---

## Step 5: Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

## Step 6: Configure Environment Variables

Inside the `backend` folder, create a file named:

```text
.env
```

Add your Gemini configuration:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.6-flash
```

> ⚠️ Do not upload your real `.env` file or API key to GitHub.

---

## Step 7: Run the Backend Server

```bash
uvicorn app.main:app --reload --port 8000
```

The backend API should run at:

```text
http://127.0.0.1:8000
```

---

# 🎨 Frontend Installation

Open a **new terminal window** while keeping the backend running.

Navigate to the frontend directory:

```bash
cd CyberSphere-AI/ai-studio-frontend
```

---

## Step 1: Install Frontend Dependencies

```bash
npm install
```

---

## Step 2: Run the Frontend

```bash
npm run dev
```

Vite will display the frontend URL in the terminal.

Typically:

```text
http://localhost:5173
```

Open this URL in your browser.

---

# ▶️ Running CyberSphere AI

To run the complete application, you need **two terminals**.

## Terminal 1 — Backend

```bash
cd CyberSphere-AI/backend
```

Activate the environment:

```powershell
venv\Scripts\Activate.ps1
```

Start the backend:

```bash
uvicorn app.main:app --reload --port 8000
```

---

## Terminal 2 — Frontend

```bash
cd CyberSphere-AI/ai-studio-frontend
```

Start the frontend:

```bash
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# 🧪 Example Inputs

## 🌐 Network Security Analysis

Example:

```text
scanme.nmap.org
```

The system can analyze supplied network scan information and provide structured security observations.

---

## 📊 Security Log Analysis

Example:

```text
Failed password for root from 192.168.1.10
Failed password for admin from 192.168.1.10
Failed password for root from 192.168.1.10
```

The system can help identify suspicious authentication patterns.

---

## 💻 Code Security Analysis

Example:

```python
username = input("Enter username: ")

query = "SELECT * FROM users WHERE username = '" + username + "'"
```

The system can help identify insecure coding practices and recommend safer approaches.

---

# 🔒 Security Approach

CyberSphere AI is designed primarily for defensive cybersecurity analysis.

The platform follows these principles:

- Open ports are not automatically considered vulnerabilities.
- Vulnerabilities are not claimed without supporting evidence.
- Observed facts are separated from interpretation.
- Data limitations are clearly identified.
- Recommendations focus on defensive security practices.
- Analysis should only be performed in authorized environments.

---

# 📊 Current Capabilities

The currently implemented and tested functionality includes:

- AI-powered cybersecurity assistant
- Network security analysis
- Security log analysis
- Code security analysis
- Input classification
- Agent routing
- Structured security reports
- Investigation history
- Cybersecurity dashboard
- Authentication interface
- Upload and analysis features

---

# ⚠️ Known Limitations

CyberSphere AI is currently a working prototype.

Some AI-powered functionality depends on external AI services. During periods of high demand, the Gemini API may temporarily return availability errors.

The backend includes fallback responses when the AI service is temporarily unavailable.

Current authentication and investigation history functionality is primarily managed through frontend application state and browser storage.

---

# 🚧 Future Enhancements

Future improvements may include:

- Persistent database integration
- Backend authentication
- Persistent user accounts
- Persistent chat history
- Real-time threat intelligence integration
- MITRE ATT&CK integration
- Advanced dashboard analytics
- Improved file analysis
- Role-based access control
- Docker deployment
- Cloud deployment

---

# 🎓 Academic Project

CyberSphere AI was developed as an academic cybersecurity and artificial intelligence project.

The project demonstrates concepts related to:

- Artificial Intelligence
- Cybersecurity
- Network Security
- Secure Software Development
- Agent-Based Systems
- API Development
- Modern Web Development

---

# 👩‍💻 Author

**Sweatha Palani Vinayagam**

Computer Science and Design Student

GitHub: https://github.com/sweathamp

---

# ⭐ Project Status

🚧 **Active Development**

CyberSphere AI is currently a working prototype with implemented cybersecurity analysis capabilities.

---

# 📜 License

This project is intended for educational and academic purposes.

---

<div align="center">

# 🛡️ CyberSphere AI

### Intelligent Cybersecurity Analysis Platform

Built for cybersecurity learning, security analysis, and defensive investigation workflows.

</div>