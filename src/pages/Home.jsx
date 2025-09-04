import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Announcements from "../components/Announcements";
import "../styles/style.css";
import "../styles/page/Home.css";

export default function Home() {
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Animation trigger
    const timer = setTimeout(() => setIsLoaded(true), 100);
    
    // Live clock update
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(clockTimer);
    };
  }, []);

  const handleOverlayClick = () => {
    setShowAnnouncements(false);
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setShowAnnouncements(true);
    }
  };

  return (
    <div className={`hme-wrapper ${isLoaded ? 'hme-loaded' : ''}`}>
      {/* Enhanced Background */}
      <div className="hme-background">
        <div className="hme-background-overlay"></div>
        <div className="hme-background-particles"></div>
      </div>
      
      {/* Enhanced Announcement Bar */}
      <div 
        className="hme-announcement-bar"
        onClick={() => setShowAnnouncements(true)}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="View latest announcements and updates"
      >
        <div className="hme-announcement-content">
          <div className="hme-announcement-icon">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <span className="hme-announcement-text">
            Latest contest updates and announcements available
          </span>
          <span className="hme-announcement-badge">New</span>
          <div className="hme-announcement-arrow">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Main Hero Section */}
      <main className="hme-container">
        <div className="hme-hero">
          {/* Enhanced Status Badge */}
          <div className="hme-status-badge">
            <div className="hme-status-indicator">
              <div className="hme-status-dot"></div>
              <span className="hme-status-text">Live Tracking</span>
            </div>
            <div className="hme-status-divider"></div>
            <time className="hme-status-time">
              {currentTime.toLocaleTimeString()}
            </time>
          </div>

          {/* Enhanced Title Section */}
          <div className="hme-title-section">
            <h1 className="hme-title">
              Track Your
              <span className="hme-title-accent"> Coding Journey</span>
            </h1>
            
            <p className="hme-subtitle">
              Monitor ratings, standings, and contest history of <strong>AUST competitors</strong> 
              across <strong>AtCoder</strong>, <strong>Codeforces</strong>, and <strong>CodeChef</strong>. 
              Stay updated and never miss a contest!
            </p>
          </div>

          {/* Enhanced Statistics Cards */}
          <div className="hme-stats-grid">
            <div className="hme-stat-card hme-stat-users">
              <div className="hme-stat-icon-wrapper">
                <div className="hme-stat-icon">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83.67-1.5 1.5-1.5S12 9.67 12 10.5V11h2.5c.28 0 .5.22.5.5s-.22.5-.5.5H12v6h2v-4h3v4h2V2H4v16z"/>
                  </svg>
                </div>
              </div>
              <div className="hme-stat-content">
                <div className="hme-stat-number">500+</div>
                <div className="hme-stat-label">Active Competitors</div>
                <div className="hme-stat-description">AUST students participating</div>
              </div>
            </div>
            
            <div className="hme-stat-card hme-stat-platforms">
              <div className="hme-stat-icon-wrapper">
                <div className="hme-stat-icon">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>
              <div className="hme-stat-content">
                <div className="hme-stat-number">3</div>
                <div className="hme-stat-label">Platforms Contest Tracked</div>
                <div className="hme-stat-description">AtCoder, Codeforces, CodeChef</div>
              </div>
            </div>
            
            <div className="hme-stat-card hme-stat-realtime">
              <div className="hme-stat-icon-wrapper">
                <div className="hme-stat-icon">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                  </svg>
                </div>
              </div>
              <div className="hme-stat-content">
                <div className="hme-stat-number">24/7</div>
                <div className="hme-stat-label">Real-time Updates</div>
                <div className="hme-stat-description">Always up-to-date standings</div>
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="hme-actions">
            <Link to="/overall-standings" className="hme-btn hme-btn-primary">
              <div className="hme-btn-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span>View Standings</span>
            </Link>
            
            <Link to="/register" className="hme-btn hme-btn-secondary">
              <div className="hme-btn-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <span>Join Community</span>
            </Link>
            
            <Link to="/hall-of-shame" className="hme-btn hme-btn-danger">
              <div className="hme-btn-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <span>Hall of Shame</span>
              <div className="hme-btn-badge">⚠️</div>
            </Link>
          </div>

          {/* Enhanced Platform Integration Section */}
          <div className="hme-platforms-section">
            <div className="hme-platforms-title">
              <span>Integrated Platforms</span>
              <div className="hme-platforms-subtitle">Track your progress across multiple coding platforms</div>
            </div>
            <div className="hme-platforms-grid">
              <div className="hme-platform-card atcoder">
                <div className="hme-platform-header">
                  <div className="hme-platform-logo">AC</div>
                  <div className="hme-platform-status online">
                    <div className="hme-platform-status-dot"></div>
                    <span>Online</span>
                  </div>
                </div>
                <div className="hme-platform-content">
                  <div className="hme-platform-name">AtCoder</div>
                  <div className="hme-platform-description">Japanese competitive programming</div>
                </div>
                <div className="hme-platform-stats">
                  <div className="hme-platform-stat">
                    <span className="hme-platform-stat-value">150+</span>
                    <span className="hme-platform-stat-label">Users</span>
                  </div>
                </div>
              </div>
              
              <div className="hme-platform-card codeforces">
                <div className="hme-platform-header">
                  <div className="hme-platform-logo">CF</div>
                  <div className="hme-platform-status online">
                    <div className="hme-platform-status-dot"></div>
                    <span>Online</span>
                  </div>
                </div>
                <div className="hme-platform-content">
                  <div className="hme-platform-name">Codeforces</div>
                  <div className="hme-platform-description">Global competitive programming</div>
                </div>
                <div className="hme-platform-stats">
                  <div className="hme-platform-stat">
                    <span className="hme-platform-stat-value">200+</span>
                    <span className="hme-platform-stat-label">Users</span>
                  </div>
                </div>
              </div>
              
              <div className="hme-platform-card codechef">
                <div className="hme-platform-header">
                  <div className="hme-platform-logo">CC</div>
                  <div className="hme-platform-status online">
                    <div className="hme-platform-status-dot"></div>
                    <span>Online</span>
                  </div>
                </div>
                <div className="hme-platform-content">
                  <div className="hme-platform-name">CodeChef</div>
                  <div className="hme-platform-description">Indian competitive programming</div>
                </div>
                <div className="hme-platform-stats">
                  <div className="hme-platform-stat">
                    <span className="hme-platform-stat-value">150+</span>
                    <span className="hme-platform-stat-label">Users</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Quick Navigation */}
          <div className="hme-quick-nav">
            <div className="hme-quick-nav-title">Quick Navigation</div>
            <div className="hme-quick-nav-grid">
              <Link to="/contest-search" className="hme-quick-nav-item">
                <div className="hme-quick-nav-icon search">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="hme-quick-nav-content">
                  <span className="hme-quick-nav-label">Search Contests</span>
                  <span className="hme-quick-nav-desc">Find specific contests</span>
                </div>
              </Link>
              
              <Link to="/national-contests" className="hme-quick-nav-item">
                <div className="hme-quick-nav-icon national">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </div>
                <div className="hme-quick-nav-content">
                  <span className="hme-quick-nav-label">National Contests</span>
                  <span className="hme-quick-nav-desc">Bangladesh contests</span>
                </div>
              </Link>
              
              <Link to="/about" className="hme-quick-nav-item">
                <div className="hme-quick-nav-icon about">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="hme-quick-nav-content">
                  <span className="hme-quick-nav-label">About</span>
                  <span className="hme-quick-nav-desc">Learn more</span>
                </div>
              </Link>
              
              <Link to="/report-cheater" className="hme-quick-nav-item">
                <div className="hme-quick-nav-icon report">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="hme-quick-nav-content">
                  <span className="hme-quick-nav-label">Report Issue</span>
                  <span className="hme-quick-nav-desc">Report cheaters</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Modal */}
      {showAnnouncements && (
        <div className="hme-modal-backdrop" onClick={handleOverlayClick}>
          <div className="hme-modal" onClick={stopPropagation}>
            <button 
              className="hme-modal-close"
              onClick={() => setShowAnnouncements(false)}
              aria-label="Close announcements modal"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="hme-modal-content">
              <Announcements />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
