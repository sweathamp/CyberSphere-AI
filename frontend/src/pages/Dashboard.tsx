import { Link } from "react-router-dom";

export default function Dashboard() {
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

        {/* Chat Shortcut */}
        <div className="chat-box">
          <input placeholder="Ask CyberSphere anything..." />

          <Link to="/chat">
            <button>Open AI Chat</button>
          </Link>
        </div>

        {/* Quick Actions */}
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

        {/* Recent Activity */}
        <section className="recent">
          <h2>Recent Activity</h2>

          <div className="recent-card">
            <strong>SSH Log Analysis</strong>
            <p>High Risk • Brute Force detected</p>
          </div>

          <div className="recent-card">
            <strong>Node.js Code Review</strong>
            <p>Medium Risk • Authentication improvements suggested</p>
          </div>

          <div className="recent-card">
            <strong>SQL Injection Learning</strong>
            <p>Completed interactive lesson</p>
          </div>
        </section>
      </main>
    </div>
  );
}