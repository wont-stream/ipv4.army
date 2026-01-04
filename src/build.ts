import { rm } from "node:fs/promises";

await rm("./dist", { recursive: true, force: true });

const opts: Bun.BuildConfig = {
	entrypoints: ["./src/web/index.html"],
	outdir: "./dist",
	minify: true,
	external: ["site.webmanifest"],
};

export const build = async () => {
	return await Bun.build(opts);
};
