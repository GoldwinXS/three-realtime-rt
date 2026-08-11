"""Diagnose mosquito material properties in the browser. Port 8115."""
import asyncio
from playwright.async_api import async_playwright

PORT = 8115
INIT = ("Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });"
        " Object.defineProperty(document, 'hidden', { get: () => false });")

async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(headless=True, args=["--use-angle=gl"])
        page = await b.new_page(viewport={"width": 900, "height": 650})
        await page.add_init_script(INIT)
        errs = []
        page.on("pageerror", lambda e: errs.append(str(e)))
        url = f"http://127.0.0.1:{PORT}/probe-gallery-bisect.html?scene=mosquito"
        print("Loading:", url)
        await page.goto(url, wait_until="networkidle", timeout=90000)
        await page.wait_for_timeout(12000)
        print("pageerrors:", errs[:10] if errs else "none")

        # Check if probeScene exists
        hasScene = await page.evaluate("typeof window.probeScene !== 'undefined'")
        hasRt = await page.evaluate("typeof window.rt !== 'undefined'")
        print(f"hasScene={hasScene} hasRt={hasRt}")

        if not hasScene:
            # Try to get error content
            body = await page.evaluate("document.body?.innerText?.substring(0, 500) || 'no body'")
            print("BODY:", body[:300])
            await b.close()
            return

        diag = await page.evaluate("""() => {
            const lines = [];
            window.probeScene.traverse((obj) => {
                if (!obj.isMesh || !obj.geometry) return;
                const mat = Array.isArray(obj.material) ? obj.material[0] : obj.material;
                if (!mat) return;
                lines.push({
                    name: obj.name || "(unnamed)",
                    type: mat.type,
                    transparent: mat.transparent,
                    opacity: mat.opacity,
                    transmission: mat.transmission,
                    ior: mat.ior,
                    roughness: mat.roughness,
                    color: mat.color ? [mat.color.r, mat.color.g, mat.color.b] : null,
                    hasMap: !!mat.map,
                    side: mat.side,
                    visible: obj.visible,
                });
            });
            return lines;
        }""")
        for l in diag:
            print(l)
        await page.screenshot(path="bis-mosq-diag.png")
        print("screenshot saved to bis-mosq-diag.png")
        await b.close()

asyncio.run(main())
