await Bun.$`bun docs:build`;
console.log("\n");

import type { Types } from "@prequist/lanyard";

import { Glob } from "bun";
import { getBlogSidebar } from "./.vitepress/config";
import { badger } from "./src-back/badgeEndpoint";
import { Hyperate } from "./src-back/hyperate";
import { Lanyard } from "./src-back/lanyard";

let heartrate = 0;
let lanyard: Types.Presence = {
	spotify: null,
	kv: {},
	listening_to_spotify: false,
	discord_user: {
		username: "",
		public_flags: 0,
		id: "0",
		display_name: "",
		global_name: "",
		discriminator: "0",
		bot: false,
		avatar_decoration_data: null,
		avatar: null,
		primary_guild: {
			tag: "",
			identity_guild_id: "0",
			badge: "",
			identity_enabled: false,
		},
		collectibles: null,
	},
	discord_status: "offline",
	activities: [],
	active_on_discord_web: false,
	active_on_discord_mobile: false,
	active_on_discord_desktop: false,
	active_on_discord_embedded: false,
};

const blogItems = await getBlogSidebar();
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

const routes: Record<string, Response> = {};

for await (const file of glob.scan("./.vitepress/dist")) {
	routes[
		`/${file.replaceAll("\\", "/").replace("index.html", "").replace(".html", "")}`
	] = new Response(Bun.file(`./.vitepress/dist/${file}`));
}

const server = Bun.serve({
	routes: {
		...routes,

		"/": new Response(Bun.file("./.vitepress/dist/index.html")),

		"/blog": Response.redirect(newestBlogPostLink, 302),

		"/api/ws": (req, server) => {
			if (!server.upgrade(req, { data: { type: "websocket" } })) {
				return new Response("WebSocket upgrade failed", { status: 400 });
			}
		},

		"/badge/:type": async (req) => {
			return new Response(
				await badger(req.params.type, { heartrate, lanyard }),
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
