#!/usr/bin/env python3
"""Validate every Introduction source/anchor and HTTP availability of unique citations."""
import json,re,datetime,urllib.request,concurrent.futures
from pathlib import Path
from read_assignment import read_assignment
root=Path(__file__).resolve().parents[1];local=[];urls={};failures=[]
for page in root.glob('worksheets/*-introduction/index.html'):
 for q in read_assignment(page)['questions']:
  source=q['source'];file,_,anchor=source.partition('#');target=(page.parent/file).resolve()
  ok=target.is_file() and (not anchor or f'id="{anchor}"' in target.read_text())
  local.append({'worksheet':page.parent.name,'question':q['id'],'source':source,'valid':ok})
  if not ok:failures.append(f'{page.parent.name}/{q["id"]}: missing source or anchor')
for page in root.glob('sources/*.html'):
 for url in re.findall(r'href="(https:[^"]+)"',page.read_text()):urls.setdefault(url.replace('&amp;','&'),[]).append(page.name)
def fetch(pair):
 url,refs=pair
 try:
  with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=30) as r:
   text=r.read();return {'url':url,'status':r.status,'resolvedURL':r.url,'referencePages':refs,'bytes':len(text)}
 except Exception as e:return {'url':url,'error':str(e),'referencePages':refs}
checks=list(concurrent.futures.ThreadPoolExecutor(max_workers=6).map(fetch,urls.items()))
for c in checks:
 if c.get('status')!=200:failures.append('HTTP citation failed: '+c['url'])
report={'checkedUTC':datetime.datetime.now(datetime.timezone.utc).isoformat(),'localReferences':len(local),'validLocalReferences':sum(v['valid'] for v in local),'uniqueHTTPCitations':len(checks),'localChecks':local,'httpChecks':checks,'failures':failures,'limits':'Local anchor validity and HTTP availability are automated. Historical support was assessed separately against the official historical explanations; an HTTP success alone does not establish support.'}
(root/'tests/source-results.json').write_text(json.dumps(report,indent=2));print(f'{len(local)} source/anchor references; {len(checks)} HTTP citations; {len(failures)} failures')
for f in failures:print(f)
raise SystemExit(bool(failures))
