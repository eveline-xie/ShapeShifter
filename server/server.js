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

app.post("/api/post", function(req, res) {
  const {text} = req.body;
  console.log(text);
  auth.signup(text, text,text, text, text );
})

// Connect to MongoDB
const uri = 'mongodb+srv://x8ddeve:Ruby%402018t@shapeshifter.xevxwkk.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(uri, {useNewUrlParser: true})
const connection = mongoose.connection
connection.once('open', () => {
    console.log('Database connection established!');
    
    auth.signup("test", "test","test", "test", "test" );
})

 
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
