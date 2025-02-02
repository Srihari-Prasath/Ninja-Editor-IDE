import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error:", err));

// User Schema
const UserSchema = new mongoose.Schema({
  socketId: String,
  userName: String,
  roomId: String,
});

const User = mongoose.model("User", UserSchema);

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  socket.on("join", async ({ roomId, userName }) => {
    try {
      // Remove existing user with the same socket ID
      await User.deleteOne({ socketId: socket.id });

      // Save user to DB
      await User.create({ socketId: socket.id, userName, roomId });

      // Fetch all users in the room
      const users = await User.find({ roomId }).select("userName");

      socket.join(roomId);
      io.to(roomId).emit("userJoined", users.map(user => user.userName));
    } catch (error) {
      console.error("Error joining room:", error);
    }
  });

  socket.on("codeChange", ({ roomId, code }) => {
    socket.to(roomId).emit("codeUpdate", code);
  });

  socket.on("leaveRoom", async () => {
    try {
      const user = await User.findOneAndDelete({ socketId: socket.id });
      if (user) {
        const users = await User.find({ roomId: user.roomId }).select("userName");
        io.to(user.roomId).emit("userJoined", users.map(u => u.userName));
      }
      socket.leave(user?.roomId || "");
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  });

  socket.on("disconnect", async () => {
    try {
      const user = await User.findOneAndDelete({ socketId: socket.id });
      if (user) {
        const users = await User.find({ roomId: user.roomId }).select("userName");
        io.to(user.roomId).emit("userJoined", users.map(u => u.userName));
      }
    } catch (error) {
      console.error("Error on disconnect:", error);
    }
    console.log("User Disconnected", socket.id);
  });
});

const port = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
