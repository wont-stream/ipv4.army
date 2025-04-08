import index from "./src/index.html";

Bun.serve({
    routes: {
        "/": index,
    },
    development: true,
});

console.log("Server started on http://localhost:3000");