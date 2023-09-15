const express = require('express');
const router = express.Router(); // Import the fetch function
let movies = [];
let selectedMovie = [];
router.get('/', function(req, res, next) {
  res.render('movieSelect', { title: 'Movie Selection', movies: [] });
});

router.post('/', async function(req, res, next) {
  try {
    const apiKey = '6c6dc6f91161b15e53ed5de0ceb38bfa';
    const query = req.body.search; // Get the search query from the form data
    console.log(`Search query: ${query}`);
    if (!query) {
      return res.redirect('/movieselect'); // Redirect to the same page if no search query is provided
    }

    // Define the URL for the TMDB API request with the user's search query
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1&api_key=${apiKey}`);

    if (!response.ok) {
      throw new Error('Failed to fetch data from TMDB API');
    }

    const data = await response.json();
    movies = data.results; // Access the movie results

    res.render('movieSelect', { title: 'Movie Selection', movies });
  } catch (error) {
    console.error('Error fetching movie data:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/', async function(req, res, next) {
  try {
    console.log(`Query Response:${req.body.title}`)
    const selectedMovie = {
      title: req.body.title,
      imdbID: req.body.imdbID
  };
    selectedMovie.push(selectedMovie);  
    console.log(`Query Response:${selectedMovie.title}`);
    res.render('movieSelect', { title: 'Movie Selection', movies});
  }
  catch (error) {
    console.error('Error fetching movie data:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;