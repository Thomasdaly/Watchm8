const express = require('express');
const router = express.Router(); // Import the fetch function

router.get('/', async function(req, res, next) {
  try {
    const apiKey = '6c6dc6f91161b15e53ed5de0ceb38bfa';
    // Define the URL for the TMDB API request
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=jurassic&include_adult=false&language=en-US&page=1&api_key=${apiKey}`);

    if (!response.ok) {
      throw new Error('Failed to fetch data from TMDB API');
    }

    const data = await response.json();
    const movies = data.results; // Access the movie results
    console.log(movies);
    

    res.render('movieSelect', { title: 'Movie Selection', movies });
  } catch (error) {
    console.error('Error fetching movie data:', error);
    // Handle the error appropriately, for example, send an error response to the client
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
