import Hyperate from "./utilities/sockets/Hyperate";
import Lanyard from "./utilities/sockets/Lanyard";

import { PurgeCSS } from "purgecss";

const development = process.env.NODE_ENV === "development";

const build = async () => {
	await Bun.build({
		entrypoints: ["./src/front/index.html"],
		outdir: "./dist",
		splitting: true,
		env: "inline",
		sourcemap: "linked",
		minify: true,
		publicPath: "/assets/",
	});

	const result = await new PurgeCSS().purge({
		content: ["dist/*.html", "dist/*.js"],
		css: ["dist/*.css"],
	});

	for (const file of result) {
		await Bun.write(file.file || "", file.css);
	}
};

const respOptions = {
	headers: {
		"Content-Type": "application/json",
		"Cache-Control": "no-cache",
		"Content-Encoding": "gzip",
	},
};
const okResp = new Response(
	Bun.gzipSync(JSON.stringify({ data: "ok" })),
	respOptions,
);
const Responses = {
	ok: () => {
		return okResp.clone();
	},
	json: (data: { [key: string]: string }) => {
		return new Response(Bun.gzipSync(JSON.stringify(data)), respOptions);
	},
	file: async (file: Bun.BunFile) => {
		return new Response(Bun.gzipSync(await file.arrayBuffer()), {
			headers: {
				"Content-Type": file.type,
				"Cache-Control": "public, max-age=31536000",
				"Content-Encoding": "gzip",
			},
		});
	},
};

const postAnalytics = async (
	req: Request | Bun.BunRequest,
	_server: Bun.Server,
) => {
	const cfIp = req.headers.get("CF-Connecting-IP");
	//const realIp = req.headers.get("X-Real-IP");
	const forwardedIp = req.headers.get("X-Forwarded-For");
	//const serverIp = server.requestIP(req)?.address;

	return await fetch("https://plausible.creations.works/api/event", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"User-Agent": req.headers.get("user-agent") || "",
			"X-Forwarded-For": String(cfIp || forwardedIp?.split(",")[0]),
		},
		body: JSON.stringify({
			domain: "ipv4.army",
			name: "pageview",
			url: req.url,
			referrer: req.headers.get("referer") || "",
		}),
	});
};

export default {
	Sockets: {
		Hyperate,
		Lanyard,
	},
	Responses,
	build,
	development,
	postAnalytics,
};
