// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Day1Page from './pages/Day1Page';
import Footer from './components/Footer';
import CirclePage from './pages/CirclePage';
import TrianglePage from './pages/TrianglePage';
import SquarePage from './pages/SquarePage';
import StarPage from './pages/StarPage';
import Round2Page from './pages/Round2Page';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/day1" element={<Day1Page />} />
          <Route path="/circle" element={<CirclePage />} />
          <Route path="/triangle" element={<TrianglePage />} />
          <Route path="/square" element={<SquarePage />} />
          <Route path="/star" element={<StarPage />} />
          <Route path="/round2" element={<Round2Page />} />
          {/* Add /day2 later */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;