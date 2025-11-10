import React, { useState } from "react";
import "../styles/style.css";
import "../styles/comp/ReportForm.css";

export default function ReportForm({ onSuccess }) {
  const [form, setForm] = useState({
    reporterName: "",
    reporterEmail: "",
    cheaterHandle: "",
    platform: "AtCoder",
    contestId: "",
    evidence: "",
    evidenceLink: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();

    if (!form.reporterName || !form.reporterEmail || !form.cheaterHandle) {
      return setStatus({ ok: false, message: "Please fill required fields." });
    }

    setLoading(true);
    setStatus(null);

    try {
      const resp = await fetch(
        "https://formsubmit.co/ajax/aust.competitive.programming@gmail.com",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ReporterName: form.reporterName,
            ReporterEmail: form.reporterEmail,
            CheaterHandle: form.cheaterHandle,
            Platform: form.platform,
            ContestId: form.contestId,
            Evidence: form.evidence,
            EvidenceLink: form.evidenceLink,
          }),
        }
      );

      const data = await resp.json();

      if (data.success === "true" || resp.ok) {
        setStatus({ ok: true, message: "Report submitted. Thank you!" });
        setForm({
          reporterName: "",
          reporterEmail: "",
          cheaterHandle: "",
          platform: "AtCoder",
          contestId: "",
          evidence: "",
          evidenceLink: "",
        });
        if (typeof onSuccess === "function") {
          try {
            onSuccess({ success: true });
          } catch (e) {
            // ignore
          }
        }
      } else {
        setStatus({
          ok: false,
          message: "Submission failed. Please try again.",
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        ok: false,
        message: "Submission failed. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="rf-report-form" onSubmit={onSubmit} noValidate>
      <h2 className="rf-form-title">Report a Cheater</h2>

      <div className="rf-form-grid">
        <div className="rf-form-group">
          <label htmlFor="rf-reporterName">Reporter Name *</label>
          <input
            id="rf-reporterName"
            autoComplete="name"
            type="text"
            className="rf-input"
            name="reporterName"
            value={form.reporterName}
            onChange={onChange}
            required
          />
        </div>

        <div className="rf-form-group">
          <label htmlFor="rf-reporterEmail">Reporter Email *</label>
          <input
            id="rf-reporterEmail"
            autoComplete="email"
            type="email"
            className="rf-input"
            name="reporterEmail"
            value={form.reporterEmail}
            onChange={onChange}
            required
          />
        </div>

        <div className="rf-form-group">
          <label htmlFor="rf-cheaterHandle">Cheater Handle *</label>
          <input
            id="rf-cheaterHandle"
            type="text"
            className="rf-input"
            name="cheaterHandle"
            value={form.cheaterHandle}
            onChange={onChange}
            required
          />
        </div>

        <div className="rf-form-group">
          <label htmlFor="rf-platform">Platform *</label>
          <select
            id="rf-platform"
            className="rf-select"
            name="platform"
            value={form.platform}
            onChange={onChange}
            required
          >
            <option value="AtCoder">AtCoder</option>
            <option value="Codeforces">Codeforces</option>
            <option value="CodeChef">CodeChef</option>
          </select>
        </div>

        <div className="rf-form-group">
          <label htmlFor="rf-contestId">Contest ID *</label>
          <input
            id="rf-contestId"
            type="text"
            className="rf-input"
            name="contestId"
            value={form.contestId}
            onChange={onChange}
            required
          />
        </div>

        <div className="rf-form-group">
          <label htmlFor="rf-evidenceLink">Evidence Link (optional)</label>
          <input
            id="rf-evidenceLink"
            type="url"
            className="rf-input"
            name="evidenceLink"
            value={form.evidenceLink}
            onChange={onChange}
            placeholder="https://example.com/screenshot"
          />
        </div>

        <div className="rf-form-group rf-full">
          <label htmlFor="rf-evidence">Details (optional)</label>
          <textarea
            id="rf-evidence"
            className="rf-textarea"
            name="evidence"
            value={form.evidence}
            onChange={onChange}
            placeholder="Describe the suspicious behavior, evidence, or context..."
          />
        </div>
      </div>
      <div className="rf-form-actions">
        <button
          className="rf-btn warn"
          type="button"
          onClick={() =>
            setForm({
              reporterName: "",
              reporterEmail: "",
              cheaterHandle: "",
              platform: "AtCoder",
              contestId: "",
              evidence: "",
              evidenceLink: "",
            })
          }
        >
          Reset
        </button>
        <button className="rf-btn" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </div>

      {status && (
        <div
          className={`rf-form-status ${status.ok ? "success" : "error"}`}
          role="status"
          aria-live="polite"
        >
          <strong>{status.ok ? "Success" : "Error"}:</strong> {status.message}
        </div>
      )}
    </form>
  );
}
