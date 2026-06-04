#!/usr/bin/env python3
import re
filepath = '/home/team/shared/path-pilot/src/App.jsx'
with open(filepath, 'r') as f:
    content = f.read()
# Remove .bashrc garbage
clean = re.sub(r'/home/engine/\.bashrc.*', '', content)
# Remove trailing blank/error lines after export default App;
clean = re.sub(r'(export default App;).*$', r'\1', clean, flags=re.DOTALL)
clean = clean.rstrip() + '\n'
with open(filepath, 'w') as f:
    f.write(clean)
print(f"Fixed: {len(clean)} bytes")