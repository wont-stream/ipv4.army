import { defineConfig } from "vitepress";

import { atumsIcon, badgesHTML, blogItems } from "./util";

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
			"script",
			{
				async: "",
				defer: "",
				src: "https://an.ipv4-army.workers.dev/main.js",
				"data-domain": "ipv4.army",
				"data-api": "https://an.ipv4-army.workers.dev/api",
			},
		],
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
			{
				icon: "discord",
				link: "https://discord.com/users/1383584342105919559",
			},
			{
				icon: {
					svg: atumsIcon,
				},
				link: "https://ipv4.army/watch",
			},
		],
	},
});
