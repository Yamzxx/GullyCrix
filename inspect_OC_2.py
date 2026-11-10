with open('app_extracted_code.js', 'r', encoding='utf-8') as f:
    code = f.read()

pos = code.find('function OC()')
print(code[pos+2500:pos+5500])

