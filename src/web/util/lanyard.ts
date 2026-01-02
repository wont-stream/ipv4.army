import type { Types } from "@prequist/lanyard";
import { signal } from "@preact/signals";
import { useEffect } from "preact/hooks";

/**
 * Shared signal
 * Starts as null so layout doesn't depend on fake data
 */
export const lanyard = signal<Types.Presence>({
  kv: {},
  discord_user: {
    avatar: null,
    avatar_decoration_data: null,
    bot: false,
    collectibles: null,
    discriminator: "",
    display_name: null,
    global_name: null,
    id: "0",
    primary_guild: {
      badge: "",
      identity_enabled: false,
      identity_guild_id: "",
      tag: "",
    },
    public_flags: 0,
    username: "",
  },
  activities: [],
  discord_status: "offline",
  active_on_discord_web: false,
  active_on_discord_desktop: false,
  active_on_discord_mobile: false,
  active_on_discord_embedded: false,
  listening_to_spotify: false,
  spotify: null,
});

const USER_ID = "1383584342105919559";
const API_URL = `https://lanyard.atums.world/v1/users/${USER_ID}`;
const WS_URL = "wss://lanyard.atums.world/socket";

export function useLanyard() {
  useEffect(() => {
    let mounted = true;

    /* ------------------
     * Initial REST fetch
     * ------------------ */
    fetch(API_URL)
      .then((res) => res.json())
      .then((data: { success: boolean; data: Types.Presence }) => {
        if (mounted && data.success) {
          lanyard.value = data.data;
        }
      })
      .catch(() => {
        /* ignore network errors */
      });

    /* ------------------
     * WebSocket
     * ------------------ */
    const socket = new WebSocket(WS_URL);

    let heartbeatInterval: number | null = null;

    const sendHeartbeat = () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ op: 3 }));
      }
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      // Hello (heartbeat interval)
      if (msg.op === 1) {
        heartbeatInterval = window.setInterval(
          sendHeartbeat,
          msg.d.heartbeat_interval,
        );

        socket.send(
          JSON.stringify({
            op: 2,
            d: { subscribe_to_id: USER_ID },
          }),
        );
        return;
      }

      // Presence update
      if (msg.op === 0 && mounted) {
        lanyard.value = msg.d;
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
}
