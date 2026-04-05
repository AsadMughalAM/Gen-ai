import React, { useState } from "react";
import { generateInterviewReport } from "../services/ai.services.js";
import { useAuth } from "../../auth/hooks/useAuth.js";
import "./Interview.css";

const formatList = (value) => {
  if (!Array.isArray(value)) return [];
  return value;
};

const Interview = () => {
  const { user } = useAuth();
  const [jobDescribe, setJobDescribe] = useState("");
  const [selfDescribe, setSelfDescribe] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setReport(null);

    if (!user) {
      setError("Your session has expired. Please login again before generating a report.");
      return;
    }

    if (!resumeFile) {
      setError("Please upload your resume file to generate the interview report.");
      return;
    }
    if (!jobDescribe.trim() || !selfDescribe.trim()) {
      setError("Both job description and self description are required.");
      return;
    }

    const formData = new FormData();
    formData.append("file", resumeFile);
    formData.append("jobDescribe", jobDescribe);
    formData.append("selfDescribe", selfDescribe);

    try {
      setStatus("Generating interview report...");
      addLog("Uploading resume and requesting interview report.");
      const response = await generateInterviewReport(formData);
      const interviewReport = response?.interviewReport ?? response;

      if (!interviewReport) {
        throw new Error("Unexpected API response format.");
      }

      setReport(interviewReport);
      setStatus("Interview report generated successfully.");
      addLog("Interview report received successfully.");
    } catch (err) {
      const message = err?.message || "Unable to generate interview report.";
      setError(message);
      setStatus("Failed to generate report.");
      addLog(`Error: ${message}`);
    }
  };

  return (
    <section className="interview-wrapper">
      <div className="glass-panel interview-grid">
        <div className="interview-column">
          <div className="glass-card">
            <span className="section-label">Interview prep</span>
            <h2 className="section-title">Generate your personalized interview briefing.</h2>
            <p className="section-desc">
              Upload your resume and describe the role. The AI will return a preparation summary with the most relevant questions and answers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="glass-card interview-column">
            <div className="form-group">
              <label className="form-label">Resume file</label>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role / job description</label>
              <textarea
                value={jobDescribe}
                onChange={(e) => setJobDescribe(e.target.value)}
                rows={4}
                placeholder="Describe the job you are applying for..."
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">About yourself</label>
              <textarea
                value={selfDescribe}
                onChange={(e) => setSelfDescribe(e.target.value)}
                rows={4}
                placeholder="Share your skills, experience and what you bring to the role..."
                className="form-input"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Generate Interview Report
            </button>

            <p className="section-desc" style={{ fontSize: '0.875rem' }}>{status || "Your report will appear below once generation is complete."}</p>
          </form>
        </div>

        <div className="interview-column">
          <div className="glass-card">
            <h3 className="section-title" style={{ fontSize: '1.25rem' }}>Output log</h3>
            <p className="section-desc" style={{ marginBottom: '1rem' }}>Track the request status and API lifecycle for each report generation.</p>
            <div className="terminal-logs">
              {logs.length === 0 ? (
                <p>No events yet. Start by submitting your resume.</p>
              ) : (
                logs.map((entry, index) => (
                  <p key={index}>{entry}</p>
                ))
              )}
            </div>
          </div>

          <div className="glass-card">
            <h3 className="section-title" style={{ fontSize: '1.25rem' }}>Quick tips</h3>
            <ul className="tips-list" style={{ marginTop: '1rem' }}>
              <li>- Use a concise job description with role expectation and tech stack.</li>
              <li>- Describe your strengths clearly to get better matched answers.</li>
              <li>- Upload a text-based PDF resume for the best parsing results.</li>
            </ul>
          </div>
        </div>
      </div>

      {report && (
        <div className="interview-wrapper">
          <div className="glass-panel">
            <div className="report-header">
              <div>
                <span className="section-label">Interview summary</span>
                <h2 className="section-title">Your AI interview report</h2>
                <p className="section-desc" style={{ maxWidth: '48rem' }}>This report is generated based on your resume, role description and personal profile. Use it to focus your preparation on the most important interview topics.</p>
              </div>
              <div className="score-badge">
                <span className="score-label">Match score</span>
                <p className="score-value">{report.matchScore ?? "N/A"}%</p>
              </div>
            </div>
          </div>

          <div className="report-grid">
            <div className="glass-card">
              <h3 className="section-title" style={{ fontSize: '1.5rem' }}>Technical questions</h3>
              <div>
                {formatList(report.technicalQuestions).map((item, index) => (
                  <div key={index} className="qa-card">
                    <span className="section-label">Q{index + 1}</span>
                    <p className="qa-question">{item.question}</p>
                    <p className="qa-intention">Intention: {item.intention}</p>
                    <p className="qa-answer">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card">
              <h3 className="section-title" style={{ fontSize: '1.5rem' }}>Behavioral questions</h3>
              <div>
                {formatList(report.behavioralQuestions).map((item, index) => (
                  <div key={index} className="qa-card">
                    <span className="section-label">Q{index + 1}</span>
                    <p className="qa-question">{item.question}</p>
                    <p className="qa-intention">Intention: {item.intention}</p>
                    <p className="qa-answer">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="report-grid">
            <div className="glass-card">
              <h3 className="section-title" style={{ fontSize: '1.5rem' }}>Skill gaps</h3>
              <div>
                {formatList(report.skillGaps).map((item, index) => (
                  <div key={index} className="qa-card">
                    <p className="qa-question">{item.skill}</p>
                    <p className="qa-intention">Severity: {item.severity}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card">
              <h3 className="section-title" style={{ fontSize: '1.5rem' }}>Preparation plan</h3>
              <div>
                {formatList(report.preparationPlan).map((item, index) => (
                  <div key={index} className="qa-card">
                    <span className="section-label">Day {item.day}</span>
                    <p className="qa-question">{item.focus}</p>
                    <p className="qa-answer">{Array.isArray(item.tasks) ? item.tasks.join(", ") : item.tasks}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Interview;
