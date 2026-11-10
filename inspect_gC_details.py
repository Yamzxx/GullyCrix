with open('app_extracted_code.js', 'r', encoding='utf-8') as f:
    code = f.read()

pos_gC = code.find('function gC({ children: n })')
print("Snippet of gC:")
print(code[pos_gC:pos_gC + 2000])
