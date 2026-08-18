export default function Navbar() {
  return (
    <nav className="navbar">
      <h2>CyberSphere</h2>

      <div className="nav-links">
        <a href="#">Features</a>
        <a href="#">About</a>

        <button className="login-btn">
          Login
        </button>
      </div>
    </nav>
  );
}