const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');


// EXPRESS ROUTERS
const notes = require('./routes/notes');


// MIDDLEWARES
// Middleware to parse incoming request bodies with JSON payloads
app.use(express.json());

// Use body-parser middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to handle file uploads
app.use(fileUpload({}));


// ROUTES
app.use('/api/v1/', notes);


module.exports = app;