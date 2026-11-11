# Test oa function with node
with open("extracted_index.js", "r", encoding="utf-8") as f:
    js = f.read()

# Let's extract oa and its dependencies
pos_oa = js.find("function oa(")
pos_next = js.find("function SC(", pos_oa)
print("Found oa at:", pos_oa)

