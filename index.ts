import { build, serve, gzipSync, file, type BunRequest, gc } from "bun";

import pkg from "./package.json";

const development = process.env.NODE_ENV === "development";

require("fs/promises").rm("./dist", { recursive: true, force: true }).catch(() => {
    // ignore
});

await build({
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

serve({
    routes: {
        "/": async () => {
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
        "/api/status": () => {
            return new Response(gzipSync(JSON.stringify({ data: process.uptime() })), {
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "Content-Encoding": "gzip",
                }
            })
        },
        "/api/gc": () => {
            gc(true)
            return new Response(gzipSync(JSON.stringify({ data: "triggered" })), {
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "Content-Encoding": "gzip",
                }
            })
        },
    },
    development,
    port: 3000,
});
