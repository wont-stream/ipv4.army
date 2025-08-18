import type { Types } from "@prequist/lanyard";

import { Glob } from "bun";
import { blogItems } from "./.vitepress/util";
import { badger } from "./src-back/badges";
import { Hyperate } from "./src-back/sockets/hyperate";

//import { Lanyard } from "./src-back/sockets/lanyard";

let heartrate = 0;
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

let newestBlogPostLink: string;

const glob = new Glob("**/**");

const routes: Record<string, () => Response> = {};

for (const file of glob.scanSync("./.vitepress/dist")) {
	routes[
		`/${file.replaceAll("\\", "/").replace("index.html", "").replace(".html", "")}`
	] = () => {
		Bun.gc(true);

		return new Response(Bun.file(`./.vitepress/dist/${file}`));
	};
}

const server = Bun.serve({
	routes: {
		...routes,

		"/blog": async () => {
			if (newestBlogPostLink) {
				return Response.redirect(newestBlogPostLink, 302);
			}

			const newestBlogPost = await getNewestBlogPost();
			newestBlogPostLink = newestBlogPost?.link || `/404`;

			return Response.redirect(newestBlogPostLink, 302);
		},

		"/api/ws": (req, server) => {
			Bun.gc(true);

			if (!server.upgrade(req, { data: { type: "websocket" } })) {
				return new Response("WebSocket upgrade failed", { status: 400 });
			}
		},

		"/badge/:type": async (req) => {
			Bun.gc(true);

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
				/*ws.send(
					JSON.stringify({
						type: "lanyard",
						data: lanyard,
					}),
					true,
				);*/
				return ws.subscribe("data");
			}

			ws.close(1011, "Invalid WebSocket type");

			Bun.gc(true);
		},

		message(ws) {
			ws.ping("ping");

			Bun.gc(true);
		},

		close(ws) {
			const data = ws.data as { type: "websocket" | "hot-reload" | null };

			if (data.type === "websocket") {
				return ws.unsubscribe("data");
			}

			Bun.gc(true);
		},

		idleTimeout: 960,
		perMessageDeflate: true,
	},
});

// Sockets
new Hyperate((data) => {
	/*if (lanyard?.discord_status === "offline") {
		heartrate = data;
	} else {
		heartrate = 0;
	}*/

	heartrate = data;

	server.publish(
		"data",
		JSON.stringify({ type: "hyperate", data: { hr: data } }),
		true,
	);
});

/*
new Lanyard((data) => {
	lanyard = data;
	server.publish("data", JSON.stringify({ type: "lanyard", data }), true);
});
*/
