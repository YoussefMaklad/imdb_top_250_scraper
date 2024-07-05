import React, { useState } from 'react';
import axios from 'axios';
import { Dropdown, DropdownButton, Button, Form } from 'react-bootstrap';
import Lottie from 'lottie-react';
import animationData from "../assets/Animation - 1716147533613 (3).json"
import '../Styles/Scrapping.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Scrapping = () => {
  const [director, setDirector] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [scrapedData, setScrapedData] = useState<any[]>([]);

  axios.defaults.baseURL = 'http://localhost:5000';

  const scrapeIMDB = (choice: number) => {
    axios.post('/scrape-imdb', { choice, director, genres })
      .then(response => {
        setScrapedData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  const handleGenreSelect = (genre: string) => {
    setGenres(prevGenres => [...prevGenres, genre]);
  };

  return (
    <div className="scrapping-container">
      <div>

      {/* <Lottie animationData={animationData} className='lottie'/> */}
      <h1 className="H1-scrap">Scrapping Page</h1>
      <h3 className="h3-scrap">Choose your options:</h3>
      </div>
      <div className="options-container">
        <Button className="custom-button" onClick={() => scrapeIMDB(1)}>Top 250 Movies</Button>
        <Form.Control 
          type="text" 
          placeholder="Director" 
          className="custom-input" 
          onChange={(e) => setDirector(e.target.value)} 
        />
        <div className="custom-dropdown-genre">
          <DropdownButton title="Specific Genres" id="dropdown-basic-button" className="custom-dropdown">
            {['Action', 'Comedy', 'Drama', 'Romance', 'Sci-Fi', 'Thriller', 'Mystery', 'Adventure', 'Music', 'War', 'History', 'Crime', 'Animation'].map(genre => (
              <Dropdown.Item key={genre} onClick={() => handleGenreSelect(genre.toLowerCase())}>
                {genre}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <Button className="custom-genre" onClick={() => scrapeIMDB(3)}>Scrape by Genres</Button>
        </div>
      </div>
      <div className="scrapped-data-container">
        {scrapedData.map((movie, index) => (
          <div key={index} className="movie">
            <h3>{movie.title}</h3>
            <p><strong>Rating:</strong> {movie.rating}</p>
            <p><strong>Genres:</strong> {movie.genres.join(', ')}</p>
            <p><strong>Release Year:</strong> {movie.release_year}</p>
            <p><strong>Director(s):</strong> {movie["director(s)"].join(', ')}</p>
            <p><strong>Cast:</strong> {movie.cast.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Scrapping;
