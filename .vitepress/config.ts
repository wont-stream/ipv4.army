import { readdir } from "node:fs/promises";
import { defineConfig } from "vitepress";

import { months } from "./util";

const atumsIconFile = Bun.file(".vitepress/icons/atums.svg");
const atumsIcon = await atumsIconFile.text();

type Item = {
	text: string;
	items: { text: string; link?: string; items?: Item[] }[];
};

export const getBlogSidebar = async () => {
	const filesAndDirs = await readdir("./src/blog", {
		withFileTypes: true,
		recursive: true,
	});

	const files = filesAndDirs
		.filter((file) => file.isFile() && file.name.endsWith(".md"))
		.map(
			(file) =>
				`${file.parentPath.replaceAll("\\", "/").replace("src/blog/", "")}/${file.name.replace(".md", "")}`,
		);

	const items: Item[] = [];

	for (const post of files) {
		const [year, month, day, title] = post.split("/") as [
			string,
			string,
			string,
			string,
		];

		let yearItem = items.find((item) => item.text === year);
		if (!yearItem) {
			yearItem = { text: year, items: [] };
			items.push(yearItem);
		}

		let monthItem = yearItem.items.find(
			(item) => item.text === months[parseInt(month)],
		);
		if (!monthItem) {
			monthItem = { text: months[parseInt(month)] as string, items: [] };
			yearItem.items.push(monthItem);
		}

		if (monthItem.items) {
			let dayItem = monthItem.items.find((item) => item.text === day);
			if (!dayItem) {
				dayItem = { text: day.slice(1), items: [] };
				monthItem.items.push(dayItem);
			}

			const titleParts = title.split("-");
			dayItem.items.push({
				text: titleParts[1]?.replace("_", " ") as string,
				link: `/blog/${post}`,
			});
		}
	}

	return items;
};
const blogItems = await getBlogSidebar();

const badges = [
	{ name: "Heartrate", path: "heartrate" },
	{ name: "Listening To", path: "listening" },
	{ name: "Discord Status", path: "status" },
	{ name: "Livestream", path: "stream" },
	{ name: "Coding Time Weekly", path: "waka_week" },
	{ name: "Coding Time Monthly", path: "waka_month" },
];

const getBadges = () => {
	let html = "";

	for (const badge of badges) {
		html += `<img src="/badge/${badge.path}" alt="${badge.name}" />`;
	}

	return html;
};

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
		nav: [
			{ text: "Home", link: "/" },
			{ text: "Blog", link: "/blog" },
		],

		footer: {
			message: getBadges(),
		},

		logo: {
			src: "/favicon.svg",
			alt: "logo",
		},

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
