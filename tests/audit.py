#!/usr/bin/env python3
"""Structural/content heuristics. Does not certify historical accuracy or single-best answers."""
import json,re,hashlib,sys,difflib,collections
from pathlib import Path
from read_assignment import read_assignment
root=Path(__file__).resolve().parents[1]
standards=json.loads((root/'standards/standards.json').read_text())
blocks=json.loads((root/'blocks.json').read_text())
failures=[];warnings=[];rows=[];all_questions=[]
def check(ok,message):
 if not ok:failures.append(message)
def norm(s):return re.sub(r'[^a-z0-9 ]','',s.lower()).strip()
for block in blocks:
 for mode,count in [('introduction',40),('review',30)]:
  path=root/'worksheets'/f"{block['slug']}-{mode}"/'index.html'
  data=read_assignment(path);config=data['config'];qs=data['questions']
  label=f"B{block['number']} {mode}"
  check('src="questions.js"' not in path.read_text(),f'{label}: external question file')
  check(len(qs)==count,f'{label}: count')
  positions=collections.Counter();longest=[];large=[];duplicates=[];near=[];seen={};distractors=collections.Counter();review_flags=[]
  for q in qs:
   qid=q['id'];choices=q.get('choices',[]);a=q.get('answer')
   check(len(choices)==4 and all(isinstance(x,str) and x.strip() for x in choices),f'{label} {qid}: four nonempty options')
   check(type(a) is int and 0<=a<4,f'{label} {qid}: missing/invalid key')
   check(len(set(map(norm,choices)))==4,f'{label} {qid}: duplicate options/potential multiple keys')
   check(bool(q['standards']) and all(str(cs) in standards and cs in block['standards'] for cs in q['standards']),f'{label} {qid}: invalid alignment')
   check(all(q.get(k) for k in ['source','where','hint']) if mode=='introduction' else not any(q.get(k) for k in ['source','where','hint']),f'{label} {qid}: guidance policy')
   check(len({x['id'] for x in qs})==len(qs),f'{label}: duplicate IDs')
   positions[a]+=1
   correct_tokens=set(norm(choices[a]).split())
   for j,c in enumerate(choices):
    if j==a:continue
    other_tokens=set(norm(c).split());union=correct_tokens|other_tokens
    if union and len(correct_tokens&other_tokens)/len(union)>.75:
     warnings.append(f'{label} {qid}: potentially equivalent alternative {j}; requires substantive review')
   lengths=[len(x.split()) for x in choices];correct=lengths[a];others=[l for i,l in enumerate(lengths) if i!=a]
   if correct>max(others):longest.append(qid)
   if correct-max(others)>=5 or correct/min(others)>=2:large.append(qid)
   n=norm(q['prompt'])
   if n in seen:duplicates.append([seen[n],qid])
   seen[n]=qid
   for c in choices:
    if re.search(r'all of the above|none of the above',c,re.I):failures.append(f'{label} {qid}: prohibited option')
   for i,c in enumerate(choices):
    if i!=a:distractors[norm(c)]+=1
   absolutes=sum(bool(re.search(r'\b(every|all|never|always|automatically|guarantee\w*|identical)\b',c,re.I)) for i,c in enumerate(choices) if i!=a)
   if absolutes>=2:review_flags.append(qid)
   all_questions.append((label,qid,q))
  check(sorted(positions.values())==([10]*4 if count==40 else [7,7,8,8]),f'{label}: balance')
  seq=[q['answer'] for q in qs];streak=max(len(list(g)) for _,g in __import__('itertools').groupby(seq))
  check(streak<=2,f'{label}: streak')
  repeats=[i+1 for i in range(len(seq)-7) if seq[i:i+4]==seq[i+4:i+8]]
  check(not repeats,f'{label}: repeating four-position pattern')
  for i,q in enumerate(qs):
   for r in qs[i+1:]:
    ratio=difflib.SequenceMatcher(None,norm(q['prompt']),norm(r['prompt'])).ratio()
    if ratio>.78:near.append([q['id'],r['id'],round(ratio,2)])
  leakage=[]
  for q in qs:
   answer_text=norm(q['choices'][q['answer']])
   if len(answer_text.split())<5:continue
   for other in qs:
    if q['id']==other['id']:continue
    if answer_text in norm(other['prompt']):leakage.append([q['id'],other['id']])
  if leakage:warnings.append(f'{label}: possible answer text in another prompt {leakage}')
  reused={k:v for k,v in distractors.items() if v>1}
  if longest and len(longest)/count>.4:warnings.append(f'{label}: correct option uniquely longest {len(longest)}/{count}')
  if large:warnings.append(f'{label}: large length differences at {large}')
  if review_flags:warnings.append(f'{label}: inspect weak/absolute distractors at {review_flags}')
  if near:warnings.append(f'{label}: near-duplicate candidates {near}')
  if reused:warnings.append(f'{label}: repeated distractors {reused}')
  rows.append({'assignment':label,'count':len(qs),'positions':dict(positions),'uniquelyLongest':longest,'largeLengthGaps':large,'maxStreak':streak,'duplicatePrompts':duplicates,'nearDuplicateCandidates':near,'reusedDistractors':reused,'weakDistractorCandidates':review_flags,'inheritedPrompts':sum(q['provenance'].startswith('inherited') for q in qs)})
  check(not duplicates,f'{label}: exact duplicate prompts')
  check((path.parent/'index.html').exists(),f'{label}: missing page')
