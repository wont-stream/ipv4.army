import postcssPurge from "@fullhuman/postcss-purgecss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcss from "postcss";
import postcssImport from "postcss-import";

import { $, build, file, write } from "bun";
import { unlink } from "node:fs/promises";

const pages = ["default", "artist"];

for (const page of pages) {
	const dirName = page === "default" ? "" : `-${page}`;
	const fileName = dirName === "" ? "index" : page;

	try {
		await $`rm -rf ./dist/${fileName}.html`;
	} catch (_) {}

	let html = await file(`./src${dirName}/index.html`).text();

	const js = await build({
		entrypoints: [`./src${dirName}/index.tsx`],
		format: "esm",
		minify: true,
	});

	if (!js.success) {
		console.error(js.logs);
		process.exit(1);
	}

	const jsOut = await js.outputs[0].text();

	html = html.replace(
		`<script src="./index.tsx"></script>`,
		`<script>${jsOut}</script>`,
	);

	write(`./dist/${fileName}.js`, jsOut);

	const postCss = postcss([
		autoprefixer(),
		postcssImport(),
		postcssPurge({
			content: [`./src${dirName}/index.html`, `./dist/${fileName}.js`],
		}),
		cssnano({ preset: "default" }),
	]);

	const { css } = await postCss.process(
		await file(`./src${dirName}/index.css`).text(),
		{
			to: undefined,
			from: undefined,
		},
	);

	await unlink(`./dist/${fileName}.js`);

	html = html.replace(
		`<link href="./index.css" rel="stylesheet">`,
		`<style>${css}</style>`,
	);

	await write(`./dist/${fileName}.html`, html);
}
