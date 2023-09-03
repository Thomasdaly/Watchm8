const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.set('view engine','ejs');
// Define a route for the root URL
app.get('/', (req, res) => {
  res.render('index');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});