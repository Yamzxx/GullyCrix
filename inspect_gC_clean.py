# Let's inspect gC in extracted_index.js
with open("extracted_index.js", "r", encoding="utf-8") as f:
    js = f.read()

pos_gC = js.find("function gC({children:n})")
print("gC code:")
print(js[pos_gC:pos_gC+1500])
