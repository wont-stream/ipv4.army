import { PurgeCSS } from "purgecss";

const built = await Bun.build({
    entrypoints: ["./src/index.html"],
    outdir: "./dist",
    minify: true,
})

const js = built.outputs.find((output) => output.path.endsWith(".js"))
const css = built.outputs.find((output) => output.path.endsWith(".css"))?.hash

const purgeCSSResults = await new PurgeCSS().purge({
    content: ["dist/index.html", `dist/chunk-${js?.hash}.js`],
    css: [`dist/chunk-${css}.css`],
});

for await (const result of purgeCSSResults) {
    await Bun.write(result.file || "", result.css);
}

let html = await built.outputs.find((output) => output.path.endsWith(".html"))?.text() || ""

html = html.replace(`<link rel="stylesheet" crossorigin href="./chunk-${css}.css">`, `<style>${purgeCSSResults[0]?.css}</style>`);
html = html.replace(`<script type="module" crossorigin src="./chunk-${js?.hash}.js"></script>`, `<script>${await js?.text()}</script>`);

await Bun.write("dist/index.html", html);