const express = require("express");
const app = express();
const cors = require('cors');
const colors = require("colors");
const dbConnect = require("./db.js");
require("dotenv").config();
const { errorHandler, routeNotFound } = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const { instrument } = require("@socket.io/admin-ui");




// connecting database 
dbConnect(process.env.DB_USERNAME,process.env.DB_PASSWORD);

app.use(express.json());
app.use(cors())
// Main routes
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notification", notificationRoutes);


// -----------------------------------------------------------------------------

  app.get("/", (req, res) => {
    res.status(200).json({
      message: "Hello from simplechat App server",
    });
  });


// -----------------------------------------------------------------------------

// Error handling routes
app.use(routeNotFound);
app.use(errorHandler);

const server = require("http").createServer(app);

// donot listen on app  listen on server where io is injected (not on main server)
 server.listen(process.env.PORT || 5000, () => {
  console.log(
    colors.brightMagenta(`\nServer is UP on PORT ${process.env.PORT || 5000}`)
  );
});

// require server and make io 
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    // origin: "*",  //allow from anywhere
    origin: ["https://admin.socket.io", "http://localhost:3000", "https://simplechat-06cd.onrender.com"], 
      credentials: true
  },
});

// io.emit() is for broadcasting purpose including sender
// socket.broadcast.emit() for broadcast exclude sender


io.on("connection", (socket) => {
  console.log("Sockets are in action");

  //listening a custom event 
  socket.on("setup", (userData) => {
    // You can call join to subscribe the socket to a given channel
    // And then simply use to or in (they are the same) when broadcasting or emitting

    socket.join(userData._id);
    console.log(userData.name, "connected");
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);  //reciecer ke id se room bna
    console.log("User joined room: " + room);
  });
  socket.on("new message", (newMessage) => {
    var chat = newMessage.chatId;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;
      socket.in(user._id).emit("message received", newMessage);
    });
    socket.on("typing", (room) => {
      socket.in(room).emit("typing");  // server pr 'emit' kiya to client pr 'on' krege 
    });
    socket.on("stop typing", (room) => {
      socket.in(room).emit("stop typing");
    });
  });
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

// -----------------------------------------------------------------------------
// for socket admin ui 

// instrument(io, {
//   auth: {
//     type: "basic",
//   username: process.env.SOCKET_USERNAME,
//   password: process.env.SOCKET_PASSWORD
// },
//   mode: "development",
// });

// instrument(io, {
//   auth: false,
//   mode: "development",
// });
