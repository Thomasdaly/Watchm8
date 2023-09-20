const express = require('express');
const router = express.Router();
var session = require('express-session');

let countries = [];
let selectedCountry = null; // Use an array to store selected movies

router.get('/', async function (req, res, next) {
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

router.post('/', function (req, res, next) {
  try {
    const country = req.body.selectedCountry;
    selectedCountry = country;
    req.session.selectedCountry = selectedCountry;
    res.redirect('/serviceselect');
  } catch (error) {
    console.error('Error selecting country:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;