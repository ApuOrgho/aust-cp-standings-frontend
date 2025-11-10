import React, { useState } from "react";
import "../styles/style.css";
import "../styles/comp/RegisterForm.css";

export default function RegisterForm() {
  const [form, setForm] = useState({
    fullName: "",
    semester: "",
    email: "",
    codeforces: "",
    codechef: "",
    atcoder: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.fullName || !form.semester || !form.email) {
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
            FullName: form.fullName,
            Semester: form.semester,
            Email: form.email,
            Codeforces: form.codeforces,
            Codechef: form.codechef,
            Atcoder: form.atcoder,
          }),
        }
      );
      const data = await resp.json();
      if (data.success === "true" || resp.ok) {
        setStatus({ ok: true, message: "Registration submitted. Thank you!" });
        setForm({
          fullName: "",
          semester: "",
          email: "",
          codeforces: "",
          codechef: "",
          atcoder: "",
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
    <form onSubmit={onSubmit} className="rfm-register-form-section" noValidate>
      <div className="rfm-form-title">Register (AUST Only)</div>

      <div className="rfm-form-row">
        <div className="rfm-form-field">
          <label htmlFor="rfm-fullName">Full Name *</label>
          <input
            id="rfm-fullName"
            className="rfm-input"
            name="fullName"
            value={form.fullName}
            onChange={onChange}
            required
            autoComplete="name"
            placeholder="Your full name"
          />
        </div>
        <div className="rfm-form-field">
          <label htmlFor="rfm-semester">Semester *</label>
          <input
            id="rfm-semester"
            className="rfm-input"
            name="semester"
            value={form.semester}
            onChange={onChange}
            required
            placeholder="E.g. 1.1"
          />
        </div>
      </div>

      <div className="rfm-form-row">
        <div className="rfm-form-field">
          <label htmlFor="rfm-email">Email *</label>
          <input
            id="rfm-email"
            className="rfm-input"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
            autoComplete="email"
            placeholder="your.email@example.com"
          />
        </div>
      </div>

      <div className="rfm-form-row">
        <div className="rfm-form-field">
          <label htmlFor="rfm-codeforces">Codeforces Handle</label>
          <input
            id="rfm-codeforces"
            className="rfm-input"
            name="codeforces"
            value={form.codeforces}
            onChange={onChange}
            placeholder="Optional"
          />
        </div>
        <div className="rfm-form-field">
          <label htmlFor="rfm-codechef">CodeChef Handle</label>
          <input
            id="rfm-codechef"
            className="rfm-input"
            name="codechef"
            value={form.codechef}
            onChange={onChange}
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="rfm-form-row">
        <div className="rfm-form-field">
          <label htmlFor="rfm-atcoder">AtCoder Handle</label>
          <input
            id="rfm-atcoder"
            className="rfm-input"
            name="atcoder"
            value={form.atcoder}
            onChange={onChange}
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="rfm-form-actions">
        <button
          className="rfm-btn warn"
          type="button"
          onClick={() =>
            setForm({
              fullName: "",
              semester: "",
              email: "",
              codeforces: "",
              codechef: "",
              atcoder: "",
            })
          }
        >
          Reset
        </button>
        <button className="rfm-submit-btn" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Register"}
        </button>
      </div>

      {status && (
        <div
          className={`rfm-status-message ${status.ok ? "success" : "error"}`}
          role="status"
          aria-live="polite"
        >
          <strong>{status.ok ? "Success:" : "Error:"}</strong> {status.message}
        </div>
      )}
    </form>
  );
}
