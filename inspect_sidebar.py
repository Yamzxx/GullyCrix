with open('app_extracted_code.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Let's inspect mC (Sidebar)
pos_mC = code.find('function mC()')
print("--- Sidebar mC ---")
print(code[pos_mC:pos_mC + 1500])

