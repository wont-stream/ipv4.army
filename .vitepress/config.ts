import { defineConfig } from "vitepress";

import { badgesHTML, blogItems } from "./util";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "S€TH",
	description:
		"A guy with a passion for backend development, high-fidelity audio, and gaming.",
	lastUpdated: true,
	srcDir: "./src",
	cleanUrls: true,
	appearance: "force-dark",
	head: [
		[
			"link",
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon-96x96.png",
				sizes: "96x96",
			},
		],
		["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
		["link", { rel: "shortcut icon", href: "/favicon.ico" }],
		[
			"link",
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png",
			},
		],
		["meta", { name: "apple-mobile-web-app-title", content: "S€TH" }],
		["link", { rel: "manifest", href: "/site.webmanifest" }],
	],
	metaChunk: true,

	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config

		logo: {
			src: "/favicon.svg",
			alt: "logo",
		},

		nav: [
			{ text: "Home", link: "/" },
			{ text: "Blog", link: "/blog" },
		],

		sidebar: [
			{
				text: "Home",
				items: [{ text: "About Me", link: "/about" }],
			},
			{
				text: "Blog",
				items: blogItems,
			},
		],

		footer: {
			message: badgesHTML,
		},

		editLink: {
			pattern: "https://heliopolis.live/seth/ipv4.army/-/edit/main/src/:path",
			text: "Edit this page on Heliopolis",
		},

		lastUpdated: {
			formatOptions: {
				day: "2-digit",
				month: "2-digit",
				year: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			},
		},

		externalLinkIcon: true,

		socialLinks: [
			{ icon: "gitlab", link: "https://heliopolis.live/seth" },
			{ icon: "bluesky", link: "https://bsky.app/profile/seth.ipv4.army" },
			/*{
				icon: "discord",
				link: "https://discord.com/users/1383584342105919559",
			},*/
			{
				icon: {
					svg: `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 512 512"><path fill="currentColor" d="M511 255a255 255 0 0 1-255 254A255 255 0 0 1 1 255 255 255 0 0 1 256 0a255 255 0 0 1 255 255z"></path><path fill="grey" fill-rule="evenodd" d="m293 3-2 1-5 4-3 4-5 7-6 7-6 6-7 3-3 3c-4 2-5 0-10 1l-3 1c-2 1-6-2-7 0-1 3 2 6 3 10-3 17-3 9-3 22v11c2 11 6 18 14 27 2 2 4 5 8 6l14 4c15 4 8 2 22 4l6 2h15v-1c2 0 2-2 4-3h1c2 0 4-1 6 1l1 2v1l1 6 2 7v17c3 8 11 9 18 11l18 4h12l1 1 1 3 3 4 4 7a264 264 0 0 1-23 12l-37 16c-8 3-17 6-24 12l-4 5-3 5v6c0 1 0 10 2 12 5 5 17 4 24 5 20 2 11 1 33 1h59c5 0 7 1 12-1 2-1 2-4 2-5l1-2 5-5 2-4 4-7 2-2 5-4 8-8 2-2h43l7 7 2 2A255 255 0 0 0 293 3zM70 80A255 255 0 0 0 1 255a255 255 0 0 0 10 67h26c7 0 10 1 16-5s2-9 4-16l4-13c2-9 2-11 6-20 9-20 3-3 12-21l13-29 4-12 2-7c2-7 2-9 2-15v-4l-8-9-5-7c-4-4-9-7-14-8v-8l3-6 3-6 2-9 1-6V92l-6-5-5-6-1-1zm-19 73 4 1h-7v-1h3zm4 1zm168 160-2 1-21 10-10 5c-3 1-7 2-10 5l-10 8c-3 3-13 10-16 15l-4 6-5 7-3 8c-5 7-6 3-11 10-2 1-1 3-2 5l-3 3-4 3-3 4-7 6-6 5-5 5-5 3-2 4s-6 7-6 10v9a255 255 0 0 0 64 41 2276 2276 0 0 0 35-10l1 3 1 1v1l1 1 2 3 1 1v1l-1 8-1 5a255 255 0 0 0 65 8 255 255 0 0 0 155-52v-4c1-10 3 1 1-11 0-6-1-12-6-15l-3-2-10-5c-11-5-14-8-25-10-18-3-12 0-30-1l-11-2h-15c-12-1-2-1-13-5-15-4-5 0-15-2l-8-1h-12l-5-2-10-3h-2l-1-2-2-1c-1-1-4-4-1-5 2-3 6-4 10-5 25-11 10-5 36-9l15-3h24l4-3v-3l1-5v-17c-9-8-19-12-31-16l-11-4-10-3-17-2-10-1h-25l-6-1zM19 347a255 255 0 0 0 11 25v-9c0-3 1-6-1-8-2-3-6-4-9-7l-1-1z"></path></svg>`,
				},
				link: "https://ipv4.army/watch",
			},
		],
	},
});
