// require the routes file
const routes = require('express').Router();
// require the controller file
const myController = require('../controllers');

// get the root URL and call the name function from the controller
routes.get('/', myController.name);
routes.get('/yay', myController.returnAnotherName);
routes.get('/awesome', myController.returnYetAnotherName);

// export the routes
module.exports = routes;
