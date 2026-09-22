import { type Format, makeBadge } from "badge-maker";
import { serve } from "bun";
import { BunCache } from "bun-cache";
import { materialDynamicColors, toCss } from "./util/mdc";
import index from "./web/index.html";

const cache = {
	badge: new BunCache(),
	color: new BunCache(),
};

const server = serve({
	routes: {
		"/": index,

		"/api/color": async (req) => {
			const { searchParams } = new URL(req.url);
			const key = Bun.hash.rapidhash(searchParams.toString()).toString();

			let res = "";

			try {
				if (cache.color.hasKey(key)) {
					res = cache.color.get(key) as string;
				} else {
					const src = searchParams.get("src") || undefined;
					const color = searchParams.get("color") || undefined;

					const colors = await materialDynamicColors({ src, color });
					res = toCss(colors);
					cache.color.put(key, res, 60_000);
				}

				return new Response(res, {
					headers: {
						"Cache-Control": "public, max-age=31536000, immutable",
						"content-type": "text/plain",
						Vary: "Accept-Encoding",
					},
				});
			} catch (e) {
				return new Response(e as string);
			}
		},

		"/api/badge": async (req) => {
			const { searchParams } = new URL(req.url);
			const key = Bun.hash.rapidhash(searchParams.toString()).toString();

			let res = "";

			try {
				if (cache.badge.hasKey(key)) {
					res = cache.badge.get(key) as string;
				} else {
					res = makeBadge(searchParams.toJSON() as unknown as Format);
					cache.color.put(key, res, 60_000);
				}

				return new Response(res, {
					headers: {
						"Cache-Control": "public, max-age=31536000, immutable",
						"content-type": "image/svg+xml",
						Vary: "Accept-Encoding",
					},
				});
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
		return Response.redirect("/", 307);
	},

	development: process.env.NODE_ENV !== "production" && {
		hmr: true,
		console: true,
	},
});

console.log(`🚀 Server running at ${server.url}`);

// just in case..
setInterval(Bun.gc, 60_000);
