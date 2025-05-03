const { protocol, host } = window.location;

class Socket extends EventTarget {
    private _socket: WebSocket;

    constructor(url: string) {
        super();

        this._socket = new WebSocket(url);
        this._socket.onmessage = (event) => {
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
            }
        };

        setInterval(() => {
            this._socket.send("ping");
        }, 10000);
    }

    emitLanyard(lanyard: object) {
        this.dispatchEvent(new CustomEvent('lanyard', { detail: lanyard }));
    }
    emitHyperate(heartRate: number) {
        this.dispatchEvent(new CustomEvent('hyperate', { detail: heartRate }));
    }
}

export default new Socket(`${protocol.replace("http", "ws")}//${host}/api/ws`);