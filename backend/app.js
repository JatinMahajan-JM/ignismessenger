const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const path = require("path");

dotenv.config();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use((req, res, next) => {
  next(new Error("Url not found"));
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(path.resolve(), "/frontend/build")));
  app.get("*", (req, res, next) => {
    res.sendFile(path.join(path.resolve(), "/frontend/build/index.html"));
  });
}

app.use((err, req, res, next) => {
  const { statusCode, message } = err;
  // console.log(message);
  res.status(statusCode ?? 400).json({ message });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.9s9ex2a.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`
  )
  .then(() => {
    const server = app.listen(process.env.PORT || 8080);
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      socket.on("setup", (userData) => {
        socket.join(userData.email);
        socket.emit("connected");
      });

      socket.on("join chat", (room) => {
        socket.join(room);
      });

      socket.on("new message", (message) => {
        const chat = message.chat;
        if (!chat.users) return;
        chat.users.forEach((user) => {
          if (user._id === message.sender._id) return;
          socket.in(user.email).emit("messageR", message);
        });
      });
    });
  });
