with open('extracted_index.js', 'r', encoding='utf-8') as f:
    js = f.read()

pos_start = js.find('Co="gullycrix.v1.matches"')
print("Start position:", pos_start)
print("Total length:", len(js))
print("App code length:", len(js) - pos_start)

# Let's write the app code to a separate file so we can analyze it
with open('app_extracted_code.js', 'w', encoding='utf-8') as f_out:
    f_out.write(js[pos_start:])
