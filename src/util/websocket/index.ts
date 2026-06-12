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
	private reconnectTimeout: number | null = null;
	private connectionTimeout: number | null = null;
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 5;
	private baseReconnectDelay = 1000;
	private connectionHealthCheck: number | null = null;

	constructor(private message: (d: BunMessageEvent) => Promise<void>) {
		this.connect();
	}

	private getNextUrl(): string {
		return URLS[this.urlIndex++ % URLS.length] as string;
	}

	private scheduleReconnect() {
		if (this.reconnectAttempts >= this.maxReconnectAttempts) {
			console.error("Max reconnection attempts reached");
			return;
		}

		const delay = Math.min(
			this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts),
			30000
		);

		this.reconnectTimeout = setTimeout(() => {
			this.connect();
		}, delay);
	}

	private startConnectionTimeout() {
		this.connectionTimeout = setTimeout(() => {
			console.error("Connection timeout");
			this.ws?.close();
		}, 30000);
	}

	private stopConnectionTimeout() {
		if (this.connectionTimeout) {
			clearTimeout(this.connectionTimeout);
			this.connectionTimeout = null;
		}
	}

	private startHealthCheck() {
		this.connectionHealthCheck = setInterval(() => {
			if (this.ws?.readyState !== WebSocket.OPEN) {
				console.warn("Connection health check failed");
				this.ws?.close();
			}
		}, 30000);
	}

	private stopHealthCheck() {
		if (this.connectionHealthCheck) {
			clearInterval(this.connectionHealthCheck);
			this.connectionHealthCheck = null;
		}
	}

	private connect() {
		this.stopConnectionTimeout();
		this.stopHealthCheck();

		this.ws = new WebSocket(this.getNextUrl());

		this.startConnectionTimeout();
		this.startHealthCheck();

		this.ws.addEventListener("open", () => {
			this.stopConnectionTimeout();
			this.reconnectAttempts = 0;
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
			this.stopConnectionTimeout();
			this.stopHealthCheck();
			this.reconnectAttempts++;
			this.scheduleReconnect();
		});

		this.ws.addEventListener("error", (err) => {
			console.error("WS error:", err);
			this.ws?.close();
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
		this.stopConnectionTimeout();
		this.stopHealthCheck();
		if (this.reconnectTimeout) {
			clearTimeout(this.reconnectTimeout);
		}
		this.ws?.close();
	}
}

// Usage
const socket = new ReconnectingWebSocket();
socket.send("hello");