import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Auth.css";

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await handleLogin({ email, password });
      navigate("/");
    } catch (err) {
      setError(err?.message || "Login failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <main className="app-container center-layout">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="app-container center-layout">
      <div className="glass-panel auth-panel">
        <section className="auth-header">
          <p className="subheading-badge">GeniAI Access</p>
          <h1 className="auth-title">Login to your Interview dashboard</h1>
          <p className="auth-desc">
            Securely access your personalized interview generator and prepare with high-end AI feedback.
          </p>
        </section>

        <div className="auth-grid">
          <form onSubmit={handleSubmit} className="glass-card auth-form">
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@company.com"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="********"
                className="form-input"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Login
            </button>
          </form>

          <div className="glass-card auth-promo">
            <h2 className="auth-promo-title">New here?</h2>
            <p className="auth-promo-desc">
              Create a free account to access the interview generator, save your progress, and turn your resume into high-impact preparation guidance.
            </p>
            <Link to="/register" className="btn btn-secondary">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
