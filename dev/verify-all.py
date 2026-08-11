"""Comprehensive pixel verification for all three bug fixes."""
from PIL import Image
import os

out = "_reviews/model-fixes"

def rgb(r, g, b):
    return (r, g, b)

def sample_avg(img, x_range, y_range):
    r_sum = g_sum = b_sum = 0
    count = 0
    for y in y_range:
        for x in x_range:
            px = img.getpixel((x, y))
            r_sum += px[0]; g_sum += px[1]; b_sum += px[2]
            count += 1
    return (r_sum/count, g_sum/count, b_sum/count)

def is_amber(r, g, b):
    """Amber = high R, medium G, low B."""
    return r > 150 and g > 80 and g < 180 and b < 100 and r > b * 1.5

def is_gray(r, g, b):
    """Gray = all channels similar."""
    mx = max(r, g, b)
    mn = min(r, g, b)
    return mx - mn < 40

results = {}

# ===== BUG 1: Fox =====
print("BUG 1: Fox (normal-less geometry)")
fox_base = Image.open(os.path.join(out, "bis-fox-base.png"))
fox_nodenoise = Image.open(os.path.join(out, "bis-fox-nodenoise.png"))
w, h = fox_base.size

# Count amber pixels (the fox is orange/amber) vs black pixels
fox_amber = 0
fox_black = 0
fox_total = 0
for y in range(int(h*0.25), int(h*0.7), 4):
    for x in range(int(w*0.3), int(w*0.7), 4):
        px = fox_base.getpixel((x, y))
        fox_total += 1
        if is_amber(*px):
            fox_amber += 1
        if px[0] < 15 and px[1] < 15 and px[2] < 15:
            fox_black += 1

fx_avg = sample_avg(fox_base, range(int(w*0.3), int(w*0.7), 3), range(int(h*0.25), int(h*0.7), 3))
print(f"  Fox denoise ON: avg=({fx_avg[0]:.0f},{fx_avg[1]:.0f},{fx_avg[2]:.0f})")
print(f"  Fox amber pixels: {fox_amber}/{fox_total} ({100*fox_amber/fox_total:.0f}%)")
print(f"  Fox black pixels: {fox_black}/{fox_total} ({100*fox_black/fox_total:.0f}%)")
bug1_pass = fox_black < fox_total * 0.05
print(f"  VERDICT: {'PASS' if bug1_pass else 'FAIL'} (expect <5% black)\n")
results["bug1"] = bug1_pass

# ===== BUG 2: WaterBottle =====
print("BUG 2: WaterBottle (denoiser NaN spread)")
bottle_base = Image.open(os.path.join(out, "bis-bottle-base.png"))
# Sample the label band area where blobs appeared
bottle_black = 0
bottle_total = 0
for y in range(int(h*0.35), int(h*0.65), 3):
    for x in range(int(w*0.3), int(w*0.7), 3):
        px = bottle_base.getpixel((x, y))
        bottle_total += 1
        # "Black blob" = very dark non-background pixel
        if px[0] < 10 and px[1] < 10 and px[2] < 10:
            bottle_black += 1

bl_avg = sample_avg(bottle_base, range(int(w*0.35), int(w*0.65), 3), range(int(h*0.4), int(h*0.6), 3))
print(f"  Bottle label band avg: ({bl_avg[0]:.0f},{bl_avg[1]:.0f},{bl_avg[2]:.0f})")
print(f"  Bottle black pixels in label band: {bottle_black}/{bottle_total}")
bug2_pass = bottle_black < 10
print(f"  VERDICT: {'PASS' if bug2_pass else 'FAIL'} (expect <10 black px)\n")
results["bug2"] = bug2_pass

# ===== BUG 3: MosquitoInAmber =====
print("BUG 3: MosquitoInAmber (transmission opacity)")
mosq_base = Image.open(os.path.join(out, "bis-mosq-base.png"))
mosq_full = Image.open(os.path.join(out, "bis-mosq-fullglass.png"))

# Check the amber region for color type
amber_gray_base = 0
amber_amber_base = 0
amber_gray_full = 0
amber_total = 0
for y in range(int(h*0.25), int(h*0.50), 3):
    for x in range(int(w*0.30), int(w*0.70), 3):
        amber_total += 1
        pb = mosq_base.getpixel((x, y))
        pf = mosq_full.getpixel((x, y))
        if is_gray(*pb): amber_gray_base += 1
        if is_amber(*pb): amber_amber_base += 1
        if is_gray(*pf): amber_gray_full += 1

amb_avg = sample_avg(mosq_base, range(int(w*0.35), int(w*0.65), 3), range(int(h*0.25), int(h*0.45), 3))
full_avg = sample_avg(mosq_full, range(int(w*0.35), int(w*0.65), 3), range(int(h*0.25), int(h*0.45), 3))
print(f"  Amber region base (tx=0.75) avg: ({amb_avg[0]:.0f},{amb_avg[1]:.0f},{amb_avg[2]:.0f})")
print(f"  Amber region full (tx=1.0)  avg: ({full_avg[0]:.0f},{full_avg[1]:.0f},{full_avg[2]:.0f})")
print(f"  Base: gray={amber_gray_base}/{amber_total} ({100*amber_gray_base/amber_total:.0f}%)")
print(f"  Base: amber={amber_amber_base}/{amber_total} ({100*amber_amber_base/amber_total:.0f}%)")
print(f"  Full glass: gray={amber_gray_full}/{amber_total} ({100*amber_gray_full/amber_total:.0f}%)")

# The fix is successful if the amber region is GRAY (showing through to ground)
# instead of AMBER (double-tinted). Both should be predominantly gray now.
bug3_pass = amber_gray_base > amber_total * 0.4  # At least 40% gray
print(f"  VERDICT: {'PASS' if bug3_pass else 'FAIL'} (expect >40% gray pixels)\n")
results["bug3"] = bug3_pass

print("=" * 60)
all_pass = all(results.values())
print(f"OVERALL: {'ALL PASS' if all_pass else 'SOME FAILURES'}")
for bug, status in results.items():
    print(f"  {bug}: {'PASS' if status else 'FAIL'}")
