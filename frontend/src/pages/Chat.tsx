
import { useState } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");

  return (
    <div className="chat-page">

      <aside className="chat-sidebar">
        <h2>CyberSphere</h2>

        <button className="new-chat">+ New Chat</button>

        <div className="history">
          <p>SSH Brute Force</p>
          <p>Code Review</p>
          <p>XSS Learning</p>
        </div>
      </aside>

      <main className="chat-main">

        <div className="messages">

          <div className="bot-msg">
            👋 Welcome to CyberSphere. Ask me anything about cybersecurity.
          </div>

          <div className="user-msg">
            Analyze this SSH log.
          </div>

        </div>

        <div className="chat-input">

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask CyberSphere anything..."
          />

          <button>Send</button>

        </div>

      </main>

      <aside className="agent-panel">

        <h3>Agent Activity</h3>

        <div className="agent-card done">
          ✓ Orchestrator
        </div>

        <div className="agent-card done">
          ✓ SOC Agent
        </div>

        <div className="agent-card active">
          ● Threat Intelligence
        </div>

        <div className="agent-card waiting">
          ○ MITRE Mapping
        </div>

      </aside>

    </div>
  );
}