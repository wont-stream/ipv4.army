console.log("-----------------------------------");

await Bun.$`bun docs:build`;

console.log("-----------------------------------");

await import("./index.ts");

console.log("-----------------------------------");