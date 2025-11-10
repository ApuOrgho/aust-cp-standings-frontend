import React, { useState, useEffect } from "react"; // Import useEffect
import { FaFacebook, FaUsers, FaEnvelope } from "react-icons/fa";
import "../styles/style.css";
import "../styles/comp/Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // State to handle the scroll-in/scroll-out effect
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    // Check scroll direction
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      // Scrolling down and past the initial hero section (100px threshold)
      setIsVisible(false);
    } else {
      // Scrolling up, or at the very top of the page
      setIsVisible(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]); // Re-run effect when lastScrollY changes

  return (
    // Use isVisible state to conditionally apply a CSS class for hiding
    <footer className={`footer ${!isVisible ? "footer-hidden" : ""}`}>
      <div className="footer-inner container">
        {/* Left Section: Copyright and Subtitle */}
        <div className="footer-content">
          <div>
            © {currentYear} AUST CP Community
            <div className="footer-subtitle">Built For AUST Students</div>
          </div>
        </div>

        {/* Right Section: Social Links */}
        <div className="footer-social-links">
          <a
            className="footer-link"
            href="https://www.facebook.com/profile.php?id=61579667431366"
            target="_blank"
            rel="noreferrer"
            aria-label="Visit our Facebook Page"
          >
            <FaFacebook size={18} /> Visit Page
          </a>

          <a
            className="footer-link"
            href="https://www.facebook.com/groups/169147366481409"
            target="_blank"
            rel="noreferrer"
            aria-label="Join our Facebook Group"
          >
            <FaUsers size={18} /> Join Us
          </a>

          <a
            className="footer-link"
            href="https://mail.google.com/mail/?view=cm&fs=1&to=aust.competitive.programming@gmail.com&su=Subject%20Here&body=Hello%2C%20"
            target="_blank"
            rel="noreferrer"
            aria-label="Email Us"
          >
            <FaEnvelope size={18} /> Email Us
          </a>
        </div>
      </div>
    </footer>
  );
}
