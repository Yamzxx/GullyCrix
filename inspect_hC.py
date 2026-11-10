import re

with open('app_extracted_code.js', 'r', encoding='utf-8') as f:
    code = f.read()

for m in re.finditer(r'hC', code):
    pos = m.start()
    print("Match at pos:", pos)
    print(code[max(0, pos-200):min(len(code), pos+500)])
    print("=" * 50)
