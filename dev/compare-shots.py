"""Compare two mosquito screenshots pixel by pixel."""
from PIL import Image

img1 = Image.open("bis-mosq-base.png")      # default (refraction ON)
img2 = Image.open("bis-mosq-norefr.png")    # refraction OFF

w, h = img1.size
diff_count = 0
max_diff = 0
total_abs_diff = 0.0
total_pixels = w * h

for y in range(0, h, 5):  # sample every 5th pixel for speed
    for x in range(0, w, 5):
        p1 = img1.getpixel((x, y))
        p2 = img2.getpixel((x, y))
        d = abs(int(p1[0]) - int(p2[0])) + abs(int(p1[1]) - int(p2[1])) + abs(int(p1[2]) - int(p2[2]))
        total_abs_diff += d
        if d > 0:
            diff_count += 1
            if d > max_diff:
                max_diff = d

sampled = (w // 5) * (h // 5)
pct = 100 * diff_count / sampled

print(f"Resolution: {w}x{h}")
print(f"Samples: {sampled} (every 5th pixel)")
print(f"Pixels with ANY difference: {diff_count} ({pct:.1f}%)")
print(f"Max per-pixel absolute diff (R+G+B): {max_diff}")
print(f"Mean absolute diff per sample (R+G+B): {total_abs_diff/sampled:.2f}")

# Check specific amber region
print("\nAmber region detail (every pixel):")
amber_count = 0
amber_diff = 0
for y in range(int(h * 0.25), int(h * 0.45)):
    for x in range(int(w * 0.35), int(w * 0.65)):
        p1 = img1.getpixel((x, y))
        p2 = img2.getpixel((x, y))
        d = abs(int(p1[0]) - int(p2[0])) + abs(int(p1[1]) - int(p2[1])) + abs(int(p1[2]) - int(p2[2]))
        if d > 0:
            amber_diff += 1
        amber_count += 1

print(f"  Amber region pixels: {amber_count}")
print(f"  Amber region pixels with diff: {amber_diff} ({100*amber_diff/amber_count:.1f}%)")
