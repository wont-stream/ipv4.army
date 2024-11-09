import { file, serve } from "bun";

import "./build.ts";

serve({
	async fetch(req, server) {
		const { pathname } = new URL(req.url);

		if (pathname === "/") {
			return new Response(await file("./dist/index.html"));
		}

		const possibleFile = file(`./dist${pathname}`)

		if (await possibleFile.exists()) {
			return new Response(possibleFile);
		}

		return new Response("Not Found", { status: 404 });
	},

	error() {
		return new Response(null, { status: 500 });
	},
});
