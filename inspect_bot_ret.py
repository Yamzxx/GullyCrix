with open('public/assets/index-BJ4u41Uh.js', 'r', encoding='utf-8') as f:
    js = f.read()

pos = js.find('function GullyAIChatbot')
pos_ret = js.find('return h.jsxs("div", {', pos)
print(js[pos_ret:pos_ret+1200])

