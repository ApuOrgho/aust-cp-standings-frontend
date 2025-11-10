import React, { useState } from "react";
import "../styles/style.css";
import "../styles/comp/ContactAdmin.css";

export default function ContactAdmin({ submitUrl }) {
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null); // { ok: boolean, message: string }

  const send = async (e) => {
    e?.preventDefault();
    if (!msg.trim() || !email.trim()) {
      setStatus({ ok: false, message: "Email and message required" });
      return;
    }
    setSending(true);
    setStatus(null);
    try {
      if (submitUrl) {
        const r = await fetch(submitUrl, {
          method: "POST",
          body: JSON.stringify({ email, message: msg }),
          headers: { "Content-Type": "application/json" },
        });
        if (!r.ok) throw new Error("fail");
      } else {
        await new Promise((r) => setTimeout(r, 500));
      }
      setStatus({ ok: true, message: "Message delivered — thank you." });
      setMsg("");
      setEmail("");
    } catch (err) {
      setStatus({ ok: false, message: "Delivery failed. Try later." });
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="contact-admin card" onSubmit={send} aria-live="polite">
      <h3>Contact Admin</h3>

      <div className="ca-form-group">
        <label htmlFor="ca-email">Your email</label>
        <input
          id="ca-email"
          name="email"
          type="email"
          autoComplete="email"
          className="ca-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="ca-form-group">
        <label htmlFor="ca-message">Message</label>
        <textarea
          id="ca-message"
          name="message"
          className="ca-textarea"
          rows={4}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="How can we help?"
          required
        />
      </div>

      <div className="ca-form-actions">
        <button
          className="ca-btn ca-primary"
          type="submit"
          disabled={sending}
          aria-disabled={sending}
        >
          {sending ? "Sending..." : "Send"}
        </button>
        <button
          type="button"
          className="ca-btn"
          onClick={() => {
            setEmail("");
            setMsg("");
            setStatus(null);
          }}
        >
          Clear
        </button>
      </div>

      {status && (
        <div
          className={`ca-form-status ${status.ok ? "ok" : "err"}`}
          role="status"
          aria-live="polite"
        >
          {status.message}
        </div>
      )}
    </form>
  );
}
