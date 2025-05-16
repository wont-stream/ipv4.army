import fs from "node:fs/promises";
import { file, gc, serve } from "bun";
import pkg from "../package.json";
import Backend from "./back";

let heartrate = 0;
let lanyard: LanyardData = {
	discord_status: "online",
	activities: [],
};

await fs.rm("./dist", { recursive: true, force: true }).catch(() => {});

if (!Backend.development) {
	await Backend.build();
}

const server = serve({
	port: process.env.PORT || 3000,
	hostname: process.env.HOSTNAME || "localhost",
	development: Backend.development,

	routes: {
		"/": async (req, server) => {
			await Backend.postAnalytics(req, server);
			if (Backend.development) await Backend.build();
			return Backend.Responses.file(file("./dist/index.html"));
		},

		"/assets/:file": async (req) =>
			Backend.Responses.file(file(`./dist/${req.params.file}`)),

		"/robots.txt": async () =>
			Backend.Responses.file(file("./public/robots.txt")),
		"/favicon.svg": async () =>
			Backend.Responses.file(file("./public/favicon.svg")),

		"/api/server": () => {
			const safeProcess = JSON.parse(JSON.stringify(process));
			safeProcess.env = {};
			safeProcess.availableMemory = process.availableMemory();
			safeProcess.constrainedMemory = process.constrainedMemory();
			safeProcess.cpuUsage = process.cpuUsage();
			safeProcess.memoryUsage = process.memoryUsage();
			safeProcess.uptime = process.uptime();
			safeProcess.package = pkg;

			return Backend.Responses.json({ data: safeProcess });
		},

		"/api/health": () => Backend.Responses.ok(),

		"/api/ws": async (req, server) => {
			if (!server.upgrade(req)) {
				await Backend.postAnalytics(req, server);
				return Response.redirect("/");
			}
		},

		"/api/gc": async () => {
			gc(true);
			return Backend.Responses.ok();
		},

		"/api/headers": (req) => Backend.Responses.json(req.headers.toJSON()),
	},

	fetch: async (req, server) => {
		await Backend.postAnalytics(req, server);
		return Response.redirect("/");
	},

	websocket: {
		idleTimeout: 1,
		open: (ws) => {
			ws.subscribe("lanyard");
			ws.send(JSON.stringify({ type: "lanyard", data: lanyard }), true);

			ws.subscribe("hyperate");
			ws.send(
				JSON.stringify({ type: "hyperate", data: { hr: heartrate } }),
				true,
			);
		},
		message: (ws, msg) => {
			ws.send(JSON.stringify({ type: "echo", data: msg }), true);
		},
	},
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
