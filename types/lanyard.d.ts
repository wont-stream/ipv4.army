type LanyardActivity = {
	id: string;
	name: string;
	type: number;
	state?: string;
	session_id: string;
	details?: string;
	application_id: string;

	timestamps?: {
		start?: number;
		end?: number;
	};

	assets?: {
		large_image?: string;
		large_text?: string;
		small_image?: string;
		small_text?: string;
	};

	created_at?: number;

	buttons?: string[];
};

type LanyardData = {
	discord_status: "online" | "idle" | "dnd" | "offline";
	activities: LanyardActivity[];
	[key: string]: unknown;
};
