import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";

type Activity = {
  id: number;
  message: string;
  agent: string;
  time: string;
};

export default function Dashboard() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/conversations"
        );

        setActivities(response.data);
      } catch (error) {
        console.error("Failed to load activities");
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>CyberSphere</h2>

        <nav>
          <Link to="/dashboard">🏠 Dashboard</Link>
          <Link to="/chat">💬 AI Chat</Link>
          <a href="#">🔍 Analyses</a>
          <a href="#">📄 Reports</a>
          <a href="#">📚 Learning</a>
          <a href="#">🕘 History</a>
        </nav>

        <Link to="/">
          <button className="logout-btn">← Home</button>
        </Link>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <h1>Good Morning 👋</h1>

        <p>Welcome to your AI Cybersecurity Workspace.</p>

        <div className="chat-box">
          <input placeholder="Ask CyberSphere anything..." />

          <Link to="/chat">
            <button>Open AI Chat</button>
          </Link>
        </div>

        <section className="quick-actions">
          <div className="action-card">
            <h3>Threat Intelligence</h3>
            <p>Analyze suspicious IPs, URLs, and domains.</p>
          </div>

          <div className="action-card">
            <h3>Secure Code Review</h3>
            <p>Review code for security vulnerabilities.</p>
          </div>

          <div className="action-card">
            <h3>SOC Analysis</h3>
            <p>Investigate logs and security incidents.</p>
          </div>

          <div className="action-card">
            <h3>Cyber Learning</h3>
            <p>Continue your personalized learning journey.</p>
          </div>
        </section>

        {/* Live Recent Activity */}
        <section className="recent">
          <h2>Recent Activity</h2>

          {activities.length === 0 ? (
            <div className="recent-card">
              No recent activity yet.
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="recent-card"
              >
                <strong>{activity.message}</strong>

                <p>{activity.agent}</p>

                <small>
                  {new Date(activity.time).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}