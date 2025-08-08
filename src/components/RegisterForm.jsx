import React, { useState } from "react";
import "../styles/style.css";
import "../styles/comp/RegisterForm.css";
import {
  getJSON,
  parseAtCoderRatings,
  parseCodechefRatings,
  parseCodeforcesRatings,
} from "../utils";
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
        "https://formsubmit.co/ajax/apuorgho7@gmail.com",
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
    <form
      onSubmit={onSubmit}
      className="rfm-register-form-section"
      style={{ maxWidth: 840, margin: "0 auto" }}
    >
      <h3
        style={{ color: "#000004", fontFamily: "system-ui", fontSize: "2em" }}
      >
        Register (AUST Only)
      </h3>

      <div className="rfm-form-row">
        <div className="rfm-form-field">
          <label>Full Name *</label>
          <input
            className="rfm-input"
            name="fullName"
            value={form.fullName}
            onChange={onChange}
            required
            placeholder="Your full name"
          />
        </div>
        <div className="rfm-form-field">
          <label>Semester *</label>
          <input
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
        <div className="rfm-form-field" style={{ flex: 1 }}>
          <label>Email *</label>
          <input
            className="rfm-input"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
            placeholder="your.email@example.com"
          />
        </div>
      </div>

      <div className="rfm-form-row">
        <div className="rfm-form-field">
          <label>Codeforces Handle</label>
          <input
            className="rfm-input"
            name="codeforces"
            value={form.codeforces}
            onChange={onChange}
            placeholder="Optional"
          />
        </div>
        <div className="rfm-form-field">
          <label>CodeChef Handle</label>
          <input
            className="rfm-input"
            name="codechef"
            value={form.codechef}
            onChange={onChange}
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="rfm-form-row">
        <div className="rfm-form-field" style={{ flex: 1 }}>
          <label>AtCoder Handle</label>
          <input
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
          type="reset"
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
        >
          <strong>{status.ok ? "Success:" : "Error:"}</strong> {status.message}
        </div>
      )}
    </form>
  );
}
