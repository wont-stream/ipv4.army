import { build, serve, gzipSync, file, type BunRequest, gc } from "bun";

import pkg from "./package.json";

const development = process.env.NODE_ENV === "development";

let heartrate = 0;
let lanyard = {};

require("node:fs/promises").rm("./dist", { recursive: true, force: true }).catch(() => {
    // ignore
});

const buildWeb = async () => {
    return await build({
        entrypoints: ['./src/index.html'],
        outdir: './dist',
        minify: !development,
        sourcemap: (development ? "inline" : "none"),
        splitting: true,
        publicPath: "/assets/",
        loader: {
            ".woff2": "file"
        },
    })
}

if (!development) {
    await buildWeb()
}

const webserver = serve({
    routes: {
        "/": async () => {
            if (development) {
                await buildWeb()
            }
            return new Response(gzipSync(await file("./dist/index.html").arrayBuffer()), {
                headers: {
                    "Content-Type": "text/html",
                    "Cache-Control": "no-cache",
                    "Content-Encoding": "gzip",
                }
            })
        },

        "/assets/:file": async (req: BunRequest<"/assets/:file">) => {
            const reqFile = file(`./dist/${req.params.file}`)
            return new Response(gzipSync(await reqFile.arrayBuffer()), {
                headers: {
                    "Content-Type": reqFile.type,
                    "Cache-Control": "public, max-age=31536000",
                    "Content-Encoding": "gzip",
                }
            })
        },

        "/public/:file": async (req: BunRequest<"/public/:file">) => {
            const reqFile = file(`./public/${req.params.file}`)
            let fileRes = await reqFile.text()

            fileRes = fileRes.replace("{{LANYARD}}", `${JSON.stringify({ example: "lanyard data" })}`)
            fileRes = fileRes.replace("{{HYPERATE}}", `${JSON.stringify({ example: "hyperate data" })}`)

            return new Response(gzipSync(fileRes), {
                headers: {
                    "Content-Type": reqFile.type,
                    "Cache-Control": "public, max-age=31536000",
                    "Content-Encoding": "gzip",
                }
            })
        },

        "/public/font/:file": async (req: BunRequest<"/public/font/:file">) => {
            const reqFile = file(`./public/font/${req.params.file}`)
            return new Response(gzipSync(await reqFile.arrayBuffer()), {
                headers: {
                    "Content-Type": reqFile.type,
                    "Cache-Control": "public, max-age=31536000",
                    "Content-Encoding": "gzip",
                }
            })
        },

        "/api/server": () => {
            const string = JSON.stringify(process)
            const json = JSON.parse(string)

            // clear possibly data that could be sensitive
            json.argv = {}
            json.debugPort = 0
            json.env = {}
            json.execArgv = []
            json.execPath = ""
            json.stderr = {}
            json.stdin = {}
            json.stdout = {}
            json.title = ""

            json.availableMemory = process.availableMemory()
            json.constrainedMemory = process.constrainedMemory()
            json.cpuUsage = process.cpuUsage()
            json.memoryUsage = process.memoryUsage()
            json.uptime = process.uptime()
            json.package = pkg

            return new Response(gzipSync(JSON.stringify({ data: json })), {
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "Content-Encoding": "gzip",
                }
            })
        },
        "/api/health": () => {
            return new Response(gzipSync(JSON.stringify({ data: "ok" })), {
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "Content-Encoding": "gzip",
                }
            })
        },
        "/api/ws": (req, server) => {
            if (server.upgrade(req)) {
                return;
            }

            return new Response("Upgrade failed", { status: 500 });
        },
        "/api/gc": async (req, server) => {
            gc(true)

            return new Response(gzipSync(JSON.stringify({ data: "triggered" })), {
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "Content-Encoding": "gzip",
                }
            })
        },
        "/api/script.js": async () => {
            const req = await fetch("https://plausible.creations.works/js/script.js")
            const script = await req.text()

            return new Response(gzipSync(script), {
                headers: {
                    "Content-Type": "application/javascript",
                    "Content-Encoding": "gzip",
                    "Cache-Control": "public, max-age=31536000",
                }
            })
        },
        "/api/script": async (req) => {
            const request = new Request(req);
            request.headers.delete('cookie');
            return await fetch("https://plausible.creations.works/api/event", request);
        }
    },
    websocket: {
        open: async (ws) => {
            ws.subscribe("lanyard");
            ws.send(JSON.stringify({ type: "lanyard", data: lanyard }), true);

            ws.subscribe("hyperate");
            ws.send(JSON.stringify({ type: "hyperate", data: { hr: heartrate } }), true);
        },
        message: async (ws, message) => {
            ws.send(JSON.stringify({ type: "echo", data: message }), true)
        }
    },
    development,
    port: 3000,
});

const lanyardSocket = new WebSocket("wss://lanyard.creations.works/socket");

const setLanyard = (data: object) => {
    lanyard = data;

    return webserver.publish("lanyard", JSON.stringify({ type: "lanyard", data }), true);
}

lanyardSocket.onmessage = ({ data }) => {
    data = JSON.parse(data);

    switch (data.op) {
        case 0: {
            setLanyard(data.d)
            break;
        }
        case 1: {
            lanyardSocket.send(JSON.stringify({
                op: 2,
                d: {
                    subscribe_to_id: "1273447359417942128"
                }
            }))
            break;
        }
    }
}

const hyperate = new WebSocket(
    "wss://app.hyperate.io/socket/websocket?token=wv39nM6iyrNJulvpmMQrimYPIXy2dVrYRjkuHpbRapKT2VSh65ngDGHdCdCtmEN9",
);

let hrTimeout: ReturnType<typeof setTimeout>;

const setHeartrate = async (hr: number) => {
    heartrate = hr;

    return webserver.publish("hyperate", JSON.stringify({ type: "hyperate", data: { hr } }), true);
}

const setHrInterval = () => {
    hrTimeout = setTimeout(() => {
        setHeartrate(0);
    }, 6000);
};

hyperate.onopen = () => {
    hyperate.send(
        JSON.stringify({
            topic: "hr:0BCA",
            event: "phx_join",
            payload: {},
            ref: 0,
        }),
    );

    setInterval(() => {
        hyperate.send(
            JSON.stringify({
                topic: "phoenix",
                event: "heartbeat",
                payload: {},
                ref: 0,
            }),
        );
    }, 10000);

    return setHrInterval();
};

hyperate.onmessage = ({ data }) => {
    const { event, payload } = JSON.parse(data);
    switch (event) {
        case "hr_update": {
            clearTimeout(hrTimeout);
            setHrInterval();
            setHeartrate(payload.hr);
            break;
        }
        default: {
            break;
        }
    }
};