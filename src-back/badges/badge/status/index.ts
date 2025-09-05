import type { Types } from "@prequist/lanyard";
import { makeBadge } from "badge-maker";

const capitalize = (str: string): string => {
	return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const statusColor = {
	online: "#008000",
	idle: "#DAA520",
	dnd: "#B22222",
	offline: "#778899",
};

export default async (opts: {
	type: string;
	heartrate: number;
	lanyard: Types.Presence;
}) => {
	const { lanyard } = opts;

	return makeBadge({
		label: "Status",
		message: capitalize(
			lanyard.discord_status.replace("dnd", "do not disturb"),
		),
		color: statusColor[lanyard.discord_status as keyof typeof statusColor],
	});
};
