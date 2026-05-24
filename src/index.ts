import { type BunRequest, file, serve } from "bun";
import { compressResponse } from "./util/compress";
import index from "./web/index.html";

const serveIndex = async (req: BunRequest<"/">) => {
	return await compressResponse(req.headers, file("./src/web/index.min.html"));
};

const server = serve({
	routes: {
		"/": process.env.NODE_ENV !== "production" ? index : serveIndex,

		"/favicon.ico": async (req) =>
			await compressResponse(req.headers, file("./src/web/public/favicon.ico")),
		"/robots.txt": async (req) =>
			await compressResponse(req.headers, file("./src/web/public/robots.txt")),
		"/public/*": async (req) => {
			const { url } = req;
			const { pathname } = new URL(url);

			const res = Bun.file(`./src/web${pathname}`);

			if (await res.exists()) {
				return await compressResponse(req.headers, res);
			}

			return new Response(null, { status: 404 });
		},

		"/*": Response.redirect("/"),
	},

	port: 80,
	development: process.env.NODE_ENV !== "production" && {
		hmr: true,
		console: true,
	},
});

console.log(`🚀 Server running at ${server.url}`);
