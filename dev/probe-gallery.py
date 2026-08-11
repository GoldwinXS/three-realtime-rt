"""Screenshot a probe-gallery-bisect.html variant on hardware GL.

Usage: python dev/probe-gallery.py <name> "<query-params>" [seconds]
Example: python dev/probe-gallery.py fox-base "scene=fox" 10
Requires a dev server on PORT (default 8127): npx vite --port 8127 --strictPort
Writes bis-<name>.png to the CWD and prints pageerrors.
"""
import asyncio, sys
from playwright.async_api import async_playwright

PORT = 8133
INIT = ("Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });"
        " Object.defineProperty(document, 'hidden', { get: () => false });")

async def main():
    name = sys.argv[1]
    params = sys.argv[2]
    seconds = float(sys.argv[3]) if len(sys.argv) > 3 else 10
    async with async_playwright() as pw:
        b = await pw.chromium.launch(headless=True, args=["--use-angle=gl"])
        page = await b.new_page(viewport={"width": 900, "height": 650})
        await page.add_init_script(INIT)
        errs = []
        page.on("pageerror", lambda e: errs.append(str(e)))
        url = f"http://127.0.0.1:{PORT}/dev/probes/probe-gallery-bisect.html?{params}"
        await page.goto(url, wait_until="load", timeout=60000)
        await page.wait_for_timeout(int(seconds * 1000))
        hud = await page.evaluate("document.getElementById('hud').textContent")
        await page.screenshot(path=f"bis-{name}.png")
        print(name, "|", hud.replace("\n", " "))
        print("pageerrors:", errs[:5] if errs else "none")
        await b.close()

asyncio.run(main())
