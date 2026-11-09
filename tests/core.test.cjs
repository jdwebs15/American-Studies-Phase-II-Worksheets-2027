const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const K=require('../shared/core.js'),root=path.resolve(__dirname,'..');let count=0;
for(const b of JSON.parse(fs.readFileSync(path.join(root,'blocks.json'))))for(const mode of ['introduction','review']){
 const html=fs.readFileSync(path.join(root,'worksheets',`${b.slug}-${mode}`,'index.html'),'utf8');const embedded=JSON.parse(html.match(/<script id="assignment-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);const bank=embedded.questions,key=embedded.config.assignmentKey;
 const event=(r,q,choice)=>r.events.push({id:K.uid(),seq:r.events.length,q:q.id,choice,at:new Date().toISOString()});
 const r=K.newRun(bank);assert.equal(new Set(r.order).size,bank.length);assert.equal(Object.keys(r.options).length,bank.length);
 event(r,bank[0],(bank[0].answer+1)%4);for(const q of bank)event(r,q,q.answer);
 let s=K.stats(r,bank,mode);assert.equal(s.firstCorrect,bank.length-1);assert.equal(s.done,true);assert.equal(s.success,mode==='introduction');
 const state={version:2,assignmentKey:key,student:{name:'Test',period:'8',email:'test@example.org'},firstStart:r.createdAt,runs:[r],currentRun:r.id};
 const restored=K.validate(JSON.parse(JSON.stringify(state)),bank,key);assert.equal(K.stats(restored.runs[0],bank,mode).success,mode==='introduction');
 const stale=structuredClone(state);stale.runs[0].events=stale.runs[0].events.slice(1);const merged=K.merge(state,stale,bank,key);assert.equal(K.stats(merged.runs[0],bank,mode).failed,true);
 const r2=K.newRun(bank);r2.createdAt=new Date(Date.parse(r.createdAt)+1000).toISOString();for(const q of bank)event(r2,q,q.answer);state.runs.push(r2);state.currentRun=r2.id;s=K.stats(r2,bank,mode);assert.equal(s.success,true);assert.equal(state.runs.reduce((n,r)=>n+r.events.length,0),bank.length*2+1);
 const m=K.merge(state,stale,bank,key);assert.equal(m.runs.length,2);assert.equal(m.currentRun,r2.id);assert.equal(K.stats(m.runs[0],bank,mode).failed,true);
 let shuffled=false,options=false;for(let i=0;i<10;i++){const n=K.newRun(bank);shuffled||=n.order.join()!==r.order.join();options||=JSON.stringify(n.options)!==JSON.stringify(r.options)}assert(shuffled&&options);
 assert.throws(()=>K.validate({...state,assignmentKey:'other'},bank,key));const bad=structuredClone(state);bad.runs[0].events[0].choice=7;assert.throws(()=>K.validate(bad,bank,key));count++;
}
console.log(`${count} worksheets: completion, immutable first responses, failed-state reload, stale merge, restart history, randomization, and malformed-save rejection passed.`);
