const express = require("express");
const helmet = require("helmet");
const { Server } = require("socket.io");
const cors =require("cors");
const authRouter = require("./routers/authRouter")
const session = require("express-session")
require("dotenv").config()
const Redis = require("ioredis");
const RedisStore = require("connect-redis").default;

const app = express();

const server = require("http").createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

let redisClient = new Redis()


app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(session({
  secret: process.env.COOKIE_SECRET,
  credentials: true,
  name: "sid",
  store: new RedisStore({client:redisClient, prefix:"myapp:"}),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.ENVIRONMENT === "production" ? "true" : "auto",
    httpOnly: true,
    expires: 1000*60*60*24*7,
    sameSite: process.env.ENVIRONMENT === "production" ? "none": "lax",
  }
}))

app.use("/auth",authRouter);

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

io.on("connect", (socket) => {});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
