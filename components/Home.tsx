import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Home.css';
// import bg from '../assets/peaky_blinders-removebg-preview (1).png';
import imdb from '../assets/imdb_logo.png';
import logo from '../assets/b5b47ddf21674a1a5074083a3d8ba847-removebg-preview.png';
import play from '../assets/play.png';
import Lottie from 'lottie-react';
import animationData from '../assets/Animation - 1716149182006.json'

const Home = () => {
  const navigate = useNavigate();

  const handleScrappingClick = () => {
    navigate('/scrapping');
  };

  const handlePredictionClick = () => {
    navigate('/prediction');
  };

  return (
    <div>
      <div className='split-background'></div>
      <div className='containor-home'>
        <div className='card-home'>
          <div className='content-home'>
            <Lottie animationData={animationData} className='image-home'/>
            <img src={imdb} className='imdb-home' />
            <img src={logo} className='PB_logo' />
            <h2 className='content'>
              <p>We specialize in scrapping recommendation movie systems.</p>
              <p>You can also predict the rating of a movie using our model!</p>
            </h2>
            <div className='watch-home' onClick={handleScrappingClick}>
              <img src={play} className='button-home' alt="Play button" />
              <span className="text">Let's Go</span>
            </div>
            <br />
            <div className='watch-home' onClick={handlePredictionClick}>
              <img src={play} className='button-home' alt="Play button" />
              <span className="text">Predict Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;