import ReconnectingWebSocket from "reconnecting-websocket";

export default class {
	private _socket: ReconnectingWebSocket;
	private _keepAlive: NodeJS.Timeout | null;
	private _callback: (data: LanyardData) => void;

	constructor(callback: (data: LanyardData) => void) {
		this._socket = new ReconnectingWebSocket(
			"wss://lanyard.atums.world/socket",
		);
		this._keepAlive = null;
		this._callback = callback;

		this._socket.binaryType = "arraybuffer";

		this._socket.onopen = () => {
			console.log("Lanyard socket opened");
		};

		this._socket.onmessage = ({ data }: MessageEvent) => {
			data = JSON.parse(data);

			switch (data.op) {
				case 0: {
					this._callback(data.d);
					break;
				}
				case 1: {
					this._socket.send(
						JSON.stringify({
							op: 2,
							d: {
								subscribe_to_id: "1273447359417942128",
							},
						}),
					);
					this._keepAlive = setInterval(() => {
						this._socket.send(
							JSON.stringify({
								op: 3,
							}),
						);
					}, data.d.heartbeat_interval - 1000);
					break;
				}
			}
		};

		this._socket.onerror = () => {
			console.error("Lanyard socket error");
			if (this._keepAlive) {
				clearInterval(this._keepAlive);
				this._keepAlive = null;
			}
		};

		this._socket.onclose = (e) => {
			console.log("Lanyard socket closed");
			if (this._keepAlive) {
				clearInterval(this._keepAlive);
				this._keepAlive = null;
			}
		};
	}
}
