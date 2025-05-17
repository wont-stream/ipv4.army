const { protocol, host } = window.location;

class Socket extends EventTarget {
	private _socket: WebSocket;

	constructor(url: string) {
		super();

		this._socket = new WebSocket(url);
		this._socket.onmessage = (event) => {
			if (event.data === "ping") return;
			if (event.data === "pong") return;

			const { type, data } = JSON.parse(event.data);

			switch (type) {
				case "lanyard": {
					this.emitLanyard(data);
					break;
				}
				case "hyperate": {
					this.emitHyperate(data.hr);
					break;
				}
				case "echo": {
					//console.log("Echo: ", data);
					break;
				}
				default: {
					console.error("Unknown message type: ", type, data);
					break;
				}
			}
		};

		this._socket.onclose = () => {
			const willRefresh = confirm("Realtime Data Connection closed\nWould you like to reconnect?");
			if (willRefresh) {
				location.reload();
			}
		};

		setInterval(() => {
			this._socket.send("ping");
		}, 10 * 1000);
	}

	emitLanyard(lanyard: LanyardData) {
		this.dispatchEvent(new CustomEvent("lanyard", { detail: lanyard }));
	}
	emitHyperate(heartRate: number) {
		this.dispatchEvent(new CustomEvent("hyperate", { detail: heartRate }));
	}
}

export default new Socket(`${protocol.replace("http", "ws")}//${host}/api/ws`);
