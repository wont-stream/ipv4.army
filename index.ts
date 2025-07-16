// Natives
import fs from "node:fs/promises";

// Externals
import Handlebars from "handlebars";

// Internals
import Hyperate from "./src/backend/sockets/hyperate";
import Lanyard from "./src/backend/sockets/lanyard";
import * as response from "./src/backend/utilities/resp";

// Bun build plugins
import { htmlMinifier } from "./src/plugins/html";

// Clean up dist folder
await fs.rm("./dist", { recursive: true, force: true }).catch(() => {});

// Build
const build = await Bun.build({
	entrypoints: [
		"./src/frontend/head.handlebars",
		"./src/frontend/index.handlebars",
		"./src/frontend/404.handlebars",
		"./src/frontend/index.css",
	],
	outdir: "./dist",

	plugins: [htmlMinifier],

	minify: true,
	loader: {
		".handlebars": "html",
	},
});
console.log(build.success ? "Build successful!" : "Build failed!", build.logs);
await fs.cp("./src/frontend/robots.txt", "./dist/robots.txt", { force: true });

// Variables
let heartrate = 0;
let lanyard: LanyardData = {
	discord_status: "online",
	activities: [],
};
const css = await Bun.file("./dist/index.css").text();

// Files
import notfound from "./dist/404.js";
import head from "./dist/head.js";
import index from "./dist/index.js";

// Templates
const template = {
	head: Handlebars.compile(head),
	index: Handlebars.compile(index),
	notfound: Handlebars.compile(notfound),
};

// Partials
const updatePartials = () => {
	Handlebars.registerPartial(
		"head",
		template.head({
			lanyard,
			css,
		}),
	);
};

const server = Bun.serve({
	hostname: process.env.HOSTNAME || "localhost",

	routes: {
		"/": async (req, _server) => {
			updatePartials();

			return await response.text(
				req,
				template.index({
					lanyard,
					heartrate,
				}),
				{
					contentType: "text/html",
				},
			);
		},

		"/api/ws": async (req, server) => {
			if (!server.upgrade(req)) {
				return Response.redirect("/404", 301);
			}
		},

		"/*": async (req, _server) => {
			const file = Bun.file(`./dist${new URL(req.url).pathname}`);

			if (!(await file.exists())) {
				updatePartials();

				return await response.text(req, template.notfound({}), {
					contentType: "text/html",
					status: 404,
				});
			}

			return await response.file(req, file);
		},
	},

	websocket: {
		idleTimeout: 120,
		perMessageDeflate: true,
		open: (ws) => {
			ws.subscribe("hyperate");
			ws.subscribe("lanyard");
			ws.send(
				JSON.stringify({ type: "hyperate", data: { hr: heartrate } }),
				true,
			);
			ws.send(JSON.stringify({ type: "lanyard", data: lanyard }), true);
		},
		message: (ws, msg: string) => {
			switch (msg) {
				case "ping":
					ws.send("pong", true);
					break;

				case "pong":
					ws.send("ping", true);
					break;
				default:
					break;
			}

			return;
		},
		close: (ws) => {
			ws.unsubscribe("hyperate");
			ws.unsubscribe("lanyard");
		},
	},
});

// Sockets
new Hyperate((data) => {
	heartrate = data;
	server.publish(
		"hyperate",
		JSON.stringify({ type: "hyperate", data: { hr: data } }),
		true,
	);
});

new Lanyard((data) => {
	lanyard = data;
	server.publish("lanyard", JSON.stringify({ type: "lanyard", data }), true);
});
