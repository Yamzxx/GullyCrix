import re

with open('extracted_index.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Let's search for router configuration (e.g. wouter, react-router, tanstack)
print("Router hints:")
for match in re.finditer(r'(?:path|href):\s*["\']([^"\']+)["\']', js):
    print(" ", match.group(0))

print("\nLocalStorage keys:")
for match in re.finditer(r'localStorage\.(?:getItem|setItem)\(["\']([^"\']+)["\']', js):
    print(" ", match.group(0))

print("\nAudio/sounds:")
for match in re.finditer(r'(AudioContext|webkitAudioContext|oscillator|sound|synth)', js, re.IGNORECASE):
    print(" ", match.group(0))
