import { io } from "socket.io-client";

const socket = (user) =>
	new io("https://whatsapp-clone-server.fly.dev", {
		autoConnect: false,
		withCredentials: true,
		auth: {
			token: user.token,
		},
	});

export default socket;
