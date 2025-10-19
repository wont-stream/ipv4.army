import type { Types } from "@prequist/lanyard";
import ReconnectingWebSocket from "reconnecting-websocket";
import { websocketOptions } from "../utils";

const urls = [
  "wss://lanyard.atums.world/socket",
  "wss://api.lanyard.rest/socket",
];

let index = 0;

const getUrl = () => urls[index++ % urls.length] as string;

export class Lanyard {
  private _socket: ReconnectingWebSocket;
  private _keepAlive: NodeJS.Timeout | null;
  private _callback: (data: Types.Presence) => void;

  constructor(callback: (data: Types.Presence) => void) {
    this._socket = new ReconnectingWebSocket(getUrl, [], websocketOptions);
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
                subscribe_to_id: process.env.DISCORD_ID,
              },
            }),
          );
          this._keepAlive = setInterval(() => {
            this._socket.send(
              JSON.stringify({
                op: 3,
              }),
            );
          }, data.d.heartbeat_interval);
          break;
        }
        default: {
          console.warn("Lanyard socket received unknown op", data);
        }
      }
    };

    this._socket.onerror = (e) => {
      console.error("Lanyard socket error", e.message);
      if (this._keepAlive) {
        clearInterval(this._keepAlive);
        this._keepAlive = null;
      }
    };

    this._socket.onclose = (e) => {
      console.log("Lanyard socket closed", e.reason);
      if (this._keepAlive) {
        clearInterval(this._keepAlive);
        this._keepAlive = null;
      }
    };
  }
}
