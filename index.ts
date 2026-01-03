import index from "./index.html";

Bun.serve({
  port: 9176,
  routes: {
    "/": index,
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log("Server running at http://localhost:9176");
