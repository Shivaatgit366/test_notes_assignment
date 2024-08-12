const express = require('express');
const app = express();

// EXPRESS ROUTERS
const notes = require('./routes/notes');


// MIDDLEWARES
// middleware to provide the "request data" in json format.
app.use(express.json());


// ROUTES
app.use('/api/v1/', notes);


module.exports = app;