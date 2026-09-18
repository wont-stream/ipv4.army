import { type Format, makeBadge } from "badge-maker";
import { serve } from "bun";
import { materialDynamicColors, toCss } from "./util/mdc";
import index from "./web/index.html";

const server = serve({
	routes: {
		"/": index,

		"/api/color": async (req) => {
			try {
				const { searchParams } = new URL(req.url);

				const src = searchParams.get("src") || undefined;
				const color = searchParams.get("color") || undefined;

				const colors = await materialDynamicColors({ src, color });
				const css = toCss(colors);

				return new Response(css);
			} catch (e) {
				return new Response(e as string);
			}
		},

		"/api/badge": async (req) => {
			try {
				const { searchParams } = new URL(req.url);

				return new Response(
					makeBadge(searchParams.toJSON() as unknown as Format),
					{
						headers: {
							"Cache-Control": "public, max-age=31536000, immutable",
							"content-type": "image/svg+xml",
							Vary: "Accept-Encoding",
						},
					},
				);
			} catch (e) {
				return new Response(e as string);
			}
		},

		// for stupidity
		"/public/*": async (req) => {
			try {
				const url = new URL(req.url);
				return Response.redirect(url.pathname.replace("/public", ""), 301);
			} catch (e) {
				return new Response(e as string);
			}
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

// just in case..
setInterval(Bun.gc, 60_000);
