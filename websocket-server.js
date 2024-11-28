const { Server } = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 4000;

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("joinRoom", (room_id) => {
    socket.join(room_id);
    console.log(`Joined chat room: ${room_id}`);
  });

  socket.on("sendMessage", (messageData) => {
    console.log("Sending message to room:", {
      room_id: messageData.room_id,
      message: messageData.message
    });

    io.to(messageData.room_id).emit("receiveMessage", messageData);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`WebSocket server running on port ${PORT}`);
});