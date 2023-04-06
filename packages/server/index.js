const express = require("express");
const helmet = require("helmet");
const { Server } = require("socket.io");

const app = express();

const server = require("http").createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

io.on("connect", (socket) => {});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
