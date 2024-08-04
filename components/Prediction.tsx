import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { directors, cast } from '../assets/data';
import '../Styles/Prediction.css';

const Prediction = () => {
  const [actorsList,    setActorsList]    = useState([]);  
  const [directorsList, setDirectorsList] = useState([]);
  const [genresList,    setGenresList]    = useState([]);
  const [prediction,    setPrediction]    = useState(null);  
  const [inputs,        setInputs]        = useState({
    year: '',
    actorsInput:    actorsList,
    directorsInput: directorsList,
    genresInput:    genresList
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prevInputs => ({ ...prevInputs, [name]: value }));
  };


  const handleGenreSelect = (genre: string) => {
    if (!genresList.includes(genre)) {
      const updatedGenres = [...genresList, genre];
      setGenresList(updatedGenres);
      setInputs(() => ({
        ...inputs,
        genresInput: updatedGenres,
      }));
    }
  };

  const handleActorSelect = (actor: string) => {
    if (!actorsList.includes(actor)) {
      const updatedActors = [...actorsList, actor];
      setActorsList(updatedActors);
      setInputs(() => ({
        ...inputs,
        actorsInput: updatedActors,
      }));
    }
  };

  const handleDirectorSelect = (director: string) => {
    if (!directorsList.includes(director)) {
      const updatedDirectors = [...directorsList, director];
      setDirectorsList(updatedDirectors);
      setInputs(() => ({
        ...inputs,
        directorsInput: updatedDirectors,
      }));
    }
  };

  useEffect(() => {
    // setInputs(prevInputs => ({ ...prevInputs, directorsInput: directorsList, genresInput: genresList, actorsInput: actorsList }));
    console.log(inputs)
  }, [directorsList, genresList, actorsList]);

  const handlePredict = () => {
    axios.post('http://localhost:5000/predict', inputs)
      .then(response => setPrediction(response.data))
      .catch(error => console.error(error));
  };

  return (
    <div className="prediction-container">
      <h1>Prediction Page</h1>
      <div className="user-inputs">
        <input type="number" name="year" placeholder="Release Year" onChange={handleInputChange} value={inputs.year} required/>
        <div className="button-group">
          <DropdownButton title="Select Genres" id="dropdown-basic-button" className="custom-dropdown">
            {['Action', 'Comedy', 'Drama', 'Romance', 'Sci-Fi', 'Thriller', 'Mystery', 'Adventure', 'Music', 'War', 'History', 'Crime', 'Animation'].map(genre => (
              <Dropdown.Item key={genre} onClick={() => handleGenreSelect(genre.toLowerCase())}>
                {genre}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <DropdownButton title="Select Cast" id="dropdown-basic-button" className="custom-dropdown">
            {Object.keys(cast).map(actor => (
              <Dropdown.Item key={actor} onClick={() => handleActorSelect(actor)}>
                {actor}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <DropdownButton title="Select Directors" id="dropdown-basic-button" className="custom-dropdown">
            {directors.map(director => (
              <Dropdown.Item key={director} onClick={() => handleDirectorSelect(director)}>
                {director}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>
        <button onClick={handlePredict}>Predict Rating</button>
      </div>
      {prediction && <div className="prediction-result">Predicted Rating: {parseFloat(prediction.toFixed(1))} </div>}
    </div>
  );
};

export default Prediction;