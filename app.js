const express = require('express');
const app = express();
const path = require('path'); // Import the 'path' module

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Specify the views directory (assuming it's in a "views" folder)
app.set('views', path.join(__dirname, 'views'));

// Define a route to render the index.ejs file
app.get('/', (req, res) => {
    res.render('index'); // Renders views/index.ejs
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});