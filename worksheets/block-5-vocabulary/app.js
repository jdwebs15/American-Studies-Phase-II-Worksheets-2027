const APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycbxOkyzvD3SgH2O2VH1I5NAGU8aWANuIiqZPlJGzj5QX90DZluNZ0T9dVSNag-P_w5t9Yw/exec";
const questions=window.BLOCK_QUESTIONS;
const C=window.BLOCK_CONFIG;
const IS_REVIEW=/REVIEW/i.test(C.assignmentKey)||/Review/i.test(C.title);
const $=id=>document.getElementById(id);
const freshState=()=>({answers:{},mastered:{},attempts:{},firstResponses:{},firstResponseAt:{},wrongTotal:0,currentIndex:0,firstStart:new Date().toISOString(),sessions:1,activeSeconds:0,awaySeconds:0,tabLeaves:0,events:[],questionSeconds:{},lastTick:Date.now(),status:"in progress"});
let state=freshState(),saveTimer=null,advanceTimer=null,started=false;

function init(){
  $("pageTitle").textContent=C.title;$("pageDescription").textContent=C.description;$("practiceText").textContent=C.practice;
  $("scoringText").textContent=IS_REVIEW?"Your first answer to every question is recorded for your score. Afterward, use feedback and hints until every question is mastered.":"Use feedback and hints until every term is mastered. All attempts and your accuracy remain recorded.";
  $("startBtn").onclick=start;$("loadBtn").onclick=loadCloud;$("saveBtn").onclick=()=>cloudSave(true);$("resetBtn").onclick=resetAssignment;$("submitBtn").onclick=submit;
  ["studentName","email"].forEach(id=>$(id).addEventListener("change",restoreLocal));$("period").addEventListener("change",saveLocal);
  document.addEventListener("visibilitychange",()=>{tick();if(document.hidden)state.tabLeaves++;event(document.hidden?"leave":"return")});
  setInterval(()=>{tick();updateStats();if(started)saveLocal()},1000);
}
function student(){return{name:$("studentName").value.trim(),period:$("period").value,email:$("email").value.trim().toLowerCase()}}
function valid(show=true){const s=student(),ok=s.name&&s.period&&/^\S+@\S+\.\S+$/.test(s.email);if(!ok&&show)$("saveStatus").textContent="Enter full name, class period, and a valid school email first.";return ok}
function storageKey(){return `${C.assignmentKey}|${student().email}`}
function start(){if(!valid())return;restoreLocal();started=true;$("studentPanel").classList.add("hidden");$("workspace").classList.remove("hidden");goToFirstUnmastered();renderQuestion();queueCloudSave()}
function currentQuestion(){return questions[state.currentIndex]}
function goToFirstUnmastered(){const i=questions.findIndex(q=>!state.mastered[q.id]);state.currentIndex=i<0?questions.length:i}
function renderQuestion(){
  if(state.currentIndex>=questions.length){showCompletion();return}
  const q=currentQuestion(),letters=["A","B","C","D"];
  $("questionCard").innerHTML=`<div class="qmeta"><span>Question ${state.currentIndex+1} of ${questions.length}</span><span>${safe(q.cs)}</span></div><h2>${safe(q.topic||q.cs)}</h2><p class="prompt">${safe(q.prompt)}</p><div class="choices">${q.choices.map((choice,i)=>`<button class="choice" data-choice="${i}"><span class="choice-letter">${letters[i]}.</span><span>${safe(choice)}</span></button>`).join("")}</div><div id="feedback" class="feedback" role="status"></div>${q.source?`<div class="source-box"><a href="${q.source}" target="_blank" rel="noopener">Open supporting source ↗</a>${q.where?`<p><strong>Where to look:</strong> ${safe(q.where)}</p>`:""}</div>`:""}`;
  document.querySelectorAll("[data-choice]").forEach(b=>b.onclick=()=>answer(Number(b.dataset.choice),b));updateStats();
}
function answer(choice,button){
  if(advanceTimer)return;const q=currentQuestion(),f=$("feedback"),now=new Date().toISOString();
  if(state.firstResponses[q.id]===undefined){state.firstResponses[q.id]=choice;state.firstResponseAt[q.id]=now}
  state.answers[q.id]=choice;state.attempts[q.id]=(state.attempts[q.id]||0)+1;
  if(choice===q.answer){
    state.mastered[q.id]=true;button.classList.add("correct");document.querySelectorAll("[data-choice]").forEach(b=>b.disabled=true);
    f.className="feedback good";f.innerHTML=`<strong>Correct.</strong> ${safe(q.explanation)}<span class="advance-note">Advancing…</span>`;event("correct",q.id,choice);saveLocal();updateStats();queueCloudSave();
    advanceTimer=setTimeout(()=>{advanceTimer=null;state.currentIndex++;while(state.currentIndex<questions.length&&state.mastered[questions[state.currentIndex].id])state.currentIndex++;renderQuestion()},1200);
  }else{
    state.wrongTotal++;button.classList.add("wrong");setTimeout(()=>button.classList.remove("wrong"),500);f.className="feedback bad";f.innerHTML=`<strong>Not yet.</strong> Hint: ${safe(q.hint||"Eliminate choices that do not match the question, then try again.")}`;event("wrong",q.id,choice);saveLocal();updateStats();queueCloudSave();
  }
}
function firstCorrect(){return questions.filter(q=>Number(state.firstResponses[q.id])===Number(q.answer)).length}
function masteredCount(){return questions.filter(q=>state.mastered[q.id]).length}
function totalAttempts(){return Object.values(state.attempts).reduce((a,b)=>a+(Number(b)||0),0)}
function updateStats(){
  const mastered=masteredCount(),attempts=totalAttempts(),accuracy=attempts?Math.round(mastered/attempts*100):100;
  $("progressStat").textContent=`${mastered} / ${questions.length}`;$("scoreLabel").textContent=IS_REVIEW?"First-attempt score":"Accuracy";$("scoreStat").textContent=IS_REVIEW?`${firstCorrect()} / ${Object.keys(state.firstResponses).length}`:`${accuracy}%`;$("runtimeStat").textContent=formatTime(state.activeSeconds);
}
function showCompletion(){
  started=false;state.status="completed";state.completedAt=state.completedAt||new Date().toISOString();$("workspace").classList.add("hidden");$("completion").classList.remove("hidden");
  const accuracy=totalAttempts()?Math.round(questions.length/totalAttempts()*100):100;
  $("completionSummary").textContent=IS_REVIEW?`Mastery ticket earned: ${questions.length} of ${questions.length} mastered. First-attempt score: ${firstCorrect()} of ${questions.length}. Corrections do not replace that score.`:`Mastery ticket earned: ${questions.length} of ${questions.length} terms mastered in ${totalAttempts()} attempts (${accuracy}% accuracy).`;
  saveLocal();queueCloudSave();
}
function payload(){
  tick();const mastered=masteredCount(),fc=firstCorrect(),attempts=totalAttempts(),accuracy=attempts?Math.round(mastered/attempts*100):100;
  return{assignmentKey:C.assignmentKey,assignmentTitle:C.title,course:"American Studies Phase II",assignmentType:IS_REVIEW?"review":"vocabulary",student:student(),state:{...state},answers:{...state.answers},mastered:{...state.mastered},firstResponses:{...state.firstResponses},score:IS_REVIEW?fc:mastered,total:questions.length,percent:IS_REVIEW?Math.round(fc/questions.length*100):Math.round(mastered/questions.length*100),masteryScore:mastered,masteryPercent:Math.round(mastered/questions.length*100),firstAttemptScore:fc,firstAttemptPercent:Math.round(fc/questions.length*100),attemptCount:attempts,accuracy,wrongAttempts:state.wrongTotal,updatedAt:new Date().toISOString()}
}
function saveLocal(){if(student().email)localStorage.setItem(storageKey(),JSON.stringify(payload()))}
function restoreLocal(){if(!student().email)return;const raw=localStorage.getItem(storageKey());if(raw)try{mergeDraft(JSON.parse(raw));$("saveStatus").textContent="Saved work restored on this device."}catch{}}
function mergeDraft(d){
  if(!d)return;const s=d.state||d;
  Object.assign(state.mastered,s.mastered||d.mastered||{});
  for(const [id,v] of Object.entries(s.answers||d.answers||{}))if(state.answers[id]===undefined)state.answers[id]=v;
  for(const [id,v] of Object.entries(s.attempts||{}))state.attempts[id]=Math.max(state.attempts[id]||0,Number(v)||0);
  const remoteFirst=s.firstResponses||d.firstResponses||{},remoteAt=s.firstResponseAt||{};
  for(const [id,v] of Object.entries(remoteFirst)){const localAt=state.firstResponseAt[id],cloudAt=remoteAt[id];if(state.firstResponses[id]===undefined||(cloudAt&&(!localAt||cloudAt<localAt))){state.firstResponses[id]=v;state.firstResponseAt[id]=cloudAt||localAt||""}}
  state.wrongTotal=Math.max(state.wrongTotal||0,s.wrongTotal||d.wrongAttempts||0);state.activeSeconds=Math.max(state.activeSeconds||0,s.activeSeconds||0);state.awaySeconds=Math.max(state.awaySeconds||0,s.awaySeconds||0);state.tabLeaves=Math.max(state.tabLeaves||0,s.tabLeaves||0);state.firstStart=s.firstStart||state.firstStart;state.events=mergeEvents(state.events,s.events);state.questionSeconds=mergeMax(state.questionSeconds,s.questionSeconds);goToFirstUnmastered();updateStats();
}
function mergeEvents(a=[],b=[]){const m=new Map();[...a,...(b||[])].forEach(x=>m.set(`${x.at}|${x.type}|${x.question||""}|${x.choice??""}`,x));return [...m.values()].sort((x,y)=>String(x.at).localeCompare(String(y.at))).slice(-500)}
function mergeMax(a={},b={}){const out={...a};for(const[k,v]of Object.entries(b||{}))out[k]=Math.max(out[k]||0,Number(v)||0);return out}
function queueCloudSave(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>cloudSave(false),750)}
async function cloudSave(manual){if(!valid(false))return;saveLocal();try{await fetch(APPS_SCRIPT_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({action:"save",payload:JSON.stringify(payload())})});$("saveStatus").textContent="Saved on this device and sent to the teacher record."}catch{if(manual)$("saveStatus").textContent="Saved on this device; cloud save could not be confirmed."}}
function loadCloud(){if(!valid())return;const cb=`load_${Date.now()}`,script=document.createElement("script");window[cb]=r=>{try{if(r&&r.found)mergeDraft(r.payload);saveLocal();$("saveStatus").textContent=r&&r.found?"Previous work merged safely.":"No cloud draft was found."}finally{delete window[cb];script.remove()}};script.src=`${APPS_SCRIPT_URL}?action=load&assignmentKey=${encodeURIComponent(C.assignmentKey)}&email=${encodeURIComponent(student().email)}&callback=${cb}`;script.onerror=()=>{$("saveStatus").textContent="Could not load the cloud draft.";delete window[cb];script.remove()};document.body.appendChild(script)}
async function resetAssignment(){if(!valid())return;if(!confirm("Reset this assignment? This clears saved answers, attempts, scores, and mastery for this assignment only."))return;localStorage.removeItem(storageKey());state=freshState();await fetch(APPS_SCRIPT_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({action:"reset",course:"American Studies Phase II",assignmentKey:C.assignmentKey,email:student().email,payload:JSON.stringify({course:"American Studies Phase II",assignmentKey:C.assignmentKey,student:student()})})}).catch(()=>{});location.reload()}
async function submit(){if(!valid()||masteredCount()!==questions.length)return;state.status="submitted";state.submittedAt=new Date().toISOString();await cloudSave(true);$("submitStatus").textContent="Submitted successfully. Your mastery ticket and recorded performance have been saved.";$("submitBtn").disabled=true}
function tick(){const now=Date.now(),sec=Math.min(15,Math.max(0,(now-state.lastTick)/1000));if(started){if(document.hidden)state.awaySeconds+=sec;else state.activeSeconds+=sec;const q=currentQuestion();if(q)state.questionSeconds[q.id]=(state.questionSeconds[q.id]||0)+sec}state.lastTick=now}
function event(type,question="",choice=""){state.events.push({type,question,choice,at:new Date().toISOString()});state.events=state.events.slice(-500)}
function formatTime(s){s=Math.max(0,Math.floor(s||0));const m=Math.floor(s/60),sec=s%60;return `${m}:${String(sec).padStart(2,"0")}`}
function safe(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
init();
