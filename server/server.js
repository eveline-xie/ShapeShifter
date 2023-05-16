const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

const http = require('http');
const server = http.createServer(app);

const socketFunctions = require('./socket_functions/socket_functions');

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    // origin: "https://shapershifter.onrender.com",
    origin: "http://localhost:3000",
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
console.log(shapeshifterRouter);
app.use("", shapeshifterRouter);

const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.emit('connection', 'Connection Established');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
  socket.on("add-polygon", async (id, feature) => {
    let map = await socketFunctions.addPolygonToMap(id, feature);
    io.emit("add-polygon-response", id, map);
  });
  socket.on("update-polygon", async (id, prevPolygon, updatedPolygon) => {
    let map = await socketFunctions.updatePolygonOfMap(id, prevPolygon, updatedPolygon);
    io.emit("update-polygon-response", id, map);
  });
  socket.on("delete-polygon", async (id, feature) => {
    let map = await socketFunctions.deletePolygonOfMap(id, feature);
    io.emit("delete-polygon-response", id, map);
  });
  socket.on("merge-polygons", async (id, polygonsToMerge, mergedPolygon) => {
    let map = await socketFunctions.mergePolygonsOfMap(id, polygonsToMerge, mergedPolygon);
    io.emit("merge-polygons-response", id, map);
  });
  socket.on("undo-merge-polygons", async (id, polygonsToMerge, mergedPolygon) => {
    let map = await socketFunctions.undoMergePolygonsOfMap(id, polygonsToMerge, mergedPolygon);
    io.emit("undo-merge-polygons-response", id, map);
  });
  socket.on("compress-map", async (id, newMap, newCompressionLevel) => {
    let map = await socketFunctions.compressMap(id, newMap, newCompressionLevel);
    io.emit("compress-map-response", id, map);
  });
});
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

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

module.exports = server;
