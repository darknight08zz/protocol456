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
import Day2Page from './pages/Day2Page';
import Gallery from './components/gallery';
import About from './components/About';
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
          <Route path="/day2" element={<Day2Page />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;