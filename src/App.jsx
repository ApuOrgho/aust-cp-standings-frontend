import React from "react";
import { Routes, Route } from "react-router-dom";
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

export default function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/overall-standings" element={<OverallStandings />} />
          <Route path="/contest-search" element={<ContestSearch />} />
          <Route path="/report-cheater" element={<ReportCheater />} />
          <Route path="/register" element={<Register />} />
          <Route path="/hall-of-shame" element={<HallOfShame />} />
          <Route path="/about" element={<About />} />
          <Route path="/national-contests" element={<NationalContests />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
