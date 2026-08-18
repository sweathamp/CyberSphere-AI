
export default function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <h2>CyberSphere</h2>

        <div className="nav-links">
          <a href="#">Features</a>
          <a href="#">About</a>
          <button className="login-btn">Login</button>
        </div>
      </nav>

      <main className="hero">
        <p className="tagline">Your AI Cybersecurity Workspace</p>

        <h1>Understand. Analyze. Respond.</h1>

        <p className="description">
          AI-powered cybersecurity assistance for students,
          developers, ethical hackers, and security professionals.
        </p>

        <div className="hero-buttons">
          <button className="primary">Get Started</button>
          <button className="secondary">Explore Features</button>
        </div>
      </main>

      <section className="features">
        <div className="card">
          <h3>Threat Intelligence</h3>
          <p>Analyze IPs, URLs, and domains.</p>
        </div>

        <div className="card">
          <h3>Secure Code Review</h3>
          <p>Detect security issues in code.</p>
        </div>

        <div className="card">
          <h3>SOC Analysis</h3>
          <p>Investigate logs and incidents.</p>
        </div>

        <div className="card">
          <h3>Learning</h3>
          <p>Learn cybersecurity interactively.</p>
        </div>
      </section>
    </div>
  );
}