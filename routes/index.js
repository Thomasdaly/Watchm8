var express = require('express');
var router = express.Router();

//middleware
function isAuthenticated (req, res, next) {
  if (req.session.user) next()
  else next('route')
}

/* GET home page. */
router.get('/', isAuthenticated, function(req, res, next) {
  res.render('index', { title: 'WatchM8' });
});

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

module.exports = router;
