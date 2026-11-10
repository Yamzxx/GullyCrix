with open('app_extracted_code.js', 'r', encoding='utf-8') as f:
    code = f.read()

pos = code.find('function SC()')
print(code[pos:pos+3500])
