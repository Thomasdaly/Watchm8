const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('movieSelect', { title: 'Movie Selection', formattedMovies }); // Pass an empty list of movies initially
});

// Define a function to get movie services from TMDB API when searched in a tailwind search bar
const getMovies = async (search) => {
    try {
      const apiKey = '6c6dc6f91161b15e53ed5de0ceb38bfa';
        // Define the URL for the TMDB API request
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false&language=en-US&page=1&api_key=${apiKey}`);
        
        const data = await response.json();
        const movies = data.movies;
        
        const formattedMovies = [];
      
        for (let i = 0; i < movies.length; i++) {
          const movie = movies.movie[i];
          const title = movie.title;
          formattedMovies.push({ title });
        }
        return formattedMovies;
    } catch (error) {
        console.error('Error fetching movie data:', error);
        throw error;
    }
};

// // Function to display movies on the page
// const displayMovies = async (req, res, searchQuery) => {
//   try {
//       // Call the getMovies function to fetch movie suggestions
//       const formattedMovies = await getMovies(searchQuery);

//       // Render the movieSelect page with the search results
//       res.render('movieSelect', {
//           title: 'Movie Selection',
//           formattedMovies,
//       });
//   } catch (error) {
//       console.error('Error handling movie search:', error);
//       res.status(500).send('Internal Server Error');
//   }
// };

// // Handle the movie search form submission
// router.post('/movieselect', async (req, res) => {
//   try {
//       const { searchQuery } = req.body; // Assuming the form field is named "searchQuery"

//       if (!searchQuery) {
//           // Handle the case where no search query is provided
//           res.render('movieSelect', {
//               title: 'Movie Selection',
//               formattedMovies: [], // Empty movie list
//           });
//           return;
//       }

//       // Call the displayMovies function to display movies based on the search query
//       await displayMovies(req, res, searchQuery);
//   } catch (error) {
//       console.error('Error handling movie search:', error);
//       res.status(500).send('Internal Server Error');
//   }
// });

module.exports = router;