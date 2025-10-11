import type { Types } from "@prequist/lanyard";
import { makeBadge } from "badge-maker";

const heartrateUnavailable = makeBadge({
	label: "Heartrate",
	message: "Unavailable",
	color: "crimson",
});

export default async (opts: {
	type: string;
	heartrate: number;
	lanyard: Types.Presence;
}) => {
	const { heartrate } = opts;

	if (heartrate !== 0) {
		return makeBadge({
			label: "Heartrate",
			message: `${heartrate} BPM`,
			color: "crimson",
		});
	}

	return heartrateUnavailable;
};
