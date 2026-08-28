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
  const [logData, setLogData] = useState("");
  const [codeData, setCodeData] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (!input.trim() || loading) return;

    const userText = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userText
      }
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/chat",
        {
          message: userText,
          log_data: logData.trim() || null,
          code_data: codeData.trim() || null
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: response.data.reply
        }
      ]);

      if (response.data.status) {
        setStatus(response.data.status);
      }

    } catch (error) {
      console.error("Chat request failed:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "❌ Backend connection failed. Please make sure the CyberSphere backend is running."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const newChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "👋 New CyberSphere session started. How can I help you?"
      }
    ]);

    setInput("");
    setLogData("");
    setCodeData("");

    setStatus({
      orchestrator: "waiting",
      soc: "waiting",
      threat: "waiting",
      mitre: "waiting"
    });
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

        <button
          className="new-chat"
          onClick={newChat}
        >
          + New Chat
        </button>

        <div className="chat-history">

          <a href="#network">
            🛰️ Network Scan
          </a>

          <a href="#threat">
            🔍 Threat Intelligence
          </a>

          <a href="#soc">
            🛡️ SOC Analysis
          </a>

          <a href="#code">
            💻 Code Review
          </a>

          <a href="#learning">
            📚 Cyber Learning
          </a>

          <Link to="/dashboard">
            ← Dashboard
          </Link>

        </div>

      </aside>


      {/* Main Chat */}

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

          {loading && (
            <div className="message bot">
              🧠 CyberSphere is analyzing your request...
            </div>
          )}

        </div>


        {/* Advanced Input */}

        {showAdvanced && (
          <div className="advanced-input">

            <label>
              SSH / SOC Log Data
            </label>

            <textarea
              value={logData}
              placeholder="Paste SSH logs here..."
              onChange={(e) => setLogData(e.target.value)}
              rows={5}
            />

            <label>
              Source Code
            </label>

            <textarea
              value={codeData}
              placeholder="Paste source code here..."
              onChange={(e) => setCodeData(e.target.value)}
              rows={7}
            />

          </div>
        )}


        {/* Chat Input */}

        <div className="chat-input">

          <button
            className="advanced-toggle"
            onClick={() => setShowAdvanced((prev) => !prev)}
            title="Additional analysis input"
          >
            ⚙️
          </button>

          <input
            value={input}
            placeholder="Ask CyberSphere anything..."
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            {loading ? "..." : "Send"}
          </button>

        </div>

      </main>


      {/* Right Agent Activity Panel */}

      <aside className="agent-panel">

        <h3>Agent Activity</h3>


        <div className="agent-card">

          <span>
            🧠 Orchestrator
          </span>

          <span className={badge(status.orchestrator)}>
            {status.orchestrator}
          </span>

        </div>


        <div className="agent-card">

          <span>
            🛡️ SOC Agent
          </span>

          <span className={badge(status.soc)}>
            {status.soc}
          </span>

        </div>


        <div className="agent-card">

          <span>
            🌐 Threat Intel
          </span>

          <span className={badge(status.threat)}>
            {status.threat}
          </span>

        </div>


        <div className="agent-card">

          <span>
            🎯 MITRE
          </span>

          <span className={badge(status.mitre)}>
            {status.mitre}
          </span>

        </div>


        <div className="agent-info">

          <h4>CyberSphere Agents</h4>

          <p>
            Your request is automatically routed to the
            appropriate cybersecurity agent.
          </p>

        </div>

      </aside>

    </div>
  );
}