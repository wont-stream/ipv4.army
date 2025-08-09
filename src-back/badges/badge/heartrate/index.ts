import type { Types } from "@prequist/lanyard";
import { makeBadge } from "badge-maker";

export default async (opts: {
	type: string;
	heartrate: number;
	lanyard: Types.Presence;
}) => {
	const { heartrate, lanyard } = opts;

	return makeBadge({
		label: "Heartrate",
		message: `${heartrate !== 0 && lanyard.discord_status !== "offline" ? `${heartrate} BPM` : "Unavailable"}`,
		color: "crimson",
	});
};
