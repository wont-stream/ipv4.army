import { lanyard } from "src/web/util/realtime";

// for the sake of song lyrics
const regex = /(?<!\w)ni+g{1,2}(?:a|er)?s?(?!\w)/i;
const clean = (str: string) =>
	str.replace(regex, (match) => "*".repeat(match.length));

export const Quote = () => {
	return lanyard.value.activities.map((activity) => {
		if (activity.type !== 4) return null;

		return <span>- {clean(activity.state ?? "uhm..")}</span>;
	});
};
