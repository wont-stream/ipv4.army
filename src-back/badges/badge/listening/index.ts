import type { Types } from "@prequist/lanyard";
import { makeBadge } from "badge-maker";

const notListening = makeBadge({
	label: "Not",
	message: "Listening",
	color: "gray",
});

export default async (opts: {
	type: string;
	heartrate: number;
	lanyard: Types.Presence;
}) => {
	const { lanyard } = opts;

	const activity = lanyard.activities.find(
		(act) => act.application_id === "1130698654987067493",
	);
	if (!activity) {
		return notListening;
	}

	return makeBadge({
		label: activity.state || "...",
		message: activity.details || "...",
		color: "blue",
		// @ts-ignore new properties not yet in types, see https://github.com/prequist/lanyard/issues/1
		links: [activity.details_url || "", activity.state_url || ""],
	});
};
