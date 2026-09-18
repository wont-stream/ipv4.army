import fs from "node:fs/promises";

await fs.cp("./public", "./dist/public", { recursive: true });
await fs.cp("./public", "./dist", { recursive: true });
