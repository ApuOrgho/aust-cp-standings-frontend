import React, { useState } from "react";
import "../styles/style.css";
import "../styles/comp/ReportForm.css";

export default function ReportForm() {
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
        "https://formsubmit.co/ajax/apuorgho7@gmail.com",
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
    <form className="rf-report-form" onSubmit={onSubmit}>
      <h2 style={{ textAlign: "center", marginBottom: "1em" }}>
        Report a Cheater
      </h2>

      <div className="rf-form-group">
        <label>Reporter Name *</label>
        <input
          type="text"
          className="rf-input"
          name="reporterName"
          value={form.reporterName}
          onChange={onChange}
          required
        />
      </div>

      <div className="rf-form-group">
        <label>Reporter Email *</label>
        <input
          type="email"
          className="rf-input"
          name="reporterEmail"
          value={form.reporterEmail}
          onChange={onChange}
          required
        />
      </div>

      <div className="rf-form-group">
        <label>Cheater Handle *</label>
        <input
          type="text"
          className="rf-input"
          name="cheaterHandle"
          value={form.cheaterHandle}
          onChange={onChange}
          required
        />
      </div>

      <div className="rf-form-group">
        <label>Platform *</label>
        <select
          className="rf-select"
          name="platform"
          value={form.platform}
          onChange={onChange}
          required
        >
          <option>AtCoder</option>
          <option>Codeforces</option>
          <option>CodeChef</option>
        </select>
      </div>

      <div className="rf-form-group">
        <label>Contest ID *</label>
        <input
          type="text"
          className="rf-input"
          name="contestId"
          value={form.contestId}
          onChange={onChange}
          required
        />
      </div>

      <div className="rf-form-group">
        <label>Evidence Link (optional)</label>
        <input
          type="text"
          className="rf-input"
          name="evidenceLink"
          value={form.evidenceLink}
          onChange={onChange}
        />
      </div>

      <div className="rf-form-group">
        <label>Details (optional)</label>
        <textarea
          className="rf-textarea"
          name="evidence"
          value={form.evidence}
          onChange={onChange}
          placeholder="Describe the suspicious behavior, evidence, or context..."
        />
      </div>

      <div className="rf-form-actions">
        <button
          className="rf-btn warn"
          type="reset"
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
        <div className={`rf-form-status ${status.ok ? "success" : "error"}`}>
          <strong>{status.ok ? "Success" : "Error"}:</strong> {status.message}
        </div>
      )}
    </form>
  );
}
