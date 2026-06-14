const langColorsReq = await fetch(
	"https://cdn.jsdelivr.net/gh/anuraghazra/github-readme-stats@master/src/common/languageColors.json",
);
const langColors = (await langColorsReq.json()) as Record<string, string>;

type HeliReq = HeliRes[];
interface HeliRes {
	language: string | null;
}

const calculatePercent = (
	counts: Record<string, number>,
): Record<string, string> => {
	const totalHits = Object.values(counts).reduce((acc, curr) => acc + curr, 0);

	return Object.fromEntries(
		Object.entries(counts)
			.sort(([, a], [, b]) => b - a)
			.map(([category, hits]) => [
				category,
				((hits / totalHits) * 100).toFixed(2),
			]),
	);
};

const getTopLangs = async (): Promise<Record<string, string>> => {
	const req = await fetch(
		"https://heliopolis.live/api/v1/users/seth/repos?limit=0",
	);
	const data = (await req.json()) as HeliReq;

	const counts = data.reduce<Record<string, number>>((acc, { language }) => {
		if (language) {
			acc[language] = (acc[language] ?? 0) + 1;
		}
		return acc;
	}, {});

	return calculatePercent(counts);
};

export const makeSVG = async (): Promise<string> => {
	const data = await getTopLangs();
	const entries = Object.entries(data);
	const height = 45 + entries.length * 25;

	const svgContent = entries
		.map(([language, percentage], index) => {
			const color = langColors[language] ?? "#111111";
			const cy = 60 + index * 25;

			return [
				`<circle cx="60" cy="${cy}" r="10" fill="${color}" />`,
				`<text x="80" y="${cy + 5}" fill="#cbd0da">${language}: ${percentage}%</text>`,
			].join("");
		})
		.join("");

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 ${height}" width="100%" height="100%">${svgContent}</svg>`;
};
