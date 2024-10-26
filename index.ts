import { file, serve } from "bun";

import "./build.ts";

serve({
	async fetch(req, server) {
		const { pathname } = new URL(req.url);

		if (pathname === "/") {
			return new Response(await file("./dist/index.html").bytes(), {
				headers: {
					"Content-Type": "text/html; charset=utf-8",
				},
			});
		}

		return new Response("Not Found", { status: 404 });
	},

	error() {
		return new Response(null, { status: 500 });
	},
});
