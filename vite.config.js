import { defineConfig } from "vite";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

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

/**
 * Dev-only helper: POST a benchmark results JSON to /__bench and it's saved to
 * bench-results/<ISO-timestamp>-<gitrev>.json. Keeps a dated, per-commit history
 * of benchmark runs (page code: fetch('/__bench', {method:'POST', body: json})).
 */
function benchSaver() {
  return {
    name: "bench-saver",
    configureServer(server) {
      server.middlewares.use("/__bench", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          return res.end("POST only");
        }
        let body = "";
        req.on("data", (c) => (body += c));
        req.on("end", () => {
          let rev = "nogit";
          try {
            rev = execSync("git rev-parse --short HEAD").toString().trim();
          } catch {
            /* not a git checkout — keep the "nogit" fallback */
          }
          const stamp = new Date().toISOString().replace(/:/g, "-");
          const dir = path.join(server.config.root, "bench-results");
          fs.mkdirSync(dir, { recursive: true });
          const file = path.join(dir, `${stamp}-${rev}.json`);
          fs.writeFileSync(file, body);
          res.end(file);
        });
      });
    },
  };
}

// Three-version matrix hook for the render self-test (scripts/selftest.mjs): with
// RT_THREE=latest, resolve every bare `three` (and `three/...` subpath, incl.
// `three/addons`) import to the `three-latest` devDependency (npm:three@latest)
// instead of the pinned 0.160.1, so the same demo runs against current three.
// three-mesh-bvh imports `three` too, so it is remapped as well — no dual-three.
// Unset (the default) the alias is absent and behaviour is byte-identical.
const RT_THREE_LATEST = process.env.RT_THREE === "latest";

export default defineConfig({
  // Relative asset paths so the production build works when served from a
  // GitHub Pages project sub-path (https://user.github.io/three-realtime-rt/).
  base: "./",
  ...(RT_THREE_LATEST
    ? {
        resolve: { alias: { three: "three-latest" } },
        // Isolate the dep-optimize cache so a concurrent default-three vite (the
        // selftest runs both at once) does not share node_modules/.vite — a
        // shared cache gets re-optimized for whichever config loaded last,
        // clobbering the other server's `three` resolution mid-serve.
        cacheDir: "node_modules/.vite-three-latest",
      }
    : {}),
  // The example uses top-level await; target a modern engine (WebGL2 already
  // requires one). esbuild's default "modules" target rejects TLA.
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        main: "index.html",
        gallery: "gallery.html",
        bench: "bench.html",
        harness: "harness.html",
      },
    },
  },
  // Only scan OUR entries. By default vite crawls every .html under root, which
  // pulls in RealTimeJSRayTracer/ (a git-ignored reference clone) whose bare
  // imports (vox-reader) aren't installed — failing dep optimization and
  // stalling the dev server.
  optimizeDeps: { entries: ["index.html", "gallery.html", "bench.html", "harness.html"] },
  plugins: [shotSaver(), benchSaver()],
  server: {
    host: "0.0.0.0",
    port: 8115,
    strictPort: true,
    // dev box is only reachable inside the tailnet/LAN; allow hostnames like "desktop"
    allowedHosts: true,
  },
});
