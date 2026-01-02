import build from "./build";
import { rm } from "node:fs/promises";

await rm("./dist", { recursive: true, force: true });
const built = await build();

const javascript = built.outputs.filter((output) =>
  output.path.endsWith(".js"),
)[0];
const css = built.outputs.filter((output) => output.path.endsWith(".css"))[0];

Bun.serve({
  fetch: async (req) => {
    const url = new URL(req.url);
    const { pathname } = url;

    if (pathname === "/") {
      return new Response(Bun.file("./dist/index.html"));
    }

    if (pathname.startsWith("/chunk")) {
      const isMap = pathname.endsWith(".map");
      const isJs = pathname.endsWith(".js");
      const isCss = pathname.endsWith(".css");

      let path = "";
      if (isMap) {
        path = `${javascript?.path}.map` || "";
      }
      if (isJs) {
        path = javascript?.path || "";
      }
      if (isCss) {
        path = css?.path || "";
      }

      return new Response(Bun.file(path), {
        headers: {
          "cache-control": "public, max-age=31536000, immutable",
        },
      });
    }

    const publicFile = Bun.file(`./src/public${pathname}`);

    if (await publicFile.exists()) {
      return new Response(publicFile);
    }

    return new Response("Not Found", { status: 404 });
  },
});
