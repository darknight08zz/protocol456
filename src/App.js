// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Day1Page from './pages/Day1Page';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/day1" element={<Day1Page />} />
          {/* Add /day2 later */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;