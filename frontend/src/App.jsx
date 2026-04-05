import React, { useState } from "react";
import { useAuth } from "./features/auth/hooks/useAuth";
import Interview from "./features/ai/pages/Interview";
import "./App.css";

const App = () => {
  const { user, handleLogout } = useAuth();
  const [logoutError, setLogoutError] = useState("");

  const onLogout = async () => {
    setLogoutError("");
    try {
      await handleLogout();
    } catch (err) {
      setLogoutError(err?.message || "Logout failed.");
    }
  };

  return (
    <div className="app-container">
      <div className="max-w-wrapper">
        <header className="glass-panel app-header">
          <div className="header-content">
            <div className="header-text">
              <span className="subheading-badge">
                GeniAI Interview Studio
              </span>
              <h1 className="header-title">
                Your interview preparation engine for <span className="text-gradient">backend success.</span>
              </h1>
              <p className="header-description">
                Upload your resume, describe your target role, and receive a tailored interview report with questions, answers, skill gaps and a daily preparation plan.
              </p>
            </div>
            <div className="glass-card user-profile-badge">
              <span className="profile-label">Authenticated user</span>
              <p className="profile-name">{user?.username || user?.email}</p>
              {logoutError ? (
                <div className="error-message">
                  {logoutError}
                </div>
              ) : null}
              <button
                type="button"
                onClick={onLogout}
                className="btn btn-primary btn-logout"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <Interview />
      </div>
    </div>
  );
};

export default App;

