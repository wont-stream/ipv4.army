await Bun.$`bun docs:build`;
console.log("\n");

import type { Types } from "@prequist/lanyard";

import { Glob } from "bun";
import { blogItems } from "./.vitepress/util";
import { badger } from "./src-back/badges";
import { Hyperate } from "./src-back/hyperate";
import { Lanyard } from "./src-back/lanyard";

let heartrate: number;
let lanyard: Types.Presence;

const getNewestBlogPost = async () => {
	const posts = blogItems.flatMap((year) =>
		year.items.flatMap((month) => {
			if (month.items) {
				return month.items.flatMap((day) => day.items);
			}
			return [];
		}),
	);
	return posts[posts.length - 1];
};

const newestBlogPost = await getNewestBlogPost();
const newestBlogPostLink = newestBlogPost?.link || `/404`;

const glob = new Glob("**/**");

const routes: Record<string, () => Response> = {};

for await (const file of glob.scan("./.vitepress/dist")) {
	routes[
		`/${file.replaceAll("\\", "/").replace("index.html", "").replace(".html", "")}`
	] = () => {
		return new Response(Bun.file(`./.vitepress/dist/${file}`));
	};
}

const server = Bun.serve({
	routes: {
		...routes,

		"/blog": Response.redirect(newestBlogPostLink, 302),

		"/api/ws": (req, server) => {
			if (!server.upgrade(req, { data: { type: "websocket" } })) {
				return new Response("WebSocket upgrade failed", { status: 400 });
			}
		},

		"/badge/:type": async (req) => {
			return new Response(
				await badger({ type: req.params.type, heartrate, lanyard }),
				{
					headers: {
						"Content-Type": "image/svg+xml",
						"Cache-Control": "no-cache, no-store, must-revalidate",
						Pragma: "no-cache",
						Expires: "0",
					},
				},
			);
		},

		"/watch": Response.redirect("https://stream.atums.world/watch/seth", 301),

		"/*": Response.redirect("/404", 307),
	},

	websocket: {
		open(ws) {
			const data = ws.data as { type: "websocket" | "hot-reload" | null };

			if (data.type === "websocket") {
				ws.send(
					JSON.stringify({
						type: "heartrate",
						data: { hr: heartrate },
					}),
					true,
				);
				ws.send(
					JSON.stringify({
						type: "lanyard",
						data: lanyard,
					}),
					true,
				);
				return ws.subscribe("data");
			}

			ws.close(1011, "Invalid WebSocket type");
		},

		message(ws) {
			ws.ping("ping");
		},

		close(ws) {
			const data = ws.data as { type: "websocket" | "hot-reload" | null };

			if (data.type === "websocket") {
				return ws.unsubscribe("data");
			}
		},

		idleTimeout: 960,
		perMessageDeflate: true,
	},
});

// Sockets
new Hyperate((data) => {
	heartrate = data;
	server.publish(
		"data",
		JSON.stringify({ type: "hyperate", data: { hr: data } }),
		true,
	);
});

new Lanyard((data) => {
	lanyard = data;
	server.publish("data", JSON.stringify({ type: "lanyard", data }), true);
});
