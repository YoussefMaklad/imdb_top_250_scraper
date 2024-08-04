import React from 'react';

const Movie = (props) => {
  return (
    <div className="movie">
      <h3>{props.title}</h3>
      <p><strong>Rating:</strong> {props.rating}</p>
      <p><strong>Genres:</strong> {props.genres.join(', ')}</p>
      <p><strong>Release Year:</strong> {props.releaseYear}</p>
      <p><strong>Director(s):</strong> {props.directors.join(', ')}</p>
      <p><strong>Cast:</strong> {props.cast.join(', ')}</p>
    </div>
  );
};

export default Movie;