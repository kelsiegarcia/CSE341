// use the express package/module to create a server -- need to require
const express = require('express');
// create an instance of the express server
const app = express();
// create a route to handle requests to the root URL
// app.get('/', (req, res) => {
//   res.send('Hello World');
// });

const port = process.env.PORT || 3000;
// require the routes file
app.use('/', require('./routes/index'));
// start the server on port 3000
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
