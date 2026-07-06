import { defineConfig } from "vite";
import fs from "node:fs";
import path from "node:path";

/**
 * Dev-only helper: POST base64 image data to /__shot?name=foo and it's saved to
 * .shots/foo.png. Lets automated tooling capture the WebGL canvas for visual
 * verification (page code: fetch('/__shot?name=x', {method:'POST', body: b64})).
 */
function shotSaver() {
  return {
    name: "shot-saver",
    configureServer(server) {
      server.middlewares.use("/__shot", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          return res.end("POST only");
        }
        const url = new URL(req.url, "http://localhost");
        const name = (url.searchParams.get("name") || "shot").replace(
          /[^a-z0-9_-]/gi,
          ""
        );
        let body = "";
        req.on("data", (c) => (body += c));
        req.on("end", () => {
          const dir = path.join(server.config.root, ".shots");
          fs.mkdirSync(dir, { recursive: true });
          const file = path.join(dir, `${name}.png`);
          fs.writeFileSync(file, Buffer.from(body, "base64"));
          res.end(file);
        });
      });
    },
  };
}

export default defineConfig({
  // Relative asset paths so the production build works when served from a
  // GitHub Pages project sub-path (https://user.github.io/three-realtime-rt/).
  base: "./",
  // The example uses top-level await; target a modern engine (WebGL2 already
  // requires one). esbuild's default "modules" target rejects TLA.
  build: { target: "esnext" },
  plugins: [shotSaver()],
  server: {
    host: "0.0.0.0",
    port: 8115,
    strictPort: true,
    // dev box is only reachable inside the tailnet/LAN; allow hostnames like "desktop"
    allowedHosts: true,
  },
});
