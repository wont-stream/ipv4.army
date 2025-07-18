import { readdir } from "node:fs/promises";
import { defineConfig } from "vitepress";

import { months } from "./util";

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
				dayItem = { text: day, items: [] };
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
				href: "/favicon.svg",
			},
		],
	],
	metaChunk: true,

	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: "Home", link: "/" },
			{ text: "Examples", link: "/markdown-examples" },
		],

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

		socialLinks: [
			{ icon: "gitlab", link: "https://heliopolis.live/seth" },
			{ icon: "bluesky", link: "https://bsky.app/profile/seth.ipv4.army" },
			{
				icon: "discord",
				link: "https://discord.com/users/1383584342105919559",
			},
		],
	},
});
