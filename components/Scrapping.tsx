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
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  const handleGenreSelect = (genre: string) => {
    console.log(genres);
    if(!genres.includes(genre)){
        setGenres(prevGenres => [...prevGenres, genre]);
        console.log(genres);
    }
  };

//   const handleGenreSelect = (genre: string) => {
//     console.log("before:", genres);
//     if (!genres.includes(genre)) {
//         setGenres(prevGenres => {
//             const updatedGenres = [...prevGenres, genre];
//             console.log("updated:", updatedGenres); // Log genres after updating state
//             return updatedGenres;
//         });
//     }
//     console.log("after:", genres);
// };

  return (
    <div className="scrapping-container">
      <div>
      <h1 className="H1-scrap">Scrapping Page</h1>
      <h3 className="h3-scrap">Choose your options:</h3>
      </div>
      <div className="options-container">
        <Button className="custom-button" onClick={() => scrapeIMDB(1)}>Top 250 Movies</Button>
        <Button className="custom-button" onClick={() => scrapeIMDB(2)}>Scrape By Director</Button>
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
          <Button className="custom-button" onClick={() => scrapeIMDB(3)}>Scrape By Genres</Button>
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
