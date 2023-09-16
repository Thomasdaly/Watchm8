const express = require('express');
const router = express.Router();

let movies = [];
let selectedMovies = []; // Use an array to store selected movies

router.get('/', function(req, res, next) {
  res.render('movieSelect', { title: 'Movie Selection', movies: [], selectedMovies: [] });
});

router.post('/', async function(req, res, next) {
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

router.post('/select', function(req, res, next) {
  try {
    const title = req.body.title;
    const imdbID = req.body.imdbID;
    console.log(`Selected movie: ${title} (${imdbID})`);
    // Create a new selected movie object
    const selectedMovie = {
      title: title,
      imdbID: imdbID
    };

    // Add the selected movie to the selectedMovies array
    selectedMovies.push(selectedMovie);

    res.render('movieSelect', { title: 'Movie Selection', movies, selectedMovies });
  } catch (error) {
    console.error('Error selecting movie:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
