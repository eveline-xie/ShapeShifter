const express = require("express");

const app = express();
const cors = require("cors");
//const cookieParser = require('cookie-parser')
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const mongoose = require('mongoose')
const auth = require('./auth.js');

// Connect to MongoDB
const uri = 'mongodb+srv://x8ddeve:Ruby%402018t@shapeshifter.xevxwkk.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(uri, {useNewUrlParser: true})
const connection = mongoose.connection
connection.once('open', () => {
    console.log('Database connection established!');
    })

app.post('/auth/signup', (req, res) =>  {
    console.log("signup!!!");   
    console.log(req.body)
    auth.signup(req.body.firstName, req.body.lastName, req.body.username, req.body.email, req.body.password, res);
    
})

app.post('/auth/login', (req, res) => {
    console.log("login!");
    console.log(req.body)
    auth.login(req.body.email, req.body.password, req, res);
    
})

app.post('/auth/remember-password', (req, res) => {
    console.log("remember pass");
    console.log(req.body)

    auth.rememberPassword(req.body.email, req.body.username, req, res);
})

let server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

module.exports = server