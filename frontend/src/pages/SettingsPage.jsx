import React, { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifyByEmail: false,
    darkMode: false,
  });

  useEffect(() => {
    api.get("/settings").then((res) => setSettings(res.data));
  }, []);

  function handleChange(e) {
    const { name, checked } = e.target;
    setSettings((s) => ({ ...s, [name]: checked }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    api
      .post("/settings", settings)
      .then(() => alert("Settings saved"))
      .catch(() => alert("Failed to save settings"));
  }

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "50px",
        backgroundColor: "#f3f4f6",
        boxSizing: "border-box",
        position: "fixed",
        top: 70,
        left: 600,
        zIndex: 1000
      }}>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            width: "350px"
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "10px", color: "#333" }}>
            Settings
          </h2>

          <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type="checkbox"
              name="notifyByEmail"
              checked={settings.notifyByEmail}
              onChange={handleChange}
              style={{ width: "18px", height: "18px" }}
            />
            <span>Notify by Email</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type="checkbox"
              name="darkMode"
              checked={settings.darkMode}
              onChange={handleChange}
              style={{ width: "18px", height: "18px" }}
            />
            <span>Enable Dark Mode</span>
          </label>

          <button
            type="submit"
            style={{
              backgroundColor: "#001f3f",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Save Settings
          </button>
        </form>
      </div>
    </>
  );
}
