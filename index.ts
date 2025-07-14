import * as response from "./src/backend/utilities/resp"

import Hyperate from "./src/backend/sockets/hyperate";
import Lanyard from "./src/backend/sockets/lanyard";

let heartrate = 0;
let lanyard: LanyardData = {
    discord_status: "online",
    activities: [],
};

function getPathValue(path: string, context: Record<string, any>): any {
    const keys = path.replace(/^\$\./, "").split(".");
    const root = keys.shift();

    const rootObj = context[root!];
    if (rootObj === undefined) return "";

    return keys.reduce((acc, key) => acc?.[key], rootObj);
}

function renderTemplate(template: string, context: Record<string, any>): string {
    return template.replace(/{{(.*?)}}/g, (_, rawPath) => {
        const path = rawPath.trim();
        const value = getPathValue(path, context);
        return value !== undefined ? String(value) : "";
    });
}

const server = Bun.serve({
    port: process.env.PORT || 3000,
    hostname: process.env.HOSTNAME || "localhost",

    routes: {
        "/": async (_req, _server) => {
            const file = Bun.file("./src/frontend/index.html");
            const content = await file.text();

            const objects = {
                lanyard,
                heartrate: heartrate === 0 ? "Heartrate: <span class=\"offline\">Unknown</span>" : `Heartrate: <span>${heartrate} BPM</span>`,
                css: `<style>${(await Bun.file("./src/frontend/index.css").text()).replaceAll(/(?:\r\n|\r|\n)/g, "").replaceAll(/\s+/g, "")}</style>`
            }

            const rendered = renderTemplate(content, objects).replaceAll(/(?:\r\n|\r|\n)/g, "").replaceAll(/ +/g, " ");
            return await response.text(rendered, "text/html", 200, true);
        },

        "/api/ws": async (req, server) => {
            if (!server.upgrade(req)) {
                const file = Bun.file("./src/frontend/404.html");
                const content = await file.text();

                const objects = {
                    lanyard,
                    css: `<style>${(await Bun.file("./src/frontend/index.css").text()).replaceAll(/(?:\r\n|\r|\n)/g, "").replaceAll(/\s+/g, "")}</style>`
                }

                const rendered = renderTemplate(content, objects).replaceAll(/(?:\r\n|\r|\n)/g, "").replaceAll(/ +/g, " ");
                return await response.text(rendered, "text/html", 404, true);
            }
        },

        "/*": async (req, _server) => {
            const file = Bun.file(`./src/frontend${new URL(req.url).pathname}`);

            if (!await file.exists()) {
                const file = Bun.file("./src/frontend/404.html");
                const content = await file.text();

                const objects = {
                    lanyard,
                    css: `<style>${(await Bun.file("./src/frontend/index.css").text()).replaceAll(/(?:\r\n|\r|\n)/g, "").replaceAll(/\s+/g, "")}</style>`
                }

                const rendered = renderTemplate(content, objects).replaceAll(/(?:\r\n|\r|\n)/g, "").replaceAll(/ +/g, " ");
                return await response.text(rendered, "text/html", 404, true);
            }

            return await response.file(file);
        },
    },

    websocket: {
        idleTimeout: 60,
        open: (ws) => {
            ws.subscribe("hyperate");
            ws.subscribe("lanyard");
            ws.send(
                JSON.stringify({ type: "hyperate", data: { hr: heartrate } }),
                true,
            );
            ws.send(JSON.stringify({ type: "lanyard", data: lanyard }), true);
        },
        message: (ws, msg: string) => {
            switch (msg) {
                case "ping":
                    ws.send("pong", true);
                    break;
                case "pong":
                    ws.send("ping", true);
                    break;
                default:
                    break;
            }

            return;
        },
    },
});

new Hyperate((data) => {
    heartrate = data;
    server.publish(
        "hyperate",
        JSON.stringify({ type: "hyperate", data: { hr: data } }),
        true,
    );
});

new Lanyard((data) => {
    lanyard = data
    server.publish(
        "lanyard",
        JSON.stringify({ type: "lanyard", data }),
        true,
    );
});
