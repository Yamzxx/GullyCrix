with open('extracted_index.js', 'r', encoding='utf-8') as f:
    js = f.read()

pos = js.find('path:"/profile"')
print("Snippet around path: /profile:")
print(js[max(0, pos-400):min(len(js), pos+400)])
