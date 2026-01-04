import { rm } from "node:fs/promises";
import build from "./build";
import { lanyardData } from "./socket/lanyard";

await rm("./dist", { recursive: true, force: true });
const built = await build();

const files = {
	js: built.outputs.filter((output) => output.path.endsWith(".js"))[0],
	css: built.outputs.filter((output) => output.path.endsWith(".css"))[0],
};

export const server = Bun.serve({
	fetch: async (req, server) => {
		const url = new URL(req.url);
		const { pathname, searchParams } = url;

		if (pathname === "/") {
			return new Response(Bun.file("./dist/index.html"));
		}

		switch (pathname) {
			case "/": {
				return new Response(Bun.file("./dist/index.html"));
			}
			case "/api/ws": {
				server.upgrade(req, {
					data: {
						isAdmin: searchParams.get("key") === Bun.env.apiKey,
					},
				});
				return new Response(null, { status: 101 });
			}
			default:
				{
				}
				break;
		}

		if (pathname.startsWith("/chunk")) {
			const type = pathname.split(".").pop();
			const file = files[type as "js" | "css"];

			if (!file) {
				return new Response("Not Found", { status: 404 });
			}

			const chunkFile = Bun.file(file.path);

			return new Response(chunkFile, {
				headers: {
					"cache-control": "public, max-age=31536000, immutable",
				},
			});
		} else {
			const publicFile = Bun.file(`./src/public${pathname}`);

			if (await publicFile.exists()) {
				return new Response(publicFile);
			}
		}

		return new Response("Not Found", { status: 404 });
	},
	websocket: {
		data: {} as { isAdmin: boolean },
		idleTimeout: 960,

		open: async (ws) => {
			ws.subscribe("lanyard");

			ws.send(
				JSON.stringify({
					type: "lanyard",
					data: lanyardData,
				}),
				true,
			);
		},

		message: async (ws, message) => {
			try {
				const msg = JSON.parse(message as string) as {
					type: string;
					data: string;
				};
				const { type } = msg;

				switch (type) {
					case "ping":
						{
							ws.send(JSON.stringify({ type: "pong", data: "" }), true);
						}
						break;
					default:
						{
						}
						break;
				}
			} catch (_e) {
				// ignore
			}
		},
	},
});
