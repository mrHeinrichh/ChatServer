const express = require('express');
var http = require('http');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
var server = http.createServer(app);
var io = require('socket.io')(server, {
  cors: {
    origin: '*',  // Allow all origins
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(express.json());

io.on("connection", (socket) => {
  console.log("connected", socket.id);

  // Register the user by their userId (they should emit this when connecting)
  socket.on("register", (userId) => {
      socket.join(`user_${userId}`);
      console.log(`${userId} joined room user_${userId}`);
  });

  // Listen for messages and forward to the target user
  socket.on("message", (msg) => {
      console.log("Received message: ", msg);

      // Emit the message to the target user (joining the 'user_targetId' room)
      io.to(`user_${msg.targetId}`).emit("message", msg);
      console.log(`Message sent to user_${msg.targetId}`);

      // Only send the message to the source user if sourceId is different from targetId
      if (msg.sourceId !== msg.targetId) {
        io.to(`user_${msg.sourceId}`).emit("message", msg);
        console.log(`Message sent to user_${msg.sourceId}`);
      }
  });

  socket.on("disconnect", () => {
      console.log("User disconnected");
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
