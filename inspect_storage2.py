import re

with open('extracted_index.js', 'r', encoding='utf-8') as f:
    js = f.read()

for m in re.finditer(r'Storage', js):
    start = max(0, m.start() - 60)
    end = min(len(js), m.end() + 80)
    print(js[start:end])

