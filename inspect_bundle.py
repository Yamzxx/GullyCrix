import re

with open('extracted_index.js', 'r', encoding='utf-8') as f:
    js = f.read()

print('Length of js:', len(js))

keywords = [
    'AFTERNOON SESSION', 'Score fast', 'Play more', 'Tap the ball',
    'Gully scorer', 'What the gang calls you', 'YOUR NUMBERS',
    'Highest total', 'Team ledger', 'Chimes for fours',
    'matches scored here', 'Sound effects', 'Animations',
    'Export all data as JSON', 'Delete all matches',
    'scored', 'overs', 'wickets', 'fours', 'sixes'
]

for kw in keywords:
    print(f'{kw:25} -> {kw.lower() in js.lower()}')

