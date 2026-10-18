var TeamTownCore = (()=>{
 const BUILD='team-prd-v3-r1';
 const ATTR=['research','structure','ai','automation','judgment'];
 const must=(ok,msg)=>{if(!ok)throw Error(msg)};
 const copy=x=>JSON.parse(JSON.stringify(x));
 const opt=x=>x===''||x===null||x===undefined?null:Number(x);
 function init(s){
  s.meta=s.meta||{schema:1,mode:'mock',build:BUILD,p2:false,onboarded:false,target:'AI 產品設計師',tools:'',industry:'',support:'gentle',aiChoices:{},draft:'',goal:'',work:'',give:'',want:'',result:null,review:'draft',attempts:[],recallDue:[],recallCompleted:{},recallCheckpoint:0,history:[],headline:0,stuckStatus:'unknown',audit:[],labTab:'review',aiAvailable:true};
  s.meta.build=BUILD;s.meta.mode='mock';return s;
 }
 function daily(s,targets,date){
  const c=s.checkin,m=s.meta;const confidence=opt(c.conf),energy=opt(c.energy),time=opt(c.tomorrow),mins=opt(c.mins);
  for(const n of [confidence,energy])must(n===null||Number.isInteger(n)&&n>=1&&n<=5,'把握與精力需為 1–5，或略過');
  for(const n of [time,mins])must(n===null||Number.isFinite(n)&&n>=0&&n<=1440,'時間無效');
  const latest=[...m.attempts].reverse().find(a=>a.status==='reviewed');
  const diff=confidence!==null&&confidence<=2&&(m.stuckStatus==='some'||c.stuck.trim())?'降一階':confidence===5&&m.stuckStatus==='none'&&latest?.pass&&!latest.hint?'升一階':'維持';
  const keys=(targets.find(t=>t.name===m.target)||targets[0]).key;
  const priority=keys.slice().sort((a,b)=>(s.quest.skills[a]||0)-(s.quest.skills[b]||0))[0];
  const hist=m.history.filter(h=>h.date!==date).concat(confidence===null?[]:[{date,confidence}]).slice(-3);
  const tone=m.support==='gentle'&&!(hist.length===3&&hist.every(h=>h.confidence>=4))?'溫和示範型':'一般嚮導型';
  return {diff,flow:confidence===null?'資料不足，先維持':diff==='降一階'?'先縮小挑戰':diff==='升一階'?'可以多試一步':'先維持',len:(energy!==null&&energy<=2)||(time!==null&&time<15)?'3–5 分鐘微關卡':'一般關卡（約 10 分鐘）',priority,pri:priority,recall:m.recallDue.length?'有待回憶，先回想一題':'目前沒有',tone,rest:mins===0,history:hist,highlight:latest?latest.feedback.good:'尚無已審核的關卡紀錄；可以從一個小問題開始。',stuck:c.stuck.trim(),confidence,energy,time};
 }
 function submit(s,qid,answer,hint,recall){must(s.card.finalized&&s.meta.p2,'名片定案與模擬關卡 2 開放後，才能試跑冒險');must(s.meta.onboarded,'請先完成開場定位');must(answer.trim().length>0&&answer.length<=1500,'請填 1–1500 字的做法');const a={id:'attempt-'+(s.meta.attempts.length+1),qid,answer:answer.trim(),hint:!!hint,recall:!!recall,status:'pending',pass:false,consumed:false,feedback:null};s.meta.attempts.push(a);return a;}
 function review(s,id,pass,next){const a=s.meta.attempts.find(a=>a.id===id);must(a&&a.status==='pending','這份作答已審核，或不存在');a.status='reviewed';a.pass=!!pass;a.feedback={good:'你提出了自己的做法：「'+a.answer.slice(0,90)+'」。',next:pass?next:'這次先留在「下次再試」；'+next};a.reviewer='mock-team';if(!pass&&!s.meta.recallDue.includes(a.qid))s.meta.recallDue.push(a.qid);return a;}
 function finish(s,id){const a=s.meta.attempts.find(a=>a.id===id);must(a?.status==='reviewed','請等團隊審核回饋');must(ATTR.includes(a.attr),'作答沒有有效的練習屬性');if(a.consumed)return {grew:false,duplicate:true};a.consumed=true;if(!a.pass)return {grew:false,retry:true};
  if(a.recall){s.meta.recallDue=s.meta.recallDue.filter(id=>id!==a.qid);if(!s.meta.recallCompleted[a.qid]){s.quest.recalls[a.attr]=(s.quest.recalls[a.attr]||0)+1;s.meta.recallCompleted[a.qid]=true;}return {grew:false,consolidated:true};}
  if(s.quest.done.includes(a.qid))return {grew:false,duplicate:true};
  s.quest.done.push(a.qid);s.quest.skills[a.attr]=(s.quest.skills[a.attr]||0)+1;s.quest.lastGrow=a.qid;
  if(s.quest.done.length-s.meta.recallCheckpoint>=3){const id=s.quest.done[s.quest.done.length-3];if(!s.meta.recallDue.includes(id))s.meta.recallDue.push(id);s.meta.recallCheckpoint=s.quest.done.length;delete s.meta.recallCompleted[id];}
  return {grew:true};
 }
 function confirmDraft(s){const m=s.meta;must(s.hatch.done,'請先完成三面鏡');must(m.draft.trim()&&m.goal.trim()&&m.give.trim()&&m.want.trim(),'請填寫本人認同的成果、目標、可以給與想要');must(['affirmation','guidance','curiosity'].every(id=>['adopt','reject'].includes(m.aiChoices[id])),'請逐項決定 AI 看法要採用或保留為不同意');m.review='pending';}
 function approveCard(s){must(s.meta.review==='pending','沒有待審核的名片');s.meta.review='approved';}
 function finalize(s){must(s.meta.review==='approved','請先由模擬團隊核對，再由本人確認');s.meta.result={id:'card-v1',text:s.meta.draft,goal:s.meta.goal,work:s.meta.work,give:s.meta.give,want:s.meta.want,aiChoices:copy(s.meta.aiChoices),self:s.hatch.self.slice(),reasons:copy(s.hatch.reasons)};s.card.finalized=true;s.meta.review='final';}
 function markWrong(s,id,reason){must(reason.trim(),'請寫下不同意的理由');const first=!s.hatch.disputed[id];s.hatch.disputed[id]=reason.trim();if(first)s.aiWrong=(s.aiWrong||0)+1;return first;}
 function audit(s,action){s.meta.audit.push({at:new Date().toISOString(),action,place:s.open||'town'});s.meta.audit=s.meta.audit.slice(-250);}
 return {BUILD,ATTR,copy,must,init,daily,submit,review,finish,confirmDraft,approveCard,finalize,markWrong,audit};
})();
if(typeof module!=='undefined')module.exports=TeamTownCore;
