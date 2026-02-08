import { build } from "./build";
import { lanyardData } from "./socket/lanyard";
import { badge } from "./util/badge";
import { compress } from "./util/compress";

const { files } = await build();

export const server = Bun.serve({
  routes: {
    "/": async (req) => {
      return await compress(req, Bun.file("./dist/index.html"), false);
    },
    "/api/ws": (req, server) => {
      server.upgrade(req);
      return new Response(null, { status: 101 });
    },
    "/api/badge/:type": async (req, server) => {
      return await badge(req);
    },
  },
  fetch: async (req) => {
    const url = new URL(req.url);
    const { pathname } = url;

    if (pathname.startsWith("/chunk")) {
      const type = pathname.split(".").pop();
      const file = files[type as "js" | "css"];

      if (!file) {
        return new Response("Not Found", { status: 404 });
      }

      return compress(req, Bun.file(file.path));
    } else {
      const publicFile = Bun.file(`./src/public${pathname}`);

      if (await publicFile.exists()) {
        return compress(req, publicFile);
      }
    }

    return new Response("Not Found", { status: 404 });
  },
  websocket: {
    idleTimeout: 960,

    open: async (ws) => {
      ws.subscribe("lanyard");

      ws.send(
        JSON.stringify({
          type: "lanyard",
          data: lanyardData,
        }),
        true,
      );
    },

    message: async (ws, message) => {
      try {
        const msg = JSON.parse(message as string) as {
          type: string;
          data: string;
        };
        const { type } = msg;

        switch (type) {
          case "ping":
            {
              ws.send(JSON.stringify({ type: "pong", data: "" }), true);
            }
            break;
          default:
            {
            }
            break;
        }
      } catch (_e) {
        // ignore
      }
    },
  },
});
