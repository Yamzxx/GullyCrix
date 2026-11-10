import re

with open('extracted_index.js', 'r', encoding='utf-8') as f:
    js = f.read()

print("Storage / API / Query hints:")
api_matches = re.findall(r'(\/api\/[a-zA-Z0-9_\-\/]+)', js)
print("API endpoints:", set(api_matches))

# Check for dexie, idb, sqlite, tanstack-query
for term in ['dexie', 'indexedDB', 'openDatabase', 'useQuery', 'useMutation', 'queryClient', 'apiClient']:
    print(f"Term '{term}':", term.lower() in js.lower())

# Look around /api/
for m in re.finditer(r'apiRequest|\/api\/', js):
    start = max(0, m.start() - 100)
    end = min(len(js), m.end() + 150)
    print("Context around api:")
    print(js[start:end])
    print("-" * 40)
    break
