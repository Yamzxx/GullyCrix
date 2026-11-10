with open('extracted_index.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Let's search for occurrences of component names or page names
for page in ['Home', 'Match', 'Matches', 'Stats', 'Profile', 'Setup', 'Result']:
    pos = 0
    print(f"\n--- Occurrences of {page} ---")
    while True:
        pos = js.find(f'function {page}', pos)
        if pos == -1:
            break
        print(f"Found function {page} at {pos}:")
        print(js[pos:pos+200])
        pos += len(page)

