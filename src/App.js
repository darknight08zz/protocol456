// src/App.js
import React from 'react';
import './styles/global.css';
import Header from './components/Header';
import Hero from './components/Hero';      // now includes registration
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <Footer />
    </div>
  );
}

export default App;