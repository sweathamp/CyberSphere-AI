import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/chat.css";

type ChatMessage = {
  sender: "user" | "bot";
  text: string;
};

type AgentStatus = {
  orchestrator: string;
  soc: string;
  threat: string;
  mitre: string;
};

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "👋 Welcome to CyberSphere. Ask me anything about cybersecurity."
    }
  ]);

  const [status, setStatus] = useState<AgentStatus>({
    orchestrator: "waiting",
    soc: "waiting",
    threat: "waiting",
    mitre: "waiting"
  });

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userText }
    ]);

    setInput("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/chat",
        { message: userText }
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: response.data.reply
        }
      ]);

      setStatus(response.data.status);

    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Backend connection failed."
        }
      ]);
    }
  };

  const badge = (value: string) => {
    if (value === "completed") return "status completed";
    if (value === "running") return "status running";
    return "status waiting";
  };

  return (
    <div className="chat-page">

      {/* Left Sidebar */}

      <aside className="chat-sidebar">
        <h2>CyberSphere</h2>

        <button className="new-chat">
          + New Chat
        </button>

        <div className="chat-history">
          <a href="#">SSH Brute Force</a>
          <a href="#">Code Review</a>
          <a href="#">XSS Learning</a>

          <Link to="/dashboard">
            ← Dashboard
          </Link>
        </div>
      </aside>

      {/* Chat */}

      <main className="chat-main">

        <div className="chat-messages">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender}`}
            >
              {msg.text}
            </div>
          ))}

        </div>

        <div className="chat-input">

          <input
            value={input}
            placeholder="Ask CyberSphere anything..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />

          <button onClick={sendMessage}>
            Send
          </button>

        </div>

      </main>

      {/* Right Panel */}

      <aside className="agent-panel">

        <h3>Agent Activity</h3>

        <div className="agent-card">
          <span>🧠 Orchestrator</span>
          <span className={badge(status.orchestrator)}>
            {status.orchestrator}
          </span>
        </div>

        <div className="agent-card">
          <span>🛡 SOC Agent</span>
          <span className={badge(status.soc)}>
            {status.soc}
          </span>
        </div>

        <div className="agent-card">
          <span>🌐 Threat Intel</span>
          <span className={badge(status.threat)}>
            {status.threat}
          </span>
        </div>

        <div className="agent-card">
          <span>🎯 MITRE</span>
          <span className={badge(status.mitre)}>
            {status.mitre}
          </span>
        </div>

      </aside>

    </div>
  );
}