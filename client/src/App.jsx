import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/navbar';
import Home from './pages/Home';
import Projets from './pages/Projets';
import Apropos from './pages/Apropos';
import Contact from './pages/Contact';
import Blog from './pages/Blog';

function AppContent() {
  const { isDark } = useTheme();
  
  return (
    <Router>
      <div 
        className="App h-screen flex flex-col m-0 p-0 transition-colors duration-300"
        style={{ backgroundColor: isDark ? '#000000' : '#ffffff' }}
      >
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projets" element={<Projets />} />
            <Route path="/apropos" element={<div className="h-full overflow-auto"><Apropos /></div>} />
            <Route path="/contact" element={<div className="h-full overflow-auto"><Contact /></div>} />
            <Route path="/blog" element={<div className="h-full overflow-auto"><Blog /></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
