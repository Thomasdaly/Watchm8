const express = require('express');
const router = express.Router();
const mw = require('../s3-interactions.js');
var session = require('express-session');
let movies = [];
let selectedMovies = [];

router.get('/', function (req, res, next) {
  res.render('movieSelect', { title: 'Movie Selection', movies: [], selectedMovies: [], view: req.session.views });
});

router.post('/', async function (req, res, next) {
  try {
    const apiKey = '6c6dc6f91161b15e53ed5de0ceb38bfa';
    const query = req.body.search;
    console.log(`Search query: ${query}`);

    if (!query) {
      return res.redirect('/movieselect');
    }

    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1&api_key=${apiKey}`);

    if (!response.ok) {
      throw new Error('Failed to fetch data from TMDB API');
    }

    const data = await response.json();
    movies = data.results;

    res.render('movieSelect', { title: 'Movie Selection', movies, selectedMovies });
  } catch (error) {
    console.error('Error fetching movie data:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/select', function (req, res, next) {
  try {
    const title = req.body.title;
    const id = req.body.id;
    console.log(`Selected movie: ${title} (${id})`);

    // Create a new selected movie object
    const selectedMovie = {
      title: title,
      id: id
    };

    selectedMovies.push(selectedMovie);
    // Add the selected movie to the selectedMovies array in the session
    req.session.selectedMovies = selectedMovies;

    // Redirect to the recommendations page after selecting a movie
    res.redirect('/recommendations');
  } catch (error) {
    console.error('Error selecting movie:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;