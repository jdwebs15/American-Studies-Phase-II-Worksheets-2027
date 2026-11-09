#!/usr/bin/env python3
import subprocess,sys,pathlib,time,urllib.request
root=pathlib.Path(__file__).resolve().parents[1]
def run(*args):subprocess.run(args,cwd=root,check=True)
run(sys.executable,'tests/audit.py')
for path in root.rglob('*.js'):run('node','--check',str(path))
run('node','tests/core.test.cjs')
if '--sources' in sys.argv:run(sys.executable,'tests/sources.py')
server=subprocess.Popen([sys.executable,'-m','http.server','8765','--bind','127.0.0.1'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
 for attempt in range(30):
  try:urllib.request.urlopen('http://127.0.0.1:8765/',timeout=1);break
  except Exception:time.sleep(.1)
 if server.poll() is not None:raise RuntimeError('Port 8765 is occupied; stop that server and retry.')
 run('node','tests/browser.test.cjs')
 run('node','tests/vocabulary.test.cjs')
finally:server.terminate();server.wait()
