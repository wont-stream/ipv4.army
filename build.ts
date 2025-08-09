await Bun.$`bun docs:build`;

await Bun.build({
	entrypoints: ["index.ts"],
	outdir: "dist",
	target: "bun",
	env: "inline",
	minify: true,
});

Bun.gc(true);

await import("./dist/index.js");
