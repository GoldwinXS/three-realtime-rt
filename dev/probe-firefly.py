"""Firefly bench driver — runs probe-firefly*.html pages via Playwright.

Usage:
  python dev/probe-firefly.py <scene> [--gi-off] [--source gallery|museum|game]
  python dev/probe-firefly.py fox                # gallery scene, GI on
  python dev/probe-firefly.py museum --gi-off     # museum, GI off
  python dev/probe-firefly.py arena --source game # game scene, GI on

Requires a dev server on PORT (default 8127).
"""
import asyncio, sys, json, time, os
from pathlib import Path
from playwright.async_api import async_playwright

PORT = int(os.environ.get("RT_PORT", "8127"))
INIT = ("Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });"
        " Object.defineProperty(document, 'hidden', { get: () => false });")
WARM = 90
TEMPORAL_N = 60

def pick_url(scene, gi_off, source, tune=None):
    if source == "museum":
        page_path = "probe-firefly-museum.html"
    elif source == "game":
        page_path = "game-bench.html"
        params = f"scene={scene}&autorun=1&mode=bench"
        if gi_off:
            params += "&tune=giEnabled:false"
        if tune:
            sep = "," if gi_off else ""
            prefix = "" if gi_off else "&tune="
            params += f"{prefix}{sep}{tune}" if gi_off else f"&tune={tune}"
        return f"http://127.0.0.1:{PORT}/{page_path}?{params}"
    else:
        page_path = "probe-firefly.html"
    params = f"scene={scene}&warm={WARM}&temporalN={TEMPORAL_N}"
    if gi_off:
        params += "&giOff=1"
    if tune:
        for part in tune.split(","):
            kv = part.split(":", 1)
            if len(kv) == 2:
                params += f"&{kv[0]}={kv[1]}"
    return f"http://127.0.0.1:{PORT}/{page_path}?{params}"

async def main():
    scene = sys.argv[1]
    gi_off = "--gi-off" in sys.argv
    tune = None
    source = "gallery"
    for i, arg in enumerate(sys.argv):
        if arg == "--source" and i + 1 < len(sys.argv):
            source = sys.argv[i + 1]
        if arg == "--tune" and i + 1 < len(sys.argv):
            tune = sys.argv[i + 1]

    async with async_playwright() as pw:
        b = await pw.chromium.launch(headless=True, args=["--use-angle=gl"])
        viewport = {"width": 900, "height": 650}
        page = await b.new_page(viewport=viewport)
        await page.add_init_script(INIT)
        errs = []
        page.on("pageerror", lambda e: errs.append(str(e)))

        url = pick_url(scene, gi_off, source, tune)
        label = f"{scene}-gi{'off' if gi_off else 'on'}"
        print(f"--- {label} ---", flush=True)
        print(f"url: {url}", flush=True)

        await page.goto(url, wait_until="load", timeout=120000)

        # Wait for the probe to finish (look for "DONE" in the HUD, or the result on window)
        timeout = 300  # seconds
        t0 = time.time()
        result = None
        while time.time() - t0 < timeout:
            await asyncio.sleep(2)
            # Try to read the result
            try:
                hud_text = await page.evaluate(
                    "document.getElementById('hud')?.textContent || ''"
                )
            except Exception:
                hud_text = ""
            if "DONE" in hud_text or "FAILED" in hud_text:
                print(hud_text, flush=True)
                # Extract result from window.FIREFLY_RESULT for gallery/museum probes
                try:
                    result = await page.evaluate("window.FIREFLY_RESULT || null")
                except Exception:
                    pass
                # For game-bench, extract from window.GAME_BENCH_RESULT
                try:
                    gbr = await page.evaluate("window.GAME_BENCH_RESULT || null")
                    if gbr:
                        result = gbr
                except Exception:
                    pass
                break
            # Also check for game-bench completion
            try:
                status = await page.evaluate(
                    "document.getElementById('status')?.textContent || ''"
                )
            except Exception:
                status = ""
            if "done" in status.lower():
                hud = await page.evaluate(
                    "document.getElementById('hud')?.textContent || "
                    "document.getElementById('out')?.textContent || ''"
                )
                print(hud, flush=True)
                try:
                    result = await page.evaluate("window.GAME_BENCH_RESULT || null")
                except Exception:
                    pass
                break

        if result:
            print(json.dumps(result, indent=2, default=str))
        else:
            print("TIMEOUT — no result captured", flush=True)
            # Dump HUD as fallback
            try:
                hud = await page.evaluate(
                    "document.getElementById('hud')?.textContent || "
                    "document.getElementById('out')?.textContent || "
                    "document.getElementById('status')?.textContent || ''"
                )
                print("HUD:", hud)
            except Exception:
                pass

        print(f"pageerrors: {errs[:5] if errs else 'none'}")
        await b.close()

asyncio.run(main())
