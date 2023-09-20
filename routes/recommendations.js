const express = require('express');
const router = express.Router();
var session = require('express-session');
let recommendedMovies = [];
const apiKey = '6c6dc6f91161b15e53ed5de0ceb38bfa';

async function fetchWatchProviders(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  return data.results || {};
}

async function fetchRatingsFromOMDB(title) {
  const omdbApiKey = '214b147d'; // Replace with your OMDB API key
  const omdbUrl = `http://www.omdbapi.com/?t=${title}&apikey=${omdbApiKey}`;

  try {
    const response = await fetch(omdbUrl);
    const data = await response.json();

    // Extract the ratings from the OMDB response
    const ratings = {};
    data.Ratings.forEach((rating) => {
      ratings[rating.Source] = rating.Value;
    });

    return ratings;
  } catch (error) {
    console.error('Error fetching ratings from OMDB:', error);
    return {};
  }
}

router.get('/', async function (req, res, next) {
  try {
    const selectedCountry = req.session.selectedCountry; // Replace with the actual selected country
    const movies = req.session.selectedMovies;

    const filteredMovies = [];
    for (const movie of movies) {
      const id = movie.id;
      const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1&api_key=${apiKey}`);
      const data = await response.json();
      const resultedMovies = data.results;

      // Push each individual movie into the recommendedMovies array
      for (const movieResult of resultedMovies) {
        recommendedMovies.push(movieResult);
      }
    }
    for (const movie of recommendedMovies) {
      const id = movie.id;
      const watchProviders = await fetchWatchProviders(id);
      const selectedServices = req.session.selectedServices;
      const ratings = await fetchRatingsFromOMDB(movie.title); // Fetch ratings

      // Check if watchProviders[selectedCountry] exists and has a flatrate property
      if (
        watchProviders[selectedCountry] &&
        watchProviders[selectedCountry].hasOwnProperty('flatrate') &&
        watchProviders[selectedCountry].flatrate.length > 0 &&
        selectedServices.includes(watchProviders[selectedCountry].flatrate[0].provider_id)
      ) {
        // Movie is available on the selected streaming service in the selectedCountry
        filteredMovies.push({
          movieData: movie,
          streamingProviders: watchProviders[selectedCountry].flatrate,
          ratings: ratings, // Add ratings to the movie object
        });
      }
    }
    console.log(filteredMovies);
    // Render the recommendations page with the filtered movies
    res.render('recommendations', {
      title: 'Movie Recommendations',
      recommendedMovies: filteredMovies,
    });
  } catch (error) {
    console.error('Error fetching movie recommendations:', error);
    res.status(500).send('Internal Server Error');
  }
});
router.post('/open-youtube', async function (req, res) {
  try {
    // Retrieve the movie title from the form data (assuming it's sent in the request body)
    const title = req.body.title;

    // Search for the movie trailer on YouTube using the title
    const youtubeResponse = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&order=relevance&q=${title} trailer hd&key=AIzaSyDIChVrGak-MUFWw4Z4HMwv_k_T9TN3d9U`);

    if (!youtubeResponse.ok) {
      throw new Error('Failed to fetch YouTube data');
    }

    const youtubeData = await youtubeResponse.json();

    // Extract the video ID from the YouTube search result
    if (youtubeData.items && youtubeData.items.length > 0) {
      const videoId = youtubeData.items[0].id.videoId;

      // Construct the YouTube video URL
      const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

      // Open the YouTube video URL in a new tab
      res.redirect(youtubeUrl);
    } else {
      throw new Error('No YouTube video found for the given title');
    }
  } catch (error) {
    console.error('Error opening YouTube video:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
