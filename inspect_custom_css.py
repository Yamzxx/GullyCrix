import re

with open('extracted_index.css', 'r', encoding='utf-8') as f:
    css = f.read()

custom_classes = set(re.findall(r'\.([a-zA-Z0-9_\-]+)\s*\{', css))
interesting = [c for c in custom_classes if not c.startswith(('tw-', 'lucide-', 'radix-'))]
print("Interesting custom classes:", sorted(interesting)[:50])

# Look for .pitch-bg, .mow, etc.
for cls in ['pitch-bg', 'mow', 'press', 'pitch-stripes', 'seam']:
    pos = css.find('.' + cls)
    if pos != -1:
        print(f"\nRule for .{cls}:")
        print(css[pos:css.find('}', pos) + 1])

