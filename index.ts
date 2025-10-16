import type { Types } from "@prequist/lanyard";

import { Glob } from "bun";
import { blogItems } from "./.vitepress/util";
import { badger } from "./src-back/badges";
import { heliopolis } from "./src-back/heliopolis";
import { Hyperate } from "./src-back/sockets/hyperate";
import { Lanyard } from "./src-back/sockets/lanyard";

let heartrate = 0;
let lanyard: Types.Presence = {
	spotify: null,
	kv: {},
	listening_to_spotify: false,
	discord_user: {
		username: "",
		public_flags: 0,
		id: "0",
		display_name: null,
		global_name: null,
		discriminator: "",
		bot: false,
		avatar_decoration_data: null,
		avatar: null,
	},
	discord_status: "offline",
	activities: [],
	active_on_discord_web: false,
	active_on_discord_mobile: false,
	active_on_discord_desktop: false,
	active_on_discord_embedded: false,
};

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
		return new Response(Bun.file(`./.vitepress/dist/${file}`));
	};
}

for (const file of glob.scanSync("./public")) {
	routes[`/${file.replaceAll("\\", "/")}`] = () => {
		return new Response(Bun.file(`./public/${file}`));
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
			if (!server.upgrade(req)) {
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

		"/heliopolis/:repo/:branch/*": async (req) => {
			const { repo, branch } = req.params;

			const url = new URL(req.url);
			const path = url.pathname
				.replace("/heliopolis", "")
				.replace(`/${repo}`, "")
				.replace(`/${branch}`, "");

			return await heliopolis(repo, branch, path);
		},

		"/*": Response.redirect("/404", 307),
	},

	websocket: {
		open(ws) {
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
		},

		message(ws, data) {
			try {
				const msg = JSON.parse(data.toString());
				if (msg.type === "ping") {
					ws.send(JSON.stringify({ type: "pong" }));
				}
			} catch {
				// Ignore JSON parse errors
			}
		},

		close(ws) {
			return ws.unsubscribe("data");
		},
		idleTimeout: 960,
		perMessageDeflate: true,
	},
});

if (process.env.HYPERATE_TOKEN && process.env.HYPERATE_ID) {
	new Hyperate((data) => {
		if (lanyard?.discord_status === "offline") {
			heartrate = data;
		} else {
			heartrate = 0;
		}

		heartrate = data;

		server.publish(
			"data",
			JSON.stringify({ type: "hyperate", data: { hr: data } }),
			true,
		);
	});
}

if (process.env.DISCORD_ID) {
	new Lanyard((data) => {
		lanyard = data;

		lanyard.discord_user.id = "0";
		lanyard.discord_user.username = "";
		lanyard.discord_user.avatar = "";
		server.publish("data", JSON.stringify({ type: "lanyard", data }), true);
	});
}
