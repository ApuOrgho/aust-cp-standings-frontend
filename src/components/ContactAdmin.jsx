import React, { useState } from "react";
import "../styles/style.css";
import "../styles/comp/ContactAdmin.css";

export default function ContactAdmin() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); // prevent normal submit and page reload

    const form = e.target;
    const formData = new FormData(form);

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/apuorgho7@gmail.com",
        {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }, // needed for JSON response
        }
      );

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        form.reset();
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (err) {
      alert("An error occurred. Please try again later.");
      console.error(err);
    }
  }

  return (
    <div className="ca-contact-form">
      <h3>Contact Admin</h3>

      <p>
        For general inquiries or issues not related to cheating reports, feel
        free to contact us here.
      </p>

      <form
        method="POST"
        onSubmit={handleSubmit} // use AJAX submit handler
      >
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_next" value={window.location.href} />

        <div className="ca-form-group">
          <label>Your Name *</label>
          <input className="ca-input" type="text" name="name" required />
        </div>

        <div className="ca-form-group">
          <label>Your Email *</label>
          <input className="ca-input" type="email" name="email" required />
        </div>

        <div className="ca-form-group">
          <label>Your Message *</label>
          <textarea className="ca-textarea" name="message" required />
        </div>

        <div className="ca-form-actions">
          <button className="btn small" type="submit">
            Send Message
          </button>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=apuorgho7@gmail.com&su=General%20Inquiry"
            target="_blank"
            rel="noopener noreferrer"
            className="btn warn"
          >
            Or Email Directly
          </a>
        </div>

        {submitted && (
          <div className="ca-form-status">
            Thank you! Your message has been sent.
          </div>
        )}
      </form>
    </div>
  );
}
