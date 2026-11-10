with open('app_extracted_code.js', 'r', encoding='utf-8') as f:
    code = f.read()

for name in ['function Va', 'function _a', 'function ob']:
    pos = code.find(name)
    if pos != -1:
        print(f"=== {name} ===")
        print(code[pos:pos+1500])
