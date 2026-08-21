import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const agents = [
  "Orchestrator",
  "SOC Agent",
  "Threat Intelligence",
  "MITRE Mapping",
];

export default function Chat() {
  const [message, setMessage] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= agents.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="chat-page">
      {/* Left Sidebar */}
      <aside className="chat-sidebar">
        <h2>CyberSphere</h2>

        <button className="new-chat">+ New Chat</button>

        <div className="history">
          <p>SSH Brute Force</p>
          <p>Code Review</p>
          <p>XSS Learning</p>
        </div>

        <Link to="/dashboard">
          <button className="logout-btn">← Dashboard</button>
        </Link>
      </aside>

      {/* Chat Area */}
      <main className="chat-main">
        <div className="messages">
          <div className="bot-msg">
            👋 Welcome to CyberSphere. Ask me anything about cybersecurity.
          </div>

          <div className="user-msg">
            Analyze this SSH log.
          </div>

          <div className="bot-msg">
            I detected multiple failed SSH login attempts. Agent collaboration is
            currently running.
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

      {/* Agent Panel */}
      <aside className="agent-panel">
        <h3>Agent Activity</h3>

        {agents.map((agent, index) => {
          let className = "waiting";

          if (index < activeStep) className = "done";
          else if (index === activeStep) className = "active";

          return (
            <div key={agent} className={`agent-card ${className}`}>
              {index < activeStep
                ? "✓ "
                : index === activeStep
                ? "● "
                : "○ "}
              {agent}
            </div>
          );
        })}
      </aside>
    </div>
  );
}