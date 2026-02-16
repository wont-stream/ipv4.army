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

const URLS = [
	"wss://lanyard.creations.works/socket",
	"wss://lanyard.vmohammad.dev/socket",
	"wss://api.lanyard.rest/socket",
] as const;

const SUBSCRIBE_TO_ID = "1383584342105919559";
const RECONNECT_DELAY = 5000;

class LanyardClient {
	private socket: WebSocket | null = null;
	private urlIndex = 0;
	private heartbeatInterval: NodeJS.Timeout | null = null;
	private reconnectTimeout: NodeJS.Timeout | null = null;

	constructor() {
		this.connect();
	}

	private getNextUrl(): string {
		return URLS[this.urlIndex++ % URLS.length] as string;
	}

	private connect() {
		const url = this.getNextUrl();
		echo.info("[Lanyard]", `Connecting to ${url}...`);

		this.socket = new WebSocket(url);
		this.socket.onopen = () => this.onOpen();
		this.socket.onmessage = (event) => this.onMessage(event);
		this.socket.onclose = () => this.onClose();
		this.socket.onerror = (event) => this.onError(event);
	}

	private sendHeartbeat() {
		if (this.socket?.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify({ op: 3 }));
		}
	}

	private onOpen() {
		echo.info("[Lanyard]", "WebSocket connected");
	}

	private onMessage(event: MessageEvent) {
		const msg = JSON.parse(event.data);

		if (msg.op === 1) {
			if (this.heartbeatInterval) {
				clearInterval(this.heartbeatInterval);
			}
			this.heartbeatInterval = setInterval(
				() => this.sendHeartbeat(),
				msg.d.heartbeat_interval,
			);

			this.socket?.send(
				JSON.stringify({
					op: 2,
					d: { subscribe_to_id: SUBSCRIBE_TO_ID },
				}),
			);
			return;
		}

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
	}

	private onClose() {
		echo.warn("[Lanyard]", "WebSocket closed. Reconnecting...");
		this.cleanup();
		this.scheduleReconnect();
	}

	private onError(event: Event) {
		echo.error("[Lanyard]", "WebSocket error", event);
	}

	private cleanup() {
		if (this.heartbeatInterval) {
			clearInterval(this.heartbeatInterval);
			this.heartbeatInterval = null;
		}
	}

	private scheduleReconnect() {
		if (this.reconnectTimeout) return;

		echo.info("[Lanyard]", `Reconnecting in ${RECONNECT_DELAY}ms...`);

		this.reconnectTimeout = setTimeout(() => {
			this.reconnectTimeout = null;
			this.connect();
		}, RECONNECT_DELAY);
	}

	public disconnect() {
		this.cleanup();
		if (this.reconnectTimeout) {
			clearTimeout(this.reconnectTimeout);
			this.reconnectTimeout = null;
		}
		this.socket?.close();
	}
}

export const lanyardClient = new LanyardClient();
