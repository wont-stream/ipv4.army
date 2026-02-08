import { echo } from "@atums/echo";

import { server } from "src";

export let lanyardData: LanyardData = {
	kv: {},
	discord_user: {
		avatar: "ab9c0850107cea9fb7640c2327b04cac",
		avatar_decoration_data: null,
		bot: false,
		collectibles: null,
		discriminator: "0",
		display_name: "",
		global_name: "",
		id: "1383584342105919559",
		public_flags: 0,
		username: "",
	},
	activities: [],
	discord_status: "offline",
	active_on_discord_web: false,
	active_on_discord_desktop: true,
	active_on_discord_mobile: false,
	active_on_discord_embedded: false,
	listening_to_spotify: false,
	spotify: null,
};

const urls = [
	"wss://lanyard.atums.world/socket",
	"wss://lanyard.vmohammad.dev/socket",
	"wss://api.lanyard.rest/socket",
];
let urlIndex = 0;

const urlProvider = () => urls[urlIndex++ % urls.length] as string;

let socket = new WebSocket(urlProvider());
const subscribe_to_id = "1383584342105919559";

let heartbeatInterval: NodeJS.Timeout | null = null;

const sendHeartbeat = () => {
	if (socket.readyState === WebSocket.OPEN) {
		socket.send(JSON.stringify({ op: 3 }));
	}
};

const onOpen = () => {
	echo.info("[Lanyard]", "WebSocket Opened");
};

const onMessage = (event: MessageEvent) => {
	const msg = JSON.parse(event.data);

	// Hello (heartbeat interval)
	if (msg.op === 1) {
		heartbeatInterval = setInterval(sendHeartbeat, msg.d.heartbeat_interval);

		socket.send(
			JSON.stringify({
				op: 2,
				d: { subscribe_to_id },
			}),
		);
		return;
	}

	// Presence update
	if (msg.op === 0) {
		lanyardData = msg.d;
		server.publish(
			"lanyard",
			JSON.stringify({
				type: "lanyard",
				data: lanyardData,
			}),
			true,
		);
	}
};

let reconnectTimeout: NodeJS.Timeout | null = null;

const onClose = () => {
	echo.warn("[Lanyard]", "WebSocket Closed", "Attempting Reconnect...");
	if (heartbeatInterval !== null) {
		clearInterval(heartbeatInterval);
		heartbeatInterval = null;
	}

	if (reconnectTimeout !== null) return;

	reconnectTimeout = setTimeout(() => {
		reconnectTimeout = null;

		socket = new WebSocket(urlProvider());

		socket.onopen = onOpen;
		socket.onmessage = onMessage;
		socket.onclose = onClose;
		socket.onerror = onError;
	}, 5000);
};

const onError = (event: Event) => {
	echo.warn("[Lanyard]", "WebSocket Error", event);
	return onClose();
};

socket.onopen = onOpen;
socket.onmessage = onMessage;
socket.onclose = onClose;
socket.onerror = onError;
