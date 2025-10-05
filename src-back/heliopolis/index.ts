import mime from "mime";

export const heliopolis = async (repo: string, branch: string, path: string) => {
    if (path.endsWith("/") || path === "") {
        path += "index.html";
    }

    const req = await fetch(`https://heliopolis.live/seth/${repo}/raw/${branch}${path}`, {
        redirect: "manual"
    })
    console.log(`https://heliopolis.live/seth/${repo}/raw/${branch}${path}`)

    if (req.status !== 200) {
        return new Response("File not found", { status: req.status });
    }

    const contentType = mime.getType(path) || "application/octet-stream";

    return new Response(await req.arrayBuffer(), {
        headers: {
            "Content-Type": contentType,
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
        },
    });
}