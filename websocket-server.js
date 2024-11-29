const { Server } = require("socket.io");
const http = require("http");
const pool = require("./src/server/pool.js");

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
    socket.to(messageData.room_id).emit("newMessage", messageData);
  });

  socket.on("messageRead", async ({ chatRoomId, messageIds }) => {
    try {
        await pool.query(
            `UPDATE chat_message SET is_read = TRUE WHERE id = ANY($1::int[]) AND room_id = $2`,
            [messageIds, chatRoomId]
        );

        socket.to(chatRoomId).emit("messageRead", { messageIds });
    } catch (error) {
        console.error("Error updating message read status:", error);
    }
});

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`WebSocket server running on port ${PORT}`);
});