import type { Options } from "reconnecting-websocket";

export const websocketOptions: Options = {
  minReconnectionDelay: 5000,
  reconnectionDelayGrowFactor: 1.5,
  connectionTimeout: 5000,
  maxRetries: Number.MAX_SAFE_INTEGER,
};
