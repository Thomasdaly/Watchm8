const express = require('express');
const router = express.Router();
var session = require('express-session');
let movies = req.session.selectedMovies;
let selectedMovies = []; // Use an array to store selected movies



router.get('/', async function(req, res, next) { // Note the 'async' keyword
  try {
      const apiKey = '6c6dc6f91161b15e53ed5de0ceb38bfa';
    
    const response = await fetch(`https://api.themoviedb.org/3/watch/providers/regions?language=en-US&api_key=${apiKey}`);
    const data = await response.json();
    
    countries = data.results;
    
    
    
    // Render the countryselect page with the list of countries
    res.render('countryselect', { title: 'Country Select', countries });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).send('Internal Server Error');
  }
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
    const id = req.body.id;
    console.log(`Selected movie: ${title} (${id})`);
    // Create a new selected movie object
    const selectedMovie = {
      title: title,
      id: id
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
