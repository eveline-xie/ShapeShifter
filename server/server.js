const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');


require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    //origin: "http://localhost:3000",
    origin: "https://shapershifter.onrender.com",
    credentials: true,
  })
);

app.use(bodyParser.json({ limit: '100000000mb' }));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
const uri = process.env.MONGOCONNECT;
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Database connection established!");
});

// SETUP OUR OWN ROUTERS AS MIDDLEWARE
const shapeshifterRouter = require("./routes/shapeshifter-router");
console.log(shapeshifterRouter)
app.use("", shapeshifterRouter);


// app.post('/auth/signup', (req, res) =>  {
//     console.log("signup!!!");
//     console.log(req.body)
//     auth.signup(req.body.firstName, req.body.lastName, req.body.username, req.body.email, req.body.password, res);

// })

// app.post('/auth/login', (req, res) => {
//     console.log("login!");
//     console.log(req.body)
//     auth.login(req.body.email, req.body.password, req, res);

// })

// app.get('/auth/remember-password', (req, res) => {
//     console.log("remember pass");
//     const {email, username} = req.query;
//     auth.rememberPassword(email, username, req, res);
// })

// app.put('/auth/change-password', (req, res) => {
//     console.log("change pass");
//     let username = req.body.username;
//     let password = req.body.password;
//     let newPassword = req.body.newPassword;
//     auth.changePassword(username, password, newPassword, req, res);
// })

let server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

module.exports = server;
