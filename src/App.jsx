import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext"; // Import the ThemeProvider
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import OverallStandings from "./pages/OverallStandings";
import ContestSearch from "./pages/ContestSearch";
import ReportCheater from "./pages/ReportCheater";
import Register from "./pages/Register";
import HallOfShame from "./pages/HallOfShame";
import About from "./pages/About";
import NationalContests from "./pages/NationalContests";
import "./App.css"; // Import App.css for layout

export default function App() {
  return (
    // Wrap your entire application in the ThemeProvider
    <ThemeProvider>
      <div className="app-root">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/standings/overall" element={<OverallStandings />} />
            <Route path="/standings/contest" element={<ContestSearch />} />
            <Route path="/national-contests" element={<NationalContests />} />
            <Route path="/report-cheater" element={<ReportCheater />} />
            <Route path="/register" element={<Register />} />
            <Route path="/hall-of-shame" element={<HallOfShame />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
