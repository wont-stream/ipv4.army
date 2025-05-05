import { file, gc, serve } from "bun";

import Backend from "./src/back";

import pkg from "./package.json";

let heartrate = 0;
let lanyard = {};

require("node:fs/promises")
	.rm("./dist", { recursive: true, force: true })
	.catch(() => {
		// ignore
	});

if (!Backend.development) {
	await Backend.build();
}

const server = serve({
	routes: {
		"/": async (req: Bun.BunRequest, server: Bun.Server) => {
			await Backend.postAnalytics(req, server);

			if (Backend.development) {
				await Backend.build();
			}

			return await Backend.Responses.file(file("./dist/index.html"));
		},

		"/assets/:file": async (req: Bun.BunRequest<"/assets/:file">) => {
			return await Backend.Responses.file(file(`./dist/${req.params.file}`));
		},

		"/public/:file": async (req: Bun.BunRequest<"/public/:file">) => {
			return await Backend.Responses.file(file(`./public/${req.params.file}`));
		},

		"/api/server": () => {
			const string = JSON.stringify(process);
			const data = JSON.parse(string);

			// clear possibly data that could be sensitive
			data.env = {};

			data.availableMemory = process.availableMemory();
			data.constrainedMemory = process.constrainedMemory();
			data.cpuUsage = process.cpuUsage();
			data.memoryUsage = process.memoryUsage();
			data.uptime = process.uptime();
			data.package = pkg;

			return Backend.Responses.json({ data });
		},
		"/api/health": () => {
			return Backend.Responses.ok();
		},
		"/api/ws": async (req, server) => {
			if (server.upgrade(req)) {
				return;
			}

			await Backend.postAnalytics(req, server);
			return Response.redirect("/");
		},
		"/api/gc": async () => {
			gc(true);

			return Backend.Responses.ok();
		},
		"/api/headers": async (req) => {
			return Backend.Responses.json({ ...req.headers.toJSON() });
		},
	},

	fetch: async (request, server) => {
		await Backend.postAnalytics(request, server);

		return Response.redirect("/");
	},

	websocket: {
		idleTimeout: 1,
		open: async (ws) => {
			ws.subscribe("lanyard");
			ws.send(JSON.stringify({ type: "lanyard", data: lanyard }), true);

			ws.subscribe("hyperate");
			ws.send(
				JSON.stringify({ type: "hyperate", data: { hr: heartrate } }),
				true,
			);
		},
		message: async (ws, message) => {
			ws.send(JSON.stringify({ type: "echo", data: message }), true);
		},
	},
	development: Backend.development,
	port: 2056,
});

new Backend.Sockets.Hyperate((data) => {
	heartrate = data;
	server.publish(
		"hyperate",
		JSON.stringify({ type: "hyperate", data: { hr: heartrate } }),
		true,
	);
});

new Backend.Sockets.Lanyard((data) => {
	lanyard = data;
	server.publish(
		"lanyard",
		JSON.stringify({ type: "lanyard", data: lanyard }),
		true,
	);
});
