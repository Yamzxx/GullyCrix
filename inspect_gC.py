with open('app_extracted_code.js', 'r', encoding='utf-8') as f:
    code = f.read()

pos = code.find('function gC({ children: n })')
print(code[pos:pos+3500])

