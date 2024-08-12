const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE;


// connecting to the database.
mongoose.connect(DB)
    .then(() => {
        console.log("connection established");
    })
    .catch(err => console.log(err));


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});