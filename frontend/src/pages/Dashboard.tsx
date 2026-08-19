
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="dashboard">

      <aside className="sidebar">

        <h2>CyberSphere</h2>

        <nav>
          <a href="#">🏠 Dashboard</a>
          <a href="#">💬 AI Chat</a>
          <a href="#">🔍 Analyses</a>
          <a href="#">📄 Reports</a>
          <a href="#">📚 Learning</a>
          <a href="#">🕘 History</a>
        </nav>

        <Link to="/">
          <button className="logout-btn">← Home</button>
        </Link>

      </aside>

      <main className="dashboard-content">

        <h1>Good Morning 👋</h1>

        <p>
          Welcome to your AI Cybersecurity Workspace.
        </p>

        <div className="chat-box">

          <input
            placeholder="Ask CyberSphere anything..."
          />

          <button>Analyze</button>

        </div>

        <section className="quick-actions">

          <div className="action-card">
            <h3>Threat Intelligence</h3>
            <p>Analyze IPs and URLs.</p>
          </div>

          <div className="action-card">
            <h3>Code Review</h3>
            <p>Review secure code.</p>
          </div>

          <div className="action-card">
            <h3>Log Analysis</h3>
            <p>Investigate security logs.</p>
          </div>

          <div className="action-card">
            <h3>Learning</h3>
            <p>Continue cybersecurity learning.</p>
          </div>

        </section>

        <section className="recent">

          <h2>Recent Activity</h2>

          <div className="recent-card">
            SSH Log Analysis · High Risk
          </div>

          <div className="recent-card">
            Secure Code Review · Medium Risk
          </div>

        </section>

      </main>

    </div>
  );
}