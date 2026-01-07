import { signal } from "@preact/signals";
import { useEffect } from "preact/hooks";

export const lanyard = signal<LanyardData>({
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
});

const ping = JSON.stringify({ type: "ping" });

export const useRealtime = () => {
	useEffect(() => {
		let mounted = true;

		const socket = new WebSocket(
			`${location.protocol.replace("http", "ws")}//${location.host}/api/ws`,
		);

		let heartbeatInterval: number | null = null;

		const sendHeartbeat = () => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(ping);
			}
		};

		socket.onopen = () => {
			heartbeatInterval = window.setInterval(sendHeartbeat, 10_000);
		};

		socket.onmessage = (event) => {
			const msg = JSON.parse(event.data);

			switch (msg.type) {
				case "lanyard": {
					if (mounted) {
						lanyard.value = msg.data;
					}
					break;
				}
				default:
					{
					}
					break;
			}
		};

		/* ------------------
		 * Cleanup
		 * ------------------ */
		return () => {
			mounted = false;

			if (heartbeatInterval !== null) {
				clearInterval(heartbeatInterval);
			}

			socket.close();
		};
	}, []);
};
