with open('app_extracted_code.js', 'r', encoding='utf-8') as f:
    code = f.read()

pos = code.find('function dT(')
print("dT (match validator):")
print(code[pos:pos+1500])

pos2 = code.find('function oa(')
print("\noa (match state reducer / calculator):")
print(code[pos2:pos2+1500])
