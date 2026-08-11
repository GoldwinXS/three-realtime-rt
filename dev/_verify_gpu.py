"""GPU verification script for three-realtime-rt v0.11.0 secondary-ray texture maps.
Runs headless Chromium with --use-angle=gl on the real GPU.
Captures screenshots and console errors for all three probe modes plus absorption.html.
"""
import json, os, sys, time
from playwright.sync_api import sync_playwright

BASE = "http://localhost:8122"
OUT = "_reviews/v011"
os.makedirs(OUT, exist_ok=True)

MODES = [
    ("probe-secondary-textures.html?mode=emissive", "probe-emissive"),
    ("probe-secondary-textures.html?mode=albedo", "probe-albedo"),
    ("probe-secondary-textures.html?mode=emissive&dynamic=1", "probe-emissive-dynamic"),
    ("absorption.html", "absorption-regression"),
]

results = {}

with sync_playwright() as pw:
    browser = pw.chromium.launch(
        headless=True,
        args=["--use-angle=gl", "--disable-gpu-sandbox"],
    )
    context = browser.new_context(
        viewport={"width": 1024, "height": 768},
    )
    # Force visibilityState to "visible" so rAF fires in headless.
    context.add_init_script("""
        Object.defineProperty(document, 'visibilityState', {get: () => 'visible', configurable: true});
        Object.defineProperty(document, 'hidden', {get: () => false, configurable: true});
        document.dispatchEvent(new Event('visibilitychange'));
    """)

    for url_path, label in MODES:
        url = f"{BASE}/{url_path}"
        print(f"\n=== {label} ===")
        print(f"  Loading {url}...")
        page = context.new_page()
        errors = []
        page.on("console", lambda msg: (
            errors.append(f"[{msg.type}] {msg.text}")
            if msg.type in ("error", "warning") else None
        ))

        try:
            page.goto(url, timeout=15000)
            # Wait 8 seconds for rendering to converge
            page.wait_for_timeout(8000)
        except Exception as e:
            print(f"  PAGE ERROR: {e}")

        # Screenshot
        shot = os.path.join(OUT, f"{label}.png")
        page.screenshot(path=shot)
        print(f"  Screenshot: {shot}")

        # Check console
        gl_errors = [e for e in errors if "error" in e.lower() or "GL_" in e or "compile" in e.lower()]
        warnings = [e for e in errors if "warn" in e.lower()]

        if gl_errors:
            print(f"  GL ERRORS ({len(gl_errors)}):")
            for e in gl_errors[:10]:
                print(f"    {e[:200]}")
        else:
            print("  No GL/shader errors.")

        if warnings:
            print(f"  WARNINGS ({len(warnings)}):")
            for w in warnings[:5]:
                print(f"    {w[:200]}")

        # Check the HUD for PASS/FAIL status
        try:
            status_text = page.evaluate("""
                () => {
                    const el = document.getElementById('status');
                    return el ? el.textContent : '';
                }
            """)
            print(f"  HUD status: {status_text}")
        except Exception:
            pass

        results[label] = {
            "screenshot": shot,
            "gl_errors": len(gl_errors),
            "warnings": len(warnings),
            "gl_error_texts": gl_errors[:5],
            "warning_texts": [w for w in warnings if "three-realtime-rt" in w.lower()][:5],
        }
        page.close()

    browser.close()

# Summary
print("\n" + "=" * 60)
print("VERIFICATION SUMMARY")
print("=" * 60)
all_pass = True
for label, r in results.items():
    status = "PASS" if r["gl_errors"] == 0 else f"FAIL ({r['gl_errors']} GL errors)"
    if r["gl_errors"] > 0:
        all_pass = False
    rt_warns = len(r.get("warning_texts", []))
    print(f"  {label}: {status}  |  screenshot: {r['screenshot']}")
    if rt_warns:
        print(f"    rt warnings: {r['warning_texts']}")
    if r["gl_errors"]:
        for e in r["gl_error_texts"]:
            print(f"    ERROR: {e[:200]}")

with open(os.path.join(OUT, "results.json"), "w") as f:
    json.dump(results, f, indent=2)

print(f"\nResults written to {OUT}/results.json")
if not all_pass:
    print("SOME TESTS FAILED — see above")
    sys.exit(1)
else:
    print("ALL TESTS PASSED")
