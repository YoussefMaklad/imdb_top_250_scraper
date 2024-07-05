import './App.css';
import Home from './components/Home';
import Scrapping from './components/Scrapping';
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
      </Routes>
    </Router>
  );
}

export default App;
