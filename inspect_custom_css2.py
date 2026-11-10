with open('extracted_index.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Let's find where custom styles are
for key in ['ball-bob', 'ball-ring', '.press']:
    pos = css.find(key)
    if pos != -1:
        print(f"Around {key}:")
        print(css[pos-100:pos+300])
        print("="*40)
