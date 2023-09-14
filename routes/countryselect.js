const express = require('express');
const router = express.Router();

router.get('/countryselect', async function(req, res, next) { // Note the 'async' keyword
    try {
        const apiKey = '6c6dc6f91161b15e53ed5de0ceb38bfa';
      
      const response = await fetch(`https://api.themoviedb.org/3/watch/providers/regions?language=en-US&api_key=${apiKey}`);
      const data = await response.json();
      
      const countries = data.results;
      
    
  
      // Render the countryselect page with the list of countries
      res.render('countryselect', { title: 'Country Select', countries });
    } catch (error) {
      console.error('Error fetching countries:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  module.exports = router;