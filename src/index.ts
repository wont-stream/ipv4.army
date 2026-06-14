import { readdir } from "node:fs/promises";
import { type BunRequest, file, serve } from "bun";
import { compressResponse } from "./util/compress";
import index from "./web/index.html";
import { makeSVG } from "./util/heliopolis";

const serveIndex = async (req: BunRequest<"/">) => {
	return await compressResponse(req.headers, file("./src/web/index.html"));
};

const buttons = await readdir("./src/web/public/88x31");
const basePath = "./src/web";
const publicPath = `${basePath}/public`;

const server = serve({
	routes: {
		"/": process.env.NODE_ENV !== "production" ? index : serveIndex,

		"/favicon.ico": async (req) =>
			await compressResponse(req.headers, file(`${publicPath}/favicon.ico`)),
		"/robots.txt": async (req) =>
			await compressResponse(req.headers, file(`${publicPath}/robots.txt`)),
		"/public/button.png": async () => {
			const fileName =
				buttons[Math.floor(Math.random() * buttons.length)] || "tejo.png";
			return new Response(Bun.file(`${publicPath}/88x31/${fileName}`));
		},
		"/public/*": async (req) => {
			const { url } = req;
			const { pathname } = new URL(url);

			const res = Bun.file(`${basePath}${pathname}`);

			if (await res.exists()) {
				return await compressResponse(req.headers, res);
			}

			return new Response(null, { status: 404 });
		},
		"/api/heliopolis/langs": async () => { return new Response(await makeSVG(), { headers: { "Content-Type": "image/svg+xml" } }) },
		"/*": Response.redirect("/"),
	},

	development: process.env.NODE_ENV !== "production" && {
		hmr: true,
		console: true,
	},
});

console.log(`🚀 Server running at ${server.url}`);
