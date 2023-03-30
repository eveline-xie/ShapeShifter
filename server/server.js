const express = require("express");

const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser')
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const mongoose = require('mongoose')

// Connect to MongoDB
const uri = 'mongodb+srv://x8ddeve:Ruby%402018t@shapeshifter.xevxwkk.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(uri, {useNewUrlParser: true})
const connection = mongoose.connection
connection.once('open', () => {
    console.log('Database connection established!');
})

 
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});