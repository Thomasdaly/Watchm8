var express = require('express');
var router = express.Router();

router.get('/', async function (req, res, next) {
  try {
    // Ensure a selected country is available in the session
    if (!req.session.selectedCountry) {
      res.status(400).send('Please select a country first.');
      return;
    }

    const apiKey = '6c6dc6f91161b15e53ed5de0ceb38bfa'; // Use environment variables for API key
    const countryCode = req.session.selectedCountry;
    const response = await fetch(`https://api.themoviedb.org/3/watch/providers/movie?language=en-US&watch_region=${countryCode}&api_key=${apiKey}`);
    const data = await response.json();

    const streamingServices = data.results;
    // Filter streaming services based on the display priority for the target country
    const filteredStreamingServices = streamingServices.filter((service) => {
      const displayPriorities = service.display_priorities;

      // Check if the target country code is in the display priorities and has a priority greater than 0
      return displayPriorities.hasOwnProperty(countryCode) && displayPriorities[countryCode] > 0;
    });

    res.render('serviceselect', { title: `Service Select: ${req.session.selectedCountry}`, filteredStreamingServices });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).send('Internal Server Error');
  }
});
// Example route for handling form submission
router.post('/', (req, res) => {
  const selectedServices = req.body.selectedServices;
  req.session.selectedServices = selectedServices;
  console.log(`Selected services: ${selectedServices}`);
  res.redirect('/movieselect');
});

module.exports = router;