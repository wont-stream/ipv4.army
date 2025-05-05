type LanyardActivity = {
	type: number;
	name: string;
	details?: string;
	state?: string;
	[key: string]: unknown;
};

type LanyardData = {
	discord_status: "online" | "idle" | "dnd" | "offline";
	activities: LanyardActivity[];
	[key: string]: unknown;
};
