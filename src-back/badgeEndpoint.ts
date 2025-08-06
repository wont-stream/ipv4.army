import type { Types } from "@prequist/lanyard";
import { makeBadge } from "badge-maker";

const statusMessage = {
	online: "Online",
	idle: "Idle",
	dnd: "Do Not Disturb",
	offline: "Offline",
};
const statusColor = {
	online: "#008000",
	idle: "#DAA520",
	dnd: "#B22222",
	offline: "#778899",
};

const unknownType = makeBadge({
	label: "Unknown",
	message: `Type`,
	color: "red",
});

export const badger = async (
	type: string,
	opts: { heartrate: number; lanyard: Types.Presence },
) => {
	const { heartrate, lanyard } = opts;

	switch (type) {
		case "heartrate": {
			return makeBadge({
				label: "Heartrate",
				message: `${heartrate !== 0 || lanyard.discord_status !== "offline" ? `${heartrate} BPM` : "Unavailable"}`,
				color: "crimson",
			});
		}
		case "status": {
			return makeBadge({
				label: "Status",
				message:
					statusMessage[lanyard.discord_status as keyof typeof statusMessage],
				color: statusColor[lanyard.discord_status as keyof typeof statusColor],
			});
		}
		case "listening": {
			const activity = lanyard.activities.find(
				(act) => act.application_id === "1130698654987067493",
			);
			if (!activity) {
				return makeBadge({
					label: "Not",
					message: "Listening",
					color: "gray",
				});
			}

			return makeBadge({
				label: activity.state || "...",
				message: activity.details || "...",
				color: "blue",
				links: [activity.details_url || "", activity.state_url || ""],
			});
		}
	}

	if (type.startsWith("waka_")) {
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
	}

	return unknownType;
};
