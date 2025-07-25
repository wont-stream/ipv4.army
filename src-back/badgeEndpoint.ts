import { makeBadge } from "badge-maker";
import type { Types } from "@prequist/lanyard";

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
				message: heartrate.toString(),
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
				label: activity.name,
				message: activity.state,
				color: "blue",
			});
		}
	}

	if (type.startsWith("waka_")) {
		const key = type.replace("waka_", "");
		const friendlyKey = key
			.replace("today", "Today Coding")
			.replace("yesterday", "Yesterday Coding")
			.replace("week", "This Week Coding")
			.replace("7_days", "This Week Coding")
			.replace("last_7_days", "This Week Coding")
			.replace("month", "This Month Coding")
			.replace("30_days", "This Month Coding")
			.replace("last_30_days", "This Month Coding")
			.replace("6_months", "6 Months Coding")
			.replace("last_6_months", "6 Months Coding")
			.replace("year", "This Year Coding")
			.replace("12_months", "This Year Coding")
			.replace("last_12_months", "This Year Coding")
			.replace("last_year", "This Year Coding")
			.replace("any", "Of My Life Coding")
			.replace("all_time", "Of My Life Coding");

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
			label: "Spent",
			message: `${data.message} ${friendlyKey}`,
			color: data.color,
		});
	}

	return unknownType;
};
