import { serve } from "bun";
import index from "./app/index.html";

const server = serve({
	routes: {
		"/": index,

		// for stupidity
		"/public/*": async (req) => {
			const url = new URL(req.url);
			return Response.redirect(url.pathname.replace("/public", ""), 301);
		},
		"/*": { dir: "./public" },
	},

	fetch: async (_req, _server) => {
		return new Response("Not Found", { status: 404 });
	},

	development: process.env.NODE_ENV !== "production" && {
		hmr: true,
		console: true,
	},
});

console.log(`🚀 Server running at ${server.url}`);
