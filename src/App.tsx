import React from 'react';
// import './App.css';
import '../Styles/Home.css';
import Home from '../components/Home';
import Scrapping from '../components/Scrapping';
import Prediction from '../components/Prediction'; 
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scrapping" element={<Scrapping />} />
        <Route path="/prediction" element={<Prediction />} />
      </Routes>
    </Router>
  );
}

export default App;
