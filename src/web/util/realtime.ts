import { signal } from "@preact/signals";
import { useEffect } from "preact/hooks";

// @ts-expect-error: gets replaced on server send
export const lanyard = signal<LanyardData>("lanyardData");

const ping = JSON.stringify({ type: "ping" });

export function useRealtime() {
  useEffect(() => {
    let mounted = true;

    /* ------------------
     * WebSocket
     * ------------------ */
    const socket = new WebSocket(
      `${location.protocol.replace("http", "ws")}//${location.host}/api/ws`,
    );

    let heartbeatInterval: number | null = null;

    const sendHeartbeat = () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(ping);
      }
    };

    socket.onopen = () => {
      heartbeatInterval = window.setInterval(sendHeartbeat, 10_000);
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      switch (msg.type) {
        case "lanyard": {
          if (mounted) {
            lanyard.value = msg.data;
          }
          break;
        }
        default:
          {
          }
          break;
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
