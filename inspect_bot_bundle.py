with open('public/assets/index-BJ4u41Uh.js', 'r', encoding='utf-8') as f:
    js = f.read()

pos = js.find('function GullyAIChatbot')
print("Found GullyAIChatbot at:", pos)
print(js[pos:pos+400])

# Check where isOpen is used
pos_isOpen = js.find('const [isOpen', pos)
print("useState isOpen:", js[pos_isOpen:pos_isOpen+100])

pos_render = js.find('isOpen &&', pos)
print("isOpen && usage:", js[pos_render:pos_render+150])
