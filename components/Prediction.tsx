import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { directors, genres } from '../assets/data';
import '../Styles/Prediction.css';

const Prediction = () => {
  const [inputs, setInputs] = useState({
    director: '',
    year: '',
    genre: ''
  });
  const [prediction, setPrediction] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prevInputs => ({ ...prevInputs, [name]: value }));
  };

  const handlePredict = () => {
    axios.post('http://localhost:5000/predict', inputs)
      .then(response => setPrediction(response.data))
      .catch(error => console.error(error));
  };

  return (
    <div className="prediction-container">
      <h1>Prediction Page</h1>
      <div className="user-inputs">
        <select name="director" onChange={handleInputChange} value={inputs.director}>
          <option value="">Select Director</option>
          {directors.map((director, index) => (
            <option key={index} value={director}>{director}</option>
          ))}
        </select>

        {/* Input for Release Year */}
        <input type="number" name="year" placeholder="Release Year" onChange={handleInputChange} value={inputs.year} />

        {/* Dropdown for Genre */}
        <select name="genre" onChange={handleInputChange} value={inputs.genre}>
          <option value="">Select Genre</option>
          {genres.map((genre, index) => (
            <option key={index} value={genre}>{genre}</option>
          ))}
        </select>

        <button onClick={handlePredict}>Predict Rating</button>
      </div>
      {prediction && <div className="prediction-result">Predicted Rating: {prediction}</div>}
    </div>
  );
};

export default Prediction;
