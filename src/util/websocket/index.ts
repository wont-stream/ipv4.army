import type { BunMessageEvent } from "bun";

const URLS = [
	"wss://lanyard.creations.works/socket",
	"wss://lanyard.vmohammad.dev/socket",
	"wss://api.lanyard.rest/socket",
] as const;

const SUBSCRIBE_TO_ID = "1383584342105919559";

class ReconnectingWebSocket {
	private ws: WebSocket | null = null;
	private urlIndex = 0;

	constructor(private message: (d: BunMessageEvent) => Promise<void>) {
		this.connect();
	}

	private getNextUrl(): string {
		return URLS[this.urlIndex++ % URLS.length] as string;
	}

	private connect() {
		this.ws = new WebSocket(this.getNextUrl());

		this.ws.addEventListener("open", () => {
			this.ws?.send(
				JSON.stringify({
					op: 2,
					d: { subscribe_to_id: SUBSCRIBE_TO_ID },
				}),
			);
		});

		this.ws.addEventListener("message", (event) => {
			this.message(event.data);
		});

		this.ws.addEventListener("close", (event) => {
			console.log(`Closed (code ${event.code})`);
			this.connect();
		});

		this.ws.addEventListener("error", (err) => {
			console.error("WS error:", err);
			this.ws?.close(); // triggers the close handler above
		});
	}

	send(data: string | Uint8Array) {
		if (this.ws?.readyState === WebSocket.OPEN) {
			this.ws.send(data);
		} else {
			console.warn("Not connected, message dropped");
		}
	}

	close() {
		this.ws?.close();
	}
}

// Usage
const socket = new ReconnectingWebSocket();
socket.send("hello");
