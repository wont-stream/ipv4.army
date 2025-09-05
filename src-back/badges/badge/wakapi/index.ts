//import type { Types } from "@prequist/lanyard";
import { makeBadge } from "badge-maker";

export default async (opts: {
	type: string;
	heartrate: number;
	/*lanyard: Types.Presence;*/
}) => {
	const { type } = opts;
	const key = type.replace("waka_", "");
	const friendlyKey = key
		.replace("today", "Today")
		.replace("yesterday", "Yesterday")
		.replace("week", "This Week")
		.replace("7_days", "This Week")
		.replace("last_7_days", "This Week")
		.replace("month", "This Month")
		.replace("30_days", "This Month")
		.replace("last_30_days", "This Month")
		.replace("6_months", "6 Months")
		.replace("last_6_months", "6 Months")
		.replace("year", "This Year")
		.replace("12_months", "This Year")
		.replace("last_12_months", "This Year")
		.replace("last_year", "This Year")
		.replace("any", "Of My Life")
		.replace("all_time", "Of My Life");

	const req = await fetch(
		`https://wakapi.atums.world/api/compat/shields/v1/seth/interval:${key}`,
	);
	if (!req.ok) {
		return makeBadge({
			label: "Wakapi",
			message: "Interval Not Valid",
			color: "red",
		});
	}
	const data = (await req.json()) as {
		message: string;
		color: string;
	};

	return makeBadge({
		label: "Coded",
		message: `${data.message} ${friendlyKey}`,
		color: data.color,
	});
};
