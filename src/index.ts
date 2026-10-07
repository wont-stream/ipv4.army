import { type Format, makeBadge } from "badge-maker";
import { serve } from "bun";
import { cache } from "./data/cache";
import { defaultHeaders } from "./data/defaultHeaders";
import { checkURL } from "./util/checkURL";
import { getParams } from "./util/getParams";
import { materialDynamicColors } from "./util/mdc";
import { middleware } from "./util/middleware";
import index from "./web/index.html";

const server = serve({
	routes: {
		"/": index,

		"/api/color": async (req) => {
			const middlewareResult = middleware(req);
			if (middlewareResult) return middlewareResult;

			const { src, color } = getParams(req, ["src", "color"]);

			const value = src ?? color;

			if (!value)
				return new Response("Missing src or color parameter", { status: 400 });

			if (src && !checkURL(src))
				return new Response("Unauthorized", { status: 403 });

			const key = Bun.hash.rapidhash(value).toString();
			let res = cache.color.get(key) as string | null;

			if (!res) {
				res = await materialDynamicColors({ src, color });
				cache.color.put(key, res, 60_000);
			}

			return new Response(res, {
				headers: {
					...defaultHeaders,
					"Content-Type": "text/plain",
				},
			});
		},

		"/api/placeholder": async (req) => {
			const middlewareResult = middleware(req);
			if (middlewareResult) return middlewareResult;

			const { src } = getParams(req, ["src"]);

			if (!src) return new Response("Missing src parameter", { status: 400 });
			if (!checkURL(src)) {
				return new Response("Unauthorized", { status: 403 });
			}

			const key = Bun.hash.rapidhash(src).toString();
			let res = cache.placeholder.get(key) as string | null;

			if (!res) {
				const imageReq = await fetch(src);
				const image = new Bun.Image(await imageReq.arrayBuffer());

				res = await image.placeholder();
				cache.placeholder.put(key, res, 60_000);
			}

			return new Response(await (await fetch(res)).arrayBuffer(), {
				headers: {
					...defaultHeaders,
					"Content-Type": "image/png",
				},
			});
		},

		"/api/badge": async (req) => {
			const { searchParams } = new URL(req.url);

			return new Response(
				makeBadge(searchParams.toJSON() as unknown as Format),
				{
					headers: {
						...defaultHeaders,
						"Content-Type": "image/svg+xml",
					},
				},
			);
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
