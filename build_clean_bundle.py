import re
import json

with open("extracted_index.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. Exact sample match matching Screenshot 1, 2, 3
sample_match = {
    "id": "match-sample-1",
    "createdAt": "2026-11-01T12:00:00.000Z",
    "cursor": 8,
    "config": {
        "teams": [
            {"name": "Team A", "color": "#E52525"},
            {"name": "Team B", "color": "#4CAF50"}
        ],
        "battingFirst": 1,
        "tossWinner": 1,
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
        {"type": "ball", "kind": "runs", "runs": 6},
        {"type": "ball", "kind": "runs", "runs": 4},
        {"type": "ball", "kind": "runs", "runs": 4},
        {"type": "ball", "kind": "runs", "runs": 2},
        {"type": "ball", "kind": "runs", "runs": 2},
        {"type": "ball", "kind": "runs", "runs": 2},
        {"type": "endInnings"},
        {"type": "endInnings"}
    ]
}

sample_match_json = json.dumps([sample_match])

target_empty = 'if(!n)return{matches:[],note:null};'
replacement_sample = f'if(!n){{try{{localStorage.setItem(Co,{json.dumps(sample_match_json)})}}catch{{}}return{{matches:{sample_match_json},note:null}};;}}'

if target_empty in js:
    js = js.replace(target_empty, replacement_sample, 1)
    print("Injected initial sample match!")
else:
    print("Could not find target_empty")

# 2. GullyAIChatbot code
import generate_chatbot_code
chatbot_code = generate_chatbot_code.chatbot_code

# Find function gC
pos_gC = js.find("function gC({children:n})")
print("Found gC at:", pos_gC)

# Find the end of gC:
# children:[h.jsx(pC,{}),h.jsx("div",{className:Rt(!l&&"pb-28 md:pb-0 md:pl-24"),children:n}),!l&&h.jsx("nav",{...})]
# Look for: `!l&&h.jsx("nav",`
pos_nav = js.find('!l&&h.jsx("nav",', pos_gC)

# In gC:
# children:[h.jsx(pC,{}),h.jsx("div",{className:Rt(!l&&"pb-28 md:pb-0 md:pl-24"),children:n}),!l&&h.jsx("nav",{...})]
# After nav finishes, it closes with `]})}`
# Let's find `]})}` after pos_nav:
# Let's inspect the 200 characters around the end of gC
end_pos = js.find('function yC', pos_nav)
if end_pos == -1:
    end_pos = js.find('const yC', pos_nav)

gC_slice = js[pos_nav:end_pos]
print("gC tail slice:")
print(gC_slice[-150:])

# The tail of gC is: `})]})}`
# `})` closes h.jsx("nav", ...
# `]})` closes children array of outer div
# `}` closes function gC
last_brace = gC_slice.rfind('})]})')
print("Found last_brace at:", last_brace)
print("Context around last_brace:", gC_slice[last_brace:last_brace+15])

# We want to replace `})]})` with:
# `}),h.jsx(GullyAIChatbot,{isMatch:l,currentPath:s})]})`
gC_slice_modified = gC_slice[:last_brace] + '}),h.jsx(GullyAIChatbot,{isMatch:l,currentPath:s})]})' + gC_slice[last_brace+5:]

js = js[:pos_nav] + gC_slice_modified + js[end_pos:]

# Inject GullyAIChatbot right before gC
js = js[:pos_gC] + chatbot_code + "\n" + js[pos_gC:]

with open("public/assets/index-BJ4u41Uh.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Saved cleanly to public/assets/index-BJ4u41Uh.js! Total length:", len(js))

