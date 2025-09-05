import ReconnectingWebSocket from "reconnecting-websocket";
import { websocketOptions } from "../utils";

export class Hyperate {
	private _socket: ReconnectingWebSocket;
	private _keepAlive: NodeJS.Timeout | null;
	private _interval: NodeJS.Timeout | null;
	private _callback: (data: number) => void;

	constructor(callback: (data: number) => void) {
		this._socket = new ReconnectingWebSocket(
			`wss://app.hyperate.io/socket/websocket?token=${process.env.HYPERATE_TOKEN}`,
			[],
			websocketOptions,
		);
		this._keepAlive = null;
		this._interval = null;
		this._callback = callback;

		this._socket.binaryType = "arraybuffer";

		this._socket.onopen = () => {
			console.log("Hyperate socket opened");

			this._socket.send(
				JSON.stringify({
					topic: `hr:${process.env.HYPERATE_ID}`,
					event: "phx_join",
					payload: {},
					ref: 0,
				}),
			);

			this._keepAlive = setInterval(() => {
				this._socket.send(
					JSON.stringify({
						topic: "phoenix",
						event: "heartbeat",
						payload: {},
						ref: 0,
					}),
				);
			}, 10000 - 1000);
		};

		this._socket.onmessage = ({ data }: MessageEvent) => {
			data = JSON.parse(data);

			switch (data.event) {
				case "hr_update": {
					this._callback(data.payload.hr);
					this.heartbeat();
					break;
				}
				case "phx_reply": {
					if (data.payload.status !== "ok") {
						console.error("phx_reply failed", data);
					}
					break;
				}
				default: {
					console.warn("Hyperate socket received unknown event", data);
				}
			}
		};

		this._socket.onerror = (e) => {
			console.error("Hyperate socket error", e.message);
			if (this._keepAlive) {
				clearInterval(this._keepAlive);
				this._keepAlive = null;
			}
			if (this._interval) {
				clearInterval(this._interval);
				this._interval = null;
			}
		};

		this._socket.onclose = (e) => {
			console.log("Hyperate socket closed", e.reason);
			if (this._keepAlive) {
				clearInterval(this._keepAlive);
				this._keepAlive = null;
			}
			if (this._interval) {
				clearInterval(this._interval);
				this._interval = null;
			}
		};
	}

	private heartbeat() {
		if (this._interval) {
			clearTimeout(this._interval);
			this._interval = null;
		}
		this._interval = setTimeout(() => {
			this._callback(0);
		}, 6000);
	}
}
