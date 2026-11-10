import re
import json

with open("extracted_index.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. Sample match to ensure fresh browsers match the screenshots
sample_match = {
    "id": "match-sample-1",
    "createdAt": "2026-11-01T12:00:00.000Z",
    "cursor": 8,
    "config": {
        "teams": [
            {"name": "Team A", "color": "#E52525"},
            {"name": "Team B", "color": "#4CAF50"}
        ],
        "battingFirst": 0,
        "tossWinner": 0,
        "tossDecision": "bat",
        "rules": {
            "overs": 5,
            "maxWickets": 10,
            "wideRuns": 1,
            "noBallRuns": 1,
            "wideLegal": False,
            "noBallLegal": False,
            "freeHit": True,
            "localRules": ""
        }
    },
    "events": [
        {"type": "endInnings"},
        {"type": "ball", "kind": "runs", "runs": 6},
        {"type": "ball", "kind": "runs", "runs": 4},
        {"type": "ball", "kind": "runs", "runs": 4},
        {"type": "ball", "kind": "runs", "runs": 2},
        {"type": "ball", "kind": "runs", "runs": 2},
        {"type": "ball", "kind": "runs", "runs": 2},
        {"type": "endInnings"}
    ]
}

sample_match_json = json.dumps([sample_match])

# Find hT in original js:
# if(!n)return{matches:[],note:null}
target_empty = 'if(!n)return{matches:[],note:null};'
replacement_sample = f'if(!n){{try{{localStorage.setItem(Co,{json.dumps(sample_match_json)})}}catch{{}}return{{matches:{sample_match_json},note:null}};;}}'

if target_empty in js:
    js = js.replace(target_empty, replacement_sample, 1)
    print("Replaced initial empty state with exact reference match!")
else:
    print("Could not find target_empty, searching...")
    pos = js.find('if(!n)return{matches:')
    print(js[pos:pos+100])

# 2. Read chatbot code from generate_chatbot_code.py
import generate_chatbot_code
chatbot_code = generate_chatbot_code.chatbot_code

# Inject GullyAIChatbot right before function gC
pos_gC = js.find('function gC({children:n})')
if pos_gC == -1:
    pos_gC = js.find('function gC(')

print(f"Found gC at: {pos_gC}")
print(js[pos_gC:pos_gC+80])

# Now modify gC to include GullyAIChatbot
# In minified code, look for gC return
pos_gC_ret = js.find('min-h-[100dvh] bg-[#F8F5E8]', pos_gC)
# Find the closing of gC children array:
# !l&&h.jsx("nav",{...})
# We want to append: h.jsx(GullyAIChatbot,{isMatch:l,currentPath:s})
target_nav = '!l&&h.jsx("nav",'
nav_pos = js.find(target_nav, pos_gC)
print("Nav pos in gC:", nav_pos)

# Let's find where the children array in gC ends:
# It's children:[h.jsx(pC,{}),h.jsx("div",...}),!l&&h.jsx("nav",{...})]
# Let's see around nav in gC
end_nav = js.find('})]})', nav_pos)
print("End nav in gC:", js[nav_pos:end_nav+10])

# Replace `!l&&h.jsx("nav",...})` with `!l&&h.jsx("nav",...}),h.jsx(GullyAIChatbot,{isMatch:l,currentPath:s})`
original_nav_end = js[end_nav:end_nav+5] # '})]})'
# Wait! In `h.jsxs("div",{className:"min-h-[100dvh] bg-[#F8F5E8]",children:[...]})`
# The closing `]})` closes children array and div!
replacement_nav_end = '}),h.jsx(GullyAIChatbot,{isMatch:l,currentPath:s})]})'

js = js[:end_nav] + replacement_nav_end + js[end_nav+5:]

# Now insert GullyAIChatbot function before function gC
js = js[:pos_gC] + chatbot_code + "\n" + js[pos_gC:]

import os
os.makedirs("public/assets", exist_ok=True)
with open("public/assets/index-BJ4u41Uh.js", "w", encoding="utf-8") as f_out:
    f_out.write(js)

print("Saved modified bundle to public/assets/index-BJ4u41Uh.js! Size:", len(js))

