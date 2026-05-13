import { lanyardData } from "./socket/lanyard";
import { badge } from "./util/badge";
import { compress } from "./util/compress";
import App from "./web/index.html";

export const server = Bun.serve({
	routes: {
		"/": App,
		"/api/ws": (req, server) => {
			server.upgrade(req);
			return new Response(null, { status: 101 });
		},
		"/api/badge/:type": async (req) => {
			return await badge(req);
		},
	},
	fetch: async (req) => {
		const url = new URL(req.url);
		const { pathname } = url;
		const publicFile = Bun.file(`./src/public${pathname}`);

		if (await publicFile.exists()) {
			return compress(req, publicFile);
		}

		return new Response("Not Found", { status: 404 });
	},

	websocket: {
		idleTimeout: 960,

		open: async (ws) => {
			ws.subscribe("lanyard");

			ws.send(
				JSON.stringify({
					type: "lanyard",
					data: lanyardData,
				}),
				true,
			);
		},

		message: async (ws, message) => {
			try {
				const msg = JSON.parse(message as string) as {
					type: string;
					data: string;
				};
				const { type } = msg;

				switch (type) {
					case "ping":
						{
							ws.send(JSON.stringify({ type: "pong", data: "" }), true);
						}
						break;
					default:
						{
						}
						break;
				}
			} catch (_e) {
				// ignore
			}
		},
	},

	development: process.env.NODE_ENV !== "production" && {
		// Enable browser hot reloading in development
		hmr: true,

		// Echo console logs from the browser to the server
		console: true,
	},
});
