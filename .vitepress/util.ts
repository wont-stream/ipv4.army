import { readdirSync } from "node:fs";

const months = [
	"",
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

type Item = {
	text: string;
	items: { text: string; link?: string; items?: Item[] }[];
};

const getBlogSidebar = () => {
	const filesAndDirs = readdirSync("./src/blog", {
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
export const blogItems = getBlogSidebar();

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

export const badgesHTML = getBadges();
