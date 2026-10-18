import {VERSION,TODAY,ATTRS,JOBS,PRINCIPLES,QUESTS,TARGETS,SKILLS} from './fixtures.mjs';
export const KEY='aiux-v2-mock';
const clone=x=>JSON.parse(JSON.stringify(x));
const need=(test,msg)=>{if(!test)throw Error(msg)};
const number=(v)=>v===''||v===null||v===undefined?null:Number(v);
export function validateOutput(id,x){
 need(x?.mode==='mock','輸出契約錯誤：mode');
 if(id==='A')need(Number.isInteger(x.sample)&&x.sample===x.valid?.length&&Array.isArray(x.excluded)&&x.skills?.length===5&&x.skills.every(r=>r.denominator===x.sample&&Number.isInteger(r.count)&&r.count>=0&&r.count<=x.sample),'輸出契約錯誤：A');
 if(id==='B')need(Array.isArray(x.cards)&&x.cards.length>=7&&x.cards.every(c=>c.isSynthetic===true&&c.source?.startsWith('mock://')&&c.title&&c.action&&c.risk),'輸出契約錯誤：B');
 if(id==='D')need(['降一階','維持','升一階'].includes(x.difficulty)&&['3–5 分鐘','10–15 分鐘'].includes(x.length)&&['溫和示範型','一般嚮導型'].includes(x.tone)&&Array.isArray(x.recall)&&ATTRS.some(([k])=>k===x.priority),'輸出契約錯誤：D');
 if(id==='C')need((x.quest===null||QUESTS.some(q=>q.id===x.quest?.id))&&Number.isInteger(x.sources?.A)&&Number.isInteger(x.sources?.B)&&x.career?.target&&x.settings?.mode==='mock','輸出契約錯誤：C');
 return true;
}
export function scanJobs(rows=JOBS,cutoff=TODAY){
 need(rows.every(r=>r.isSynthetic===true&&r.source.startsWith('mock://')),'目前僅允許模擬來源');
 const limit=new Date(cutoff+'T00:00:00Z');limit.setUTCMonth(limit.getUTCMonth()-18);
 const seen=new Set(),excluded=[],valid=[];
 for(const row of rows){if(new Date(row.date)<limit){excluded.push({...row,reason:'超過 18 個月'});continue}if(seen.has(row.canonical)){excluded.push({...row,reason:'同職缺重刊'});continue}seen.add(row.canonical);valid.push(row)}
 return {mode:'mock',version:VERSION,sample:valid.length,valid,excluded,skills:ATTRS.map(([key,title])=>({key,title,count:valid.filter(r=>r.skills.includes(key)).length,denominator:valid.length,rate:valid.length?Math.round(valid.filter(r=>r.skills.includes(key)).length/valid.length*100):null})),salary:'樣本不足，不產生薪資推估',limitations:'全部為虛構職缺；提及率僅供測試，不代表台灣市場。'};
}
export function researchPrinciples(){return {mode:'mock',version:VERSION,cards:clone(PRINCIPLES),limitations:'離線模擬研究卡；原始論文與 Skill 快照數字未用於本原型。'}}
export function analyzeDaily(s,input={}){
 const confidence=number(input.confidence),energy=number(input.energy),minutes=number(input.minutes),available=number(input.available);
 for(const [key,value] of Object.entries({confidence,energy}))need(value===null||Number.isInteger(value)&&value>=1&&value<=5,key+' 需介於 1–5 或略過');
 for(const value of [minutes,available])need(value===null||Number.isFinite(value)&&value>=0&&value<=1440,'時間需介於 0–1440 分鐘或略過');
 const priorities=TARGETS[s.user?.target]||TARGETS['AI 產品設計師'];
 const priority=[...priorities].sort((a,b)=>s.attrs[a]-s.attrs[b])[0];
 const stuck=input.stuck==='many',smooth=input.stuck==='none';
 const difficulty=confidence!==null&&confidence<=2&&stuck?'降一階':confidence===5&&smooth?'升一階':'維持';
 const history=[...s.confidenceHistory,...(confidence!==null?[confidence]:[])].slice(-3);
 const tone=s.user?.support==='gentle'&&!(history.length===3&&history.every(x=>x>=4))?'溫和示範型':'一般嚮導型';
 return {mode:'mock',date:TODAY,confidence,energy,minutes,available,activity:input.activity||'未提供',stuck:input.stuck||'未提供',priority,difficulty,length:energy!==null&&energy<=2||available!==null&&available<15?'3–5 分鐘':'10–15 分鐘',tone,recall:[...s.recall],rest:minutes===0,highlight:s.completed.length?'你已把練習轉成具體判斷；可以繼續保留依據。':'第一天，從一個小情境開始。',trend:s.daily?'與上次自己的紀錄比較；未提供的資料不推估。':'第一天，從這裡開始',confidenceHistory:history};
}
export function seed(){return {schemaVersion:2,mode:'mock',isSynthetic:true,view:'home',user:null,attrs:{research:10,structure:10,ai:5,automation:0,judgment:5},completed:[],recall:[],recallCount:0,lastRecallAt:0,answers:{},hints:[],daily:null,confidenceHistory:[],materials:[],suggestions:[],results:[],profile:null,match:{self:false,peer:false},collaboration:null,feedback:[],snapshots:{A:{approved:true,revision:1,output:scanJobs()},B:{approved:true,revision:1,output:researchPrinciples()}},pending:{},runs:[],notice:'',fault:false};}
export function level(s){return Math.min(5,1+Math.floor(Object.values(s.attrs).reduce((a,b)=>a+b,0)/60))}
export function currentQuest(s){
 need(s.user,'請先孵化你的怪獸');
 if(s.recall.length){const q=QUESTS.find(q=>q.id===s.recall[0]);return {...q,recall:true}}
 const open=QUESTS.filter(q=>!s.completed.includes(q.id));
 const q=open.find(q=>q.attr===s.daily?.priority)||open[0];
 return q?{...q,recall:false}:null;
}
export function careerAdvice(s){
 need(s.user&&s.daily,'先孵化怪獸並取得狀態卡');
 const a=s.snapshots.A.output,b=s.snapshots.B.output;
 const jobs=a.valid.filter(j=>j.title===s.user.target);
 const required=[...new Set(jobs.flatMap(j=>j.skills))];
 const priorities=required.length?required:TARGETS[s.user.target];
 const gap=[...priorities].sort((a,b)=>s.attrs[a]-s.attrs[b])[0];
 const next=QUESTS.find(q=>q.attr===gap&&!s.completed.includes(q.id));
 return {target:s.user.target,gap,jobRefs:jobs.map(j=>j.source),principleRefs:b.cards.filter(c=>['B01','B04','B07'].includes(c.id)).map(c=>c.source),salary:'樣本不足，暫不提供薪資帶',context:`以「${s.user.industry||'你的既有領域'}」的模擬工作情境，練習可查核、可選擇的 AI 互動。`,next:next?next.title:'請學伴互測你的成果，補一個反例與下一步驗證。',limitations:'方向由虛構職缺與個人練習紀錄整理；不代表職場能力，也不保證錄取或薪資。'};
}
export function runSkill(s,id,input={}){
 need(s.mode==='mock'&&s.isSynthetic===true,'目前僅允許模擬模式');need(['A','B','C','D'].includes(id),'未知 Skill');
 const seq=s.runs.length+1,run={runId:'run-'+String(seq).padStart(3,'0'),skill:id,adapter:'deterministic-mock-v2',fixtureVersion:VERSION,input:clone(input),status:'running',startedAt:new Date().toISOString()};
 try{
  need(!s.fault,'模擬執行失敗：未改動結果，可關閉失敗情境後重試');let output;
  if(id==='A')output=scanJobs();
  if(id==='B')output=researchPrinciples();
  if(id==='D')output=analyzeDaily(s,input);
  if(id==='C'){need(s.snapshots.A.approved&&s.snapshots.B.approved,'請先核准 A／B 模擬快照');need(s.daily,'先完成或略過今日狀態卡');output={mode:'mock',quest:currentQuest(s),settings:clone(s.daily),career:careerAdvice(s),sources:{A:s.snapshots.A.revision,B:s.snapshots.B.revision},message:'依狀態卡與已核准的共用模擬快照安排關卡。'}}
  validateOutput(id,output);run.status='passed';run.output=clone(output);run.completedAt=new Date().toISOString();s.runs.push(run);return output;
 }catch(e){run.status='failed';run.error=e.message;run.completedAt=new Date().toISOString();s.runs.push(run);throw e}
}
export function refreshKnowledge(s){const a=runSkill(s,'A'),b=runSkill(s,'B');s.pending={A:{approved:false,revision:s.snapshots.A.revision+1,output:a},B:{approved:false,revision:s.snapshots.B.revision+1,output:b}};}
export function approveKnowledge(s){need(s.pending.A&&s.pending.B,'請先產生待審核快照');s.snapshots=clone(s.pending);s.snapshots.A.approved=s.snapshots.B.approved=true;s.pending={};}
export function hatch(s,user){need(!s.user,'怪獸已孵化，請從存檔接續');need(user.name?.trim()&&user.name.length<=20,'名字請填 1–20 字');need(TARGETS[user.target],'請選擇目標職稱');need(['gentle','guide'].includes(user.support),'請選擇引導方式');s.user=clone(user);}
export function saveDaily(s,input){need(s.user,'請先孵化怪獸');const d=runSkill(s,'D',input);s.daily=d;s.confidenceHistory=d.confidenceHistory;return d;}
export function answerQuest(s,{questId,choice,note=''}){
 need(s.user&&s.daily,'先孵化怪獸並填寫或略過狀態卡');const active=currentQuest(s);need(active&&active.id===questId,'關卡已更新，請重開今日關卡');const q=QUESTS.find(q=>q.id===questId);need(Number.isInteger(choice)&&q.choices[choice],'請選擇一個行動');need(note.length<=800,'補充請控制在 800 字內');
 const correct=choice===q.correct,before=level(s);let xp=0;
 if(active.recall){if(correct){s.recall=s.recall.filter(id=>id!==q.id);s.recallCount++}s.lastAnswer={questId,correct,recall:true,xp:0,text:correct?'你記起了這個判斷的理由，這一關已鞏固。':'再看一次提示也沒關係；保留在待回憶，不扣分。'};return s.lastAnswer;}
 if(s.completed.includes(q.id))return s.answers[q.id];
 xp=correct?15:5;s.attrs[q.attr]+=xp;s.completed.push(q.id);const result={questId,correct,xp,recall:false,text:correct?q.feedback:q.improve,choice,note,previousLevel:before,level:level(s)};s.answers[q.id]=result;s.lastAnswer=result;
 s.materials.push({id:'carrot-'+q.id,questId:q.id,kind:'self',text:q.choices[choice]+(note?'；'+note:''),selected:false,source:'mock://answers/'+q.id,version:1});
 s.suggestions.push({id:'meteor-'+q.id,questId:q.id,kind:'ai',text:q.idea,experiment:q.experiment,status:'pending',source:'mock://answers/'+q.id,version:1});
 if(s.completed.length-s.lastRecallAt>=3){s.recall.push(s.completed[s.completed.length-3]);s.lastRecallAt=s.completed.length;}
 return result;
}
export function decideSuggestion(s,id,status){need(['adopted','rejected','pending'].includes(status),'不支援的決定');const x=s.suggestions.find(x=>x.id===id);need(x,'找不到建議');x.status=status;}
export function confirmResult(s,text){need(s.materials.some(x=>x.selected),'請先採收至少一項自己的素材');need(text?.trim()&&text.length<=1200,'成果請填 1–1200 字');const refs=[...s.materials.filter(x=>x.selected).map(x=>({id:x.id,kind:'self',text:x.text,source:x.source,version:x.version})),...s.suggestions.filter(x=>x.status==='adopted').map(x=>({id:x.id,kind:'ai',text:x.text,source:x.source,version:x.version}))];const r={id:'R'+(s.results.length+1),text:text.trim(),refs,confirmedBy:'mock-owner',confirmedAt:new Date().toISOString(),status:'confirmed'};s.results.push(r);return r;}
export function makeProfile(s,{color='sage',accessory='leaf'}={}){need(s.results.length,'先確認一份成果，才能建立名片');need(['sage','lilac','peach'].includes(color)&&['leaf','star','horn'].includes(accessory),'無效的外觀選項');s.profile={name:s.user.name,target:s.user.target,resultId:s.results.at(-1).id,text:s.results.at(-1).text,attrs:clone(s.attrs),level:level(s),color,accessory,visible:false};s.match={self:false,peer:false};s.collaboration=null;}
export function profileValid(s){return !!s.profile&&s.profile.resultId===s.results.at(-1)?.id;}
export function acceptMatch(s,actor){need(profileValid(s)&&s.profile.visible,'請先確認最新版名片的展示範圍');need(['self','peer'].includes(actor),'無效角色');need(actor!=='peer'||s.match.self,'先由本人接受');s.match[actor]=true;}
export function planCollaboration(s){need(s.match.self&&s.match.peer&&profileValid(s),'雙方接受後才能建立任務');if(!s.collaboration)s.collaboration={id:'coop-'+s.results.at(-1).id,goal:'互測 3 分鐘起步卡',task:'小芽觀察，小沐操作；記錄一個卡點',time:'示範時段・週六 14:00',status:'planned'};return s.collaboration;}
export function recordFeedback(s,text){need(s.collaboration,'先約定共同任務');need(text?.trim()&&text.length<=800,'回饋請填 1–800 字');const id='feedback-'+(s.feedback.length+1);s.feedback.push({id,text});s.materials.push({id,kind:'self',text:'互測回饋：'+text,source:'mock://feedback/'+id,version:1,selected:false});s.collaboration.status='reviewed';}
export function exportSave(s){return {format:'aiux-save-v1',mode:'mock',isSynthetic:true,fixtureVersion:VERSION,state:clone({...s,view:'home',fault:false,runs:[]})};}
export function importSave(data){
 need(data?.format==='aiux-save-v1'&&data.mode==='mock'&&data.isSynthetic===true&&data.fixtureVersion===VERSION,'不支援此存檔；請使用本原型匯出的模擬存檔 v1');
 const x=data.state;need(x&&x.schemaVersion===2&&x.mode==='mock'&&x.isSynthetic===true,'存檔格式不完整');
 need(x.user&&typeof x.user.name==='string'&&x.user.name.length<=20&&TARGETS[x.user.target]&&['gentle','guide'].includes(x.user.support),'存檔角色格式錯誤');
 need(ATTRS.every(([k])=>Number.isFinite(x.attrs?.[k])&&x.attrs[k]>=0&&x.attrs[k]<=1000),'存檔屬性無效');
 for(const k of ['completed','recall','materials','suggestions','results','confidenceHistory','feedback','hints'])need(Array.isArray(x[k])&&x[k].length<=200,'存檔欄位無效：'+k);
 need([...x.completed,...x.recall].every(id=>QUESTS.some(q=>q.id===id)),'存檔包含未知關卡');need(new Set(x.completed).size===x.completed.length,'存檔重複關卡');
 need(x.materials.every(r=>typeof r.text==='string'&&r.text.length<=2000&&r.source?.startsWith('mock://')),'存檔含非模擬素材');need(x.suggestions.every(r=>typeof r.text==='string'&&['pending','adopted','rejected'].includes(r.status)&&r.source?.startsWith('mock://')),'存檔建議無效');
 need(x.results.every(r=>typeof r.text==='string'&&r.text.length<=1200&&r.status==='confirmed'&&Array.isArray(r.refs)&&r.refs.every(e=>e.source?.startsWith('mock://'))),'存檔成果無效');
 need(x.snapshots?.A?.output?.mode==='mock'&&x.snapshots?.B?.output?.mode==='mock','存檔快照無效');
 const safeText=v=>typeof v==='string'&&v.length<=2000;
 const safeId=v=>typeof v==='string'&&/^[A-Za-z0-9-]{1,80}$/.test(v);
 need(x.materials.every(r=>safeId(r.id)&&typeof r.selected==='boolean'&&r.version===1),'存檔素材欄位錯誤');
 need(x.suggestions.every(r=>safeId(r.id)&&safeText(r.experiment)&&r.version===1),'存檔建議欄位錯誤');
 need(x.results.every(r=>safeId(r.id)&&r.refs.every(e=>safeId(e.id)&&safeText(e.text)&&['self','ai'].includes(e.kind))),'存檔成果引用錯誤');
 need(x.confidenceHistory.length<=3&&x.confidenceHistory.every(n=>Number.isInteger(n)&&n>=1&&n<=5),'信心紀錄錯誤');
 need(x.feedback.every(r=>safeId(r.id)&&safeText(r.text)),'回饋紀錄錯誤');
 need(x.daily===null||x.daily&&['3–5 分鐘','10–15 分鐘'].includes(x.daily.length)&&['降一階','維持','升一階'].includes(x.daily.difficulty)&&['溫和示範型','一般嚮導型'].includes(x.daily.tone)&&ATTRS.some(([k])=>k===x.daily.priority)&&safeText(x.daily.highlight)&&Array.isArray(x.daily.recall),'每日狀態卡錯誤');
 need(x.profile===null||x.profile&&['sage','lilac','peach'].includes(x.profile.color)&&['leaf','star','horn'].includes(x.profile.accessory)&&safeId(x.profile.resultId)&&safeText(x.profile.text)&&ATTRS.every(([k])=>Number.isFinite(x.profile.attrs?.[k])),'名片格式錯誤');
 need(x.collaboration===null||x.collaboration&&['goal','task','time'].every(k=>safeText(x.collaboration[k])&&!/[<>]/.test(x.collaboration[k])),'合作紀錄格式錯誤');
 need(x.match&&typeof x.match.self==='boolean'&&typeof x.match.peer==='boolean'&&Number.isFinite(x.lastRecallAt),'媒合／回憶狀態錯誤');
 // Rebuild shared fixtures from trusted local code, rather than trust imported knowledge.
 const fresh=seed();return {...fresh,...clone(x),view:'home',fault:false,runs:[],pending:{},snapshots:fresh.snapshots,notice:'已載入模擬存檔；共用快照使用內建版本。'};
}
export function saveCardText(s){return `🗂️ 存檔卡 v1（模擬）\n怪獸：${s.user?.name||'未孵化'}｜Lv${level(s)}\n屬性：${ATTRS.map(([k,n])=>n+' '+s.attrs[k]).join('｜')}\n目標職稱：${s.user?.target||'未提供'}\n已完成關卡：${s.completed.join(', ')||'無'}\n待回憶：${s.recall.join(', ')||'無'}\n累積學習日：${s.completed.length?1:0}（固定示範日期）\n近 3 次信心：${s.confidenceHistory.join(', ')||'未提供'}\n最後更新：${TODAY}\n可攜存檔請使用 JSON 下載；以上文字供閱讀。`;}
export {ATTRS,SKILLS,QUESTS,TODAY};
