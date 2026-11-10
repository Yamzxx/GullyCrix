import re

with open('app_extracted_code.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Search for Matches, Stats, Profile links
for m in re.finditer(r'["\']\/(?:matches|stats|profile)["\']', code):
    pos = m.start()
    print("Match at pos:", pos)
    print(code[max(0, pos-200):min(len(code), pos+300)])
    print("=" * 50)
