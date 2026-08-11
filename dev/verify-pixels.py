"""Verify pixel evidence for each bug fix."""
from PIL import Image
import os

out = "_reviews/model-fixes"

def sample_region(img, x_range, y_range):
    """Sample pixels in a region and return stats."""
    samples = []
    for y in y_range:
        for x in x_range:
            px = img.getpixel((x, y))
            samples.append(px)
    r_avg = sum(p[0] for p in samples) / len(samples)
    g_avg = sum(p[1] for p in samples) / len(samples)
    b_avg = sum(p[2] for p in samples) / len(samples)
    # Count dark pixels (all channels < 15)
    dark = sum(1 for p in samples if p[0] < 15 and p[1] < 15 and p[2] < 15)
    # Count NaN-like (all channels 0)
    black = sum(1 for p in samples if p[0] == 0 and p[1] == 0 and p[2] == 0)
    return (r_avg, g_avg, b_avg, len(samples), dark, black)

print("=" * 60)
print("BUG 1: Fox normal-less geometry")
print("=" * 60)

fox_base = Image.open(os.path.join(out, "bis-fox-base.png"))
fox_nodenoise = Image.open(os.path.join(out, "bis-fox-nodenoise.png"))
w, h = fox_base.size

# Fox should be in the center of the image
fox_x = range(int(w*0.3), int(w*0.7), 5)
fox_y = range(int(h*0.2), int(h*0.7), 5)
base_stats = sample_region(fox_base, fox_x, fox_y)
noise_stats = sample_region(fox_nodenoise, fox_x, fox_y)
print(f"Fox with denoise:  avg=({base_stats[0]:.0f},{base_stats[1]:.0f},{base_stats[2]:.0f}), dark={base_stats[4]}/{base_stats[3]}, black={base_stats[5]}")
print(f"Fox without denoise: avg=({noise_stats[0]:.0f},{noise_stats[1]:.0f},{noise_stats[2]:.0f}), dark={noise_stats[4]}/{noise_stats[3]}, black={noise_stats[5]}")
# The fox should be ORANGE (high R+G, low B), not black
fox_is_orange = base_stats[0] > 80 and base_stats[1] > 50
print(f"Fox is orange (not black): {fox_is_orange}, dark pixels: {base_stats[4]}/{base_stats[3]} ({100*base_stats[4]/base_stats[3]:.1f}%)")
print(f"VERDICT: {'PASS' if fox_is_orange and base_stats[4] < base_stats[3]*0.1 else 'FAIL'}")

print()
print("=" * 60)
print("BUG 2: WaterBottle denoiser black blobs")
print("=" * 60)

bottle_base = Image.open(os.path.join(out, "bis-bottle-base.png"))
bottle_nodenoise = Image.open(os.path.join(out, "bis-bottle-nodenoise.png"))

# WaterBottle label band area (middle of the bottle)
bottle_x = range(int(w*0.35), int(w*0.65), 3)
bottle_y = range(int(h*0.4), int(h*0.6), 3)
bl_stats = sample_region(bottle_base, bottle_x, bottle_y)
bln_stats = sample_region(bottle_nodenoise, bottle_x, bottle_y)
print(f"Bottle denoise 2:  avg=({bl_stats[0]:.0f},{bl_stats[1]:.0f},{bl_stats[2]:.0f}), black={bl_stats[5]}/{bl_stats[3]}")
print(f"Bottle denoise off: avg=({bln_stats[0]:.0f},{bln_stats[1]:.0f},{bln_stats[2]:.0f}), black={bln_stats[5]}/{bln_stats[3]}")
# With denoise 2, there should be NO black pixels (the bug would show black blobs)
blobs_ok = bl_stats[5] < 5
print(f"No black blobs in label band: {blobs_ok}")
print(f"VERDICT: {'PASS' if blobs_ok else 'FAIL'}")

print()
print("=" * 60)
print("BUG 3: MosquitoInAmber transmission opacity")
print("=" * 60)

mosq_base = Image.open(os.path.join(out, "bis-mosq-base.png"))
mosq_full = Image.open(os.path.join(out, "bis-mosq-fullglass.png"))
mosq_noden = Image.open(os.path.join(out, "bis-mosq-nodenoise.png"))

# Amber region
amber_x = range(int(w*0.35), int(w*0.65), 3)
amber_y = range(int(h*0.25), int(h*0.45), 3)
amb_stats = sample_region(mosq_base, amber_x, amber_y)
full_stats = sample_region(mosq_full, amber_x, amber_y)
noden_stats = sample_region(mosq_noden, amber_x, amber_y)
print(f"Mosq baseline (tx=0.75):     avg=({amb_stats[0]:.0f},{amb_stats[1]:.0f},{amb_stats[2]:.0f})")
print(f"Mosq fullglass (tx=1.0):     avg=({full_stats[0]:.0f},{full_stats[1]:.0f},{full_stats[2]:.0f})")
print(f"Mosq denoise off (tx=0.75):  avg=({noden_stats[0]:.0f},{noden_stats[1]:.0f},{noden_stats[2]:.0f})")
# With the fix, the amber should be more transparent (darker, showing background)
# The full glass (tx=1.0) should be notably different from baseline
tx1_is_lighter = full_stats[0] < amb_stats[0] - 20
print(f"Full glass is visibly different from baseline: {tx1_is_lighter}")
print(f"VERDICT: {'PASS' if tx1_is_lighter else 'FAIL (may need visual check)'}")

# Additional: the amber in full glass should show more of the dark background
# (less amber color), making it darker overall
print()
print("Manual visual review of bis-mosq-fullglass.png vs bis-mosq-base.png required")
print("to confirm amber translucency improvement.")
