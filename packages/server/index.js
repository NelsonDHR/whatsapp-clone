const helmet = require("helmet");
const cors = require("cors");

const { Server } = require("socket.io");
const express = require("express");
require("dotenv").config();
const authRouter = require("./routers/authRouter");
const { sessionMiddleware,wrap,corsConfig} = require("./controllers/serverController");
const { authorizeUser } = require("./controllers/socketController");

const app = express();
const server = require("http").createServer(app);

const io = new Server(server, {
				cors: corsConfig,
		  });

app.use(helmet());
app.use(
	cors(corsConfig)
);

app.use(express.json());
app.use(sessionMiddleware);

app.use("/auth", authRouter);

app.get("/", (req, res) => {
	res.json({ message: "Hello World" });
});

io.use(wrap(sessionMiddleware));
io.use(authorizeUser)

io.on("connect", (socket) => {
	// Aquí puedes escribir el código que necesites para manejar la conexión del socket
	console.log(socket.id)
	console.log(socket.request.session.user.username)
});
/* if (io) {
	io.on("connect", (socket) => {
		// Aquí puedes escribir el código que necesites para manejar la conexión del socket
		console.log(socket.request.sessionuser.username)
	});
} */

const serverInstance = server.listen(process.env.PORT || 3000, () => {
	console.log(`Server listening on port ${serverInstance.address().port}`);
});

module.exports = { app, serverInstance };
