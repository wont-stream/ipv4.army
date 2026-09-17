import { serve } from "bun";
import { materialDynamicColors, toCss } from "./util/mdc";
import index from "./web/index.html";

const server = serve({
	routes: {
		"/": index,

		"/api/color": async (req) => {
			const { searchParams } = new URL(req.url);

			const src = searchParams.get("src") || undefined;
			const color = searchParams.get("color") || undefined;

			const colors = await materialDynamicColors({ src, color });
			const css = toCss(colors);

			return new Response(css);
		},

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
