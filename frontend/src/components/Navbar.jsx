import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  }

  const linkStyle = {
    color: "white",
    marginRight: 15,
    textDecoration: "none",
    fontWeight: "bold",
    padding: "6px 12px",
    borderRadius: "4px",
  };

  const linkHoverStyle = {
    backgroundColor: "#003366",
  };

  return (
    <nav
      style={{
        backgroundColor: "#001f3f",
        padding: "20px 20px",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontWeight: "bold",
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        boxSizing: "border-box",
      }}
    >
      <div>
        <Link to="/profile" style={linkStyle}>
          MyApp
        </Link>
        {token && (
          <>
            <Link to="/dashboard" style={linkStyle}>
              Dashboard
            </Link>
            <Link to="/post-editor" style={linkStyle}>
              Create Post
            </Link>
            <Link to="/profile" style={linkStyle}>
              Profile
            </Link>
            <Link to="/settings" style={linkStyle}>
              Settings
            </Link>
            
          </>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        {!token ? (
          <>
            <Link to="/login" style={linkStyle}>
              Login
            </Link>
            <Link to="/register" style={linkStyle}>
              Register
            </Link>
          </>
        ) : (
          <>
            <span style={{ marginRight: 15 }}>Welcome Back</span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onMouseOver={(e) => (e.target.style.color = "#ff4d4d")}
              onMouseOut={(e) => (e.target.style.color = "white")}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
