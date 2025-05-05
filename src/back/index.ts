import Hyperate from "./Sockets/Hyperate";
import Lanyard from "./Sockets/Lanyard";

const development = process.env.NODE_ENV === "development";

const build = async () => {
	return await Bun.build({
		entrypoints: ["./src/front/index.html"],
		outdir: "./dist",
		minify: !development,
		sourcemap: development ? "inline" : "none",
		splitting: true,
		publicPath: "/assets/",
	});
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
	server: Bun.Server,
) => {
	return await fetch("https://plausible.creations.works/api/event", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"User-Agent": req.headers.get("user-agent") || "",
			"X-Forwarded-For": String(
				req.headers.get("CF-Connecting-IP") ||
					req.headers.get("X-Real-IP") ||
					req.headers.get("X-Forwarded-For")?.split(",")[0] ||
					(typeof server.requestIP(req) === "string"
						? server.requestIP(req)
						: server.requestIP(req)?.address || ""),
			),
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
