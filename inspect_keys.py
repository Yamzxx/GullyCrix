import re

with open('extracted_index.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Look for Co= and T0= and wc=
pos = js.find('function hT')
print(js[max(0, pos-500):pos+400])
