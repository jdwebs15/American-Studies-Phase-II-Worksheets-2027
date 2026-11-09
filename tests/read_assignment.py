import json,re
from pathlib import Path
def read_assignment(path):
 text=Path(path).read_text()
 match=re.search(r'<script id="assignment-data" type="application/json">([\s\S]*?)</script>',text)
 if not match:raise ValueError('Missing worksheet-owned embedded assignment data: '+str(path))
 return json.loads(match.group(1))
