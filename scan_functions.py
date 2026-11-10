import re

with open('app_extracted_code.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")

# Let's search for function declarations or key words
for i, line in enumerate(lines):
    # find functions defined at outer level
    m = re.match(r'^(?:export\s+)?function\s+([A-Za-z0-9_]+)\s*\(', line)
    if m:
        name = m.group(1)
        # print first line or two
        preview = line.strip()[:80]
        # if name is interesting or at intervals
        if any(w in lines[min(len(lines)-1, i+1)] + lines[min(len(lines)-1, i+2)] for w in ['return', 'jsx', 'useState', 'useEffect']):
            pass
        print(f"L{i+1}: function {name}")
