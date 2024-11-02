export class Socket extends WebSocket {
	private _reconnectDelay: number;
	private _url: string;

	constructor(url: string) {
		super(url);
		this._url = url;
		this._reconnectDelay = 1000;

		/*
		this.addEventListener("open", () => {
			console.log(`Socket > Connected to ${new URL(url).hostname}`);
		});
		*/

		this.addEventListener("close", async () => {
			setTimeout(async () => {
				return await this._reconnect();
			}, this._reconnectDelay);
		});

		this.addEventListener("error", async () => {
			setTimeout(async () => {
				return await this._reconnect();
			}, this._reconnectDelay);
		});
	}

	private async _reconnect() {
		this.close();
		const newSocket = new Socket(this._url);
		Object.setPrototypeOf(this, Object.getPrototypeOf(newSocket));
		Object.assign(this, newSocket);
	}
}
