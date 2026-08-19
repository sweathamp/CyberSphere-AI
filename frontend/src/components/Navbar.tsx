
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2>CyberSphere</h2>

      <div className="nav-links">
        <a href="#">Features</a>
        <a href="#">About</a>

        <Link to="/login">
          <button className="login-btn">Login</button>
        </Link>
      </div>
    </nav>
  );
}