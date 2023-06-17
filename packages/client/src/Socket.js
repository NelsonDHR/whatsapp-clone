import { io } from "socket.io-client";

const socket = (user) =>
	/* `${import.meta.env.VITE_SERVER_URL}` */
	new io("https://whatsapp-clone-server.fly.dev", {
		autoConnect: false,
		withCredentials: true,
		auth: {
			token: user.token,
		},
	});

export default socket;