# Check exact duplicate prompts across all rebuilt worksheets, including Intro/Review overlap.
groups=collections.defaultdict(list)
for label,qid,q in all_questions:groups[norm(q['prompt'])].append(f'{label}/{qid}')
cross=[v for v in groups.values() if len(v)>1]
cross_near=[]
for block in blocks:
 intro=[(qid,q) for label,qid,q in all_questions if label==f"B{block['number']} introduction"]
 review=[(qid,q) for label,qid,q in all_questions if label==f"B{block['number']} review"]
 for iid,iq in intro:
  for rid,rq in review:
   score=difflib.SequenceMatcher(None,norm(iq['prompt']),norm(rq['prompt'])).ratio()
   if score>.75:cross_near.append({'block':block['number'],'introduction':iid,'review':rid,'similarity':round(score,2)})
for candidate in cross_near:warnings.append('Intro/Review near-duplicate candidate: '+str(candidate))
for v in cross:warnings.append('Cross-bank duplicate prompt: '+str(v))
# Relative hub links and local resources, including preserved Vocabulary content.
for worksheet in root.glob('worksheets/*/index.html'):
 check('src="questions.js"' not in worksheet.read_text(),'External question file: '+str(worksheet))
 check('assignment-data' in worksheet.read_text(),'Missing embedded worksheet content: '+str(worksheet))
for page in root.rglob('*.html'):
 for href in re.findall(r'(?:href|src)=["\']([^"\']+)',page.read_text()):
  if re.match(r'^(?:https?:|#|mailto:|data:)',href):continue
  target=(page.parent/href.split('#')[0].split('?')[0]).resolve()
  if href.endswith('/'):target=target/'index.html'
  check(target.exists(),f'{page.relative_to(root)}: missing {href}')
manifest=json.loads((root/'standards/vocabulary-sha256.json').read_text())
for p,sha in manifest.items():
 if p.endswith(('index.html','questions.js')):continue
 check(hashlib.sha256((root/p).read_bytes()).hexdigest()==sha,'Vocabulary interface changed: '+p)
original_vocabulary=json.loads((root/'standards/vocabulary-content-sha256.json').read_text())
for slug,sha in original_vocabulary.items():
 data=read_assignment(root/'worksheets'/slug/'index.html')['questions']
 check(hashlib.sha256(json.dumps(data,sort_keys=True,ensure_ascii=False).encode()).hexdigest()==sha,'Vocabulary question content changed: '+slug)
# Coverage is explicit mapping, not proof of the expectation's entire cognitive scope.
coverage={str(b['number']):{str(cs):{mode:[qid for label,qid,q in all_questions if label==f"B{b['number']} {mode}" and cs in q['standards']] for mode in ['introduction','review']} for cs in b['standards']} for b in blocks}
for b,csmap in coverage.items():
 for cs,modes in csmap.items():
  for mode,ids in modes.items():check(bool(ids),f'B{b} CS{cs}: no {mode} coverage')
vocabulary=[]
for block in blocks:
 p=root/'worksheets'/f"{block['slug']}-vocabulary"/'index.html'
 qs=read_assignment(p)['questions'];positions=collections.Counter(q['answer'] for q in qs);longest=[];large=[]
 check(len(qs)==(40 if block['number']==12 else 28),f"B{block['number']} vocabulary: count")
 for q in qs:
  check(len(q['choices'])==4 and q['answer'] in range(4),f"B{block['number']} vocabulary {q['id']}: choice structure")
  lengths=[len(c.split()) for c in q['choices']];a=q['answer'];others=[v for i,v in enumerate(lengths) if i!=a]
  if lengths[a]>max(others):longest.append(q['id'])
  if lengths[a]-max(others)>=5 or lengths[a]/max(1,min(others))>=2:large.append(q['id'])
 vocabulary.append({'block':block['number'],'count':len(qs),'positions':dict(positions),'uniquelyLongest':longest,'largeLengthGaps':large,'unchanged':True})
report={'vocabulary':vocabulary,'structuralFailures':failures,'contentWarnings':warnings,'assignments':rows,'coverage':coverage,'crossBankDuplicates':cross,'crossBankNearDuplicates':cross_near,'vocabularyFilesVerified':sum(not p.endswith(('index.html','questions.js')) for p in manifest),'vocabularyQuestionSetsVerified':len(original_vocabulary),'limitations':['Single defensibly correct answer requires substantive review.','Semantic duplicates, answer leakage, historical accuracy, and distractor plausibility are not fully machine-verifiable.','Inherited Introduction prompts remain a known scope gap.','Absolute-word heuristics produce candidates, not automatic historical judgments.']}
(root/'tests/audit-results.json').write_text(json.dumps(report,indent=2))
print(f'{len(rows)} rebuilt worksheets; {len(all_questions)} questions; {len(failures)} structural failures; {len(warnings)} content warning groups; {len(original_vocabulary)} unchanged Vocabulary question sets')
for f in failures:print('FAIL',f)
print('See tests/audit-results.json for item-level findings.')
if '--strict-content' in sys.argv and warnings:sys.exit(2)
sys.exit(bool(failures))
