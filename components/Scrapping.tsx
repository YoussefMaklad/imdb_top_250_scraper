import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown, DropdownButton, Button, Form } from 'react-bootstrap';
import Movie from './Movie';
import '../Styles/Scrapping.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Scrapping = () => {
  const [director, setDirector] = useState<string>('');
  const [genres, setGenres]     = useState<string[]>([]);
  const [scrapedMovies, setScrapedMovies] = useState<any[]>([]);

  axios.defaults.baseURL = 'http://localhost:5000';

  const scrapeIMDB = (choice: number) => {
    axios.post('/scrape-imdb', { choice, director, genres })
      .then(response => {
        setScrapedMovies(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  const handleGenreSelect = (genre: string) => {
    if(!genres.includes(genre)){
        setGenres(prevGenres => [...prevGenres, genre]);   
    }
  };

  useEffect(() => {
    console.log(genres)
  }, [genres])

  return (
    <div className="scrapping-container">
      <div>
      <h1 className="H1-scrap">Scrapping Page</h1>
      <h3 className="h3-scrap">Choose your options:</h3>
      </div>
      <div className="options-container">
        <Button className="custom-button" onClick={() => scrapeIMDB(1)}>Scrape Top 250 Movies</Button>
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
      {scrapedMovies.map((movie, index) => (
        <Movie
          key={index}
          title={movie.title}
          rating={movie.rating}
          genres={movie.genres}
          releaseYear={movie.release_year}
          directors={movie["director(s)"]}
          cast={movie.cast}
        />
      ))}
      </div>
    </div>
  );
}

export default Scrapping;