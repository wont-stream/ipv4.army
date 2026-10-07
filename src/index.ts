import { type Format, makeBadge } from "badge-maker";
import { serve } from "bun";
import { BunCache } from "bun-cache";
import { materialDynamicColors, toCss } from "./util/mdc";
import index from "./web/index.html";

const cache = {
	placeholder: new BunCache(),
	color: new BunCache(),
};

const headers = {
	"Cache-Control": "public, max-age=31536000, immutable",
	Vary: "Accept-Encoding",
};

const allowedHosts = [
	"localhost",
	"ipv4.army",
	"heliopolis.live",
	"github.com",
	"i.scdn.co",
];

const allowedOrigins = [null, "https://ipv4.army"];

const checkURL = (url: string) => {
	const { hostname, pathname } = new URL(url);

	if (hostname === "i.scdn.co") {
		return true;
	}

	return allowedHosts.includes(hostname) && pathname.split("/").length === 2;
};

const middleware = (req: Bun.BunRequest<"/*">) => {
	if (!allowedOrigins.includes(req.headers.get("origin"))) {
		return new Response("Unauthorized", { status: 403 });
	}
}

const getParams = (req: Bun.BunRequest<"/*">, params: string[]) => {
	const { searchParams } = new URL(req.url);

	return params.reduce((acc, param) => {
		acc[param] = searchParams.get(param) || undefined;
		return acc;
	}, {} as Record<string, string | undefined>);
}

const server = serve({
	routes: {
		"/": index,

		"/api/color": async (req) => {
			const middlewareResult = middleware(req);
			if (middlewareResult) return middlewareResult;

			const { src, color } = getParams(req, ["src", "color"]);

			const value = src ?? color;

			if (!value) return new Response("Missing src or color parameter", { status: 400 });

			if (src && !checkURL(src)) return new Response("Unauthorized", { status: 403 });
			
			const key = Bun.hash.rapidhash(value).toString();
			let res = cache.color.get(key) as string | null;

			if (!res) {
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
					...headers,
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
						...headers,
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
