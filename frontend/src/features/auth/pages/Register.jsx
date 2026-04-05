import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Auth.css";

const Register = () => {
  const { loading, handleRegister } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await handleRegister({ username, email, password });
      navigate("/");
    } catch (err) {
      setError(err?.message || "Registration failed. Please try again.");
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
          <p className="subheading-badge">Create account</p>
          <h1 className="auth-title">Start your interview preparation journey.</h1>
          <p className="auth-desc">
            Register once, then upload your resume and job brief to get AI-powered interview guidance instantly.
          </p>
        </section>

        <div className="auth-grid">
          <form onSubmit={handleSubmit} className="glass-card auth-form">
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Your full name"
                className="form-input"
                required
              />
            </div>
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
                placeholder="Choose a strong password"
                className="form-input"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Create account
            </button>
          </form>

          <div className="glass-card auth-promo">
            <h2 className="auth-promo-title">Already registered?</h2>
            <p className="auth-promo-desc">
              Login and continue preparing for your backend interview with AI-guided insights.
            </p>
            <Link to="/login" className="btn btn-secondary">
              Login now
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
