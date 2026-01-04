import { rm } from "node:fs/promises";

await rm("./dist", { recursive: true, force: true });

const opts: Bun.BuildConfig = {
	entrypoints: ["./src/web/index.html"],
	outdir: "./dist",
	minify: true,
	external: ["site.webmanifest", "<CSS>", "<JS>"],
};

export const build = async () => {
	const built = await Bun.build(opts);

	const files = {
		js: built.outputs.filter((output) => output.path.endsWith(".js"))[0],
		css: built.outputs.filter((output) => output.path.endsWith(".css"))[0],
	};

	const index = Bun.file("./dist/index.html");
	const data = await index.text();
	const newData = data
		.replace("<CSS>", `/chunk-${files.js?.hash}.js`)
		.replace("<JS>", `/chunk-${files.css?.hash}.css`);
	await Bun.write("./dist/index.html", newData);
	return { built, files };
};
