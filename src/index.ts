import { type Format, makeBadge } from "badge-maker";
import { serve } from "bun";
import { BunCache } from "bun-cache";
import { materialDynamicColors, toCss } from "./util/mdc";
import index from "./web/index.html";

const cache = {
	badge: new BunCache(),
	color: new BunCache(),
};

const headers = {
	"Cache-Control": "public, max-age=31536000, immutable",
	Vary: "Accept-Encoding",
};

const server = serve({
	routes: {
		"/": index,

		"/api/color": async (req) => {
			const { search, searchParams } = new URL(req.url);
			const key = Bun.hash.rapidhash(search).toString();

			let res = cache.color.get(key) as string | null;

			if (!res) {
				const src = searchParams.get("src") || undefined;
				const color = searchParams.get("color") || undefined;

				const colors = await materialDynamicColors({ src, color });
				res = toCss(colors);
				cache.color.put(key, res, 60_000);
			}

			return new Response(res, {
				headers: {
					...headers,
					"Content-Type": "text/plain",
				},
			});
		},

		"/api/badge": async (req) => {
			const { search, searchParams } = new URL(req.url);
			const key = Bun.hash.rapidhash(search).toString();

			let res = cache.color.get(key) as string | null;

			if (!res) {
				res = makeBadge(searchParams.toJSON() as unknown as Format);
				cache.color.put(key, res, 60_000);
			}

			return new Response(res, {
				headers: {
					...headers,
					"Content-Type": "image/svg+xml",
				},
			});
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
