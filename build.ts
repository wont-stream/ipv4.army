await Bun.$`bun docs:build`;

Bun.build({
	entrypoints: ["index.ts"],
	outdir: "dist",
	target: "bun",
	env: "inline",
	minify: true,
});
