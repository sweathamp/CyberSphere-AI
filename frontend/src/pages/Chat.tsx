import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

type Message = {
  sender: "user" | "bot";
  text: string;
};

type AgentStatus = "waiting" | "running" | "completed";

type Agent = {
  name: string;
  status: AgentStatus;
};

export default function Chat() {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "👋 Welcome to CyberSphere. Ask me anything about cybersecurity.",
    },
  ]);

  const [agents, setAgents] = useState<Agent[]>([
    { name: "Orchestrator", status: "waiting" },
    { name: "SOC Agent", status: "waiting" },
  ]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
    ]);

    setInput("");

    setAgents([
      { name: "Orchestrator", status: "running" },
      { name: "SOC Agent", status: "waiting" },
    ]);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/chat",
        {
          message: userMessage,
        }
      );

      setAgents([
        { name: "Orchestrator", status: "completed" },
        { name: "SOC Agent", status: "completed" },
      ]);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: response.data.reply,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "❌ Backend connection failed.",
        },
      ]);
    }
  };

  return (
    <div className="chat-page">
      {/* Sidebar */}
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
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.sender === "user"
                  ? "user-msg"
                  : "bot-msg"
              }
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask CyberSphere anything..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button onClick={sendMessage}>
            Send
          </button>
        </div>
      </main>

      {/* Agent Panel */}
      <aside className="agent-panel">
        <h3>Agent Activity</h3>

        {agents.map((agent) => (
          <div
            key={agent.name}
            className={`agent-card ${agent.status}`}
          >
            {agent.status === "completed"
              ? "✓"
              : agent.status === "running"
              ? "●"
              : "○"}{" "}
            {agent.name}
          </div>
        ))}
      </aside>
    </div>
  );
}