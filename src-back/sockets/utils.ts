import type { Options } from "reconnecting-websocket";

export const websocketOptions: Options = {
	minReconnectionDelay: 1000,
	reconnectionDelayGrowFactor: 0,
	connectionTimeout: 5000,
	maxRetries: Number.MAX_SAFE_INTEGER,
};
