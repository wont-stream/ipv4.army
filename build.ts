console.log("-----------------------------------");

await Bun.$`bun docs:build`;

console.log("-----------------------------------");

Bun.gc(true);

await import("./index.ts");
