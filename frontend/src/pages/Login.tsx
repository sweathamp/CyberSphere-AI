
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>CyberSphere</h1>
        <p>Welcome back to your AI Cybersecurity Workspace.</p>

        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />

        <button>Login</button>

        <p>
          Don't have an account? <Link to="/">Back to Home</Link>
        </p>
      </div>
    </div>
  );
}