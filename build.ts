await Bun.$`bun docs:build`;

await Bun.build({
	entrypoints: ["index.ts"],
	outdir: "dist",
	target: "bun",
	format: "cjs",
	env: "inline",
	minify: true,
	bytecode: true,
});

console.clear();

Bun.gc(true);

await import("./dist/index.js");
