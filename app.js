/* يومي v4.2 */
const KEY='yawmi-v1';
const dk=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const today=()=>dk(new Date());
const uid=()=>Math.random().toString(36).slice(2,9);
let S=JSON.parse(localStorage.getItem(KEY)||'null')||{
 sections:[
  {id:'games',name:'الألعاب',icon:'🎮',tasks:[
    {id:uid(),title:'ماتش فالورانت',played:true},
    {id:uid(),title:'أخلص دايلي كويست',played:true},
    {id:uid(),title:'ألعب مع الشباب في ديسكورد',played:true}]},
  {id:'study',name:'الدراسة والكود',icon:'💻',tasks:[
    {id:uid(),title:'أذاكر JavaScript ساعة'},
    {id:uid(),title:'أكتب كود وأرفعه على GitHub'}]},
  {id:'life',name:'يومي',icon:'🌿',tasks:[
    {id:uid(),title:'أصلي الصلوات في وقتها'},
    {id:uid(),title:'أشرب مية'},
    {id:uid(),title:'أمشي شوية'}]}
 ],
 log:{},view:'home'};
S.mood=S.mood||{};S.note=S.note||{};S.theme=S.theme||'light';S.focus=S.focus||{};S.goal=S.goal||0;S.minPct=S.minPct||0;S.weekTarget=S.weekTarget||5;S.key=S.key||{};S.remind=S.remind||'';S.lastRemind=S.lastRemind||'';
S.habits=S.habits||[];S.goals=S.goals||[];S.carry=S.carry||{};S.fl=S.fl||{};S.statRange=S.statRange||7;
S.pray=S.pray||{};S.adk=S.adk||{};S.rollTo=S.rollTo||'';S.fsetOpen=!!S.fsetOpen;
if(!S.course){const v={};for(let i=1;i<=176;i++)v[i]=1;const a={};for(let i=0;i<15;i++)a[i]=1;S.course={v,a,log:{}}}
S.fs=Object.assign({work:25,brk:5,long:15,every:4,auto:false,sound:true},S.fs||{});
const save=()=>localStorage.setItem(KEY,JSON.stringify(S));
const day=(d=today())=>S.log[d]||(S.log[d]={});
const allTasks=()=>S.sections.flatMap(s=>s.tasks).concat(S.habits);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const DN=['ح','ن','ث','ر','خ','ج','س'],DFULL=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'],DORDER=[6,0,1,2,3,4,5];
function due(t,k){const g=new Date(k+'T00:00:00').getDay();return !t.days||!t.days.length||t.days.includes(g)||(S.carry[k]||[]).includes(t.id)}
const tasksFor=k=>allTasks().filter(t=>due(t,k));
const dueToday=()=>tasksFor(today());
const doneToday=t=>(day()[t.id]||0)>0;
function total(id){return Object.values(S.log).reduce((a,d)=>a+(d[id]||0),0)}
function pct(k){const l=S.log[k]||{};const ts=tasksFor(k);if(!ts.length)return 0;return ts.filter(t=>l[t.id]>0).length/ts.length}
const ok=k=>{const p=pct(k);return S.minPct?p*100>=S.minPct:p>0};
function streak(){let n=0,d=new Date();if(!ok(today()))d.setDate(d.getDate()-1);
 for(;;){if(ok(dk(d))){n++;d.setDate(d.getDate()-1)}else break}return n}
function best(){const ks=Object.keys(S.log).sort();let b=0,c=0,prev=null;for(const k of ks){if(!ok(k)){c=0;prev=null;continue}const d=new Date(k+'T00:00:00');if(prev&&Math.round((d-prev)/864e5)===1)c++;else c=1;prev=d;b=Math.max(b,c)}return Math.max(b,streak())}
function tstreak(id){let n=0,d=new Date();if(!((S.log[dk(d)]||{})[id]>0))d.setDate(d.getDate()-1);while((S.log[dk(d)]||{})[id]>0){n++;d.setDate(d.getDate()-1)}return n}
function weekDays(){const r=[],x=new Date();const off=(x.getDay()+1)%7;x.setDate(x.getDate()-off);for(let i=0;i<7;i++){r.push(dk(x));x.setDate(x.getDate()+1)}return r}
const daysLabel=t=>t.days&&t.days.length?'🔁 '+DORDER.filter(g=>t.days.includes(g)).map(g=>DN[g]).join(' '):'';
/* v4.2: مصدر كل مهمة (القسم اللي جاية منه) */
function srcOf(id){if(S.habits.some(h=>h.id===id))return{icon:'💧',name:'العادات'};const s=S.sections.find(s=>s.tasks.some(t=>t.id===id));return s?{icon:s.icon,name:s.name}:{icon:'📌',name:''}}
/* v4.2: ترحيل تلقائي - أي مهمة ما اتعملتش بتتنقل لوحدها لليوم اللي بعده */
function autoRollover(){const t=today();if(S.rollTo===t)return;
 Object.keys(S.log).filter(k=>k<t).sort().forEach(k=>{
  const nx=dk(new Date(new Date(k+'T00:00:00').getTime()+864e5));if(nx>t)return;
  const un=tasksFor(k).filter(x=>!((S.log[k]||{})[x.id]>0)).map(x=>x.id);
  if(un.length)S.carry[nx]=[...new Set([...(S.carry[nx]||[]),...un])]});
 S.rollTo=t;save()}
autoRollover();
function taskRow(t){const c=day()[t.id]||0;const done=c>0;const off=!due(t,today());
 const g=new Date().getDay();const norm=!t.days||!t.days.length||t.days.includes(g);
 const carried=(S.carry[today()]||[]).includes(t.id)&&!norm;const so=srcOf(t.id);
 return `<div class="task ${done?'done':''} ${off?'off':''}"><button class="chk" data-tick="${t.id}">${done?'✓':''}</button><span class="src" title="${esc(so.name)}">${so.icon}</span><span class="t">${S.key[today()]===t.id?'⭐ ':''}${esc(t.title)}${t.days&&t.days.length?` <small class="rep">${daysLabel(t)}</small>`:''}${carried?' <small class="rep">📦 من إمبارح</small>':''}</span>${tstreak(t.id)>=2?`<span class="sk">🔥 ${tstreak(t.id)}</span>`:''}<button class="del" data-key="${t.id}" title="مهمة اليوم الأساسية">⭐</button>
 ${t.played?`<span class="cnt"><button data-m="${t.id}">−</button><b>${c}</b><button data-p="${t.id}">+</button></span>`:''}
 <button class="del" data-edit="${t.id}" title="تعديل">✏️</button><button class="del" data-del="${t.id}" title="حذف">🗑️</button></div>`}
const QUOTES=['الاستمرارية أهم من الكمال 💎','خطوة صغيرة كل يوم بتعمل فرق كبير 🌱','النهارده أحسن من إمبارح بحاجة بسيطة ✨','ابدأ بأسهل مهمة وهتشد الباقي 🚀','ريّح دماغك شوية وارجع أقوى 🧘'];
const quote=()=>QUOTES[new Date().getDate()%QUOTES.length];
function heat(){let h='';for(let i=27;i>=0;i--){const x=new Date();x.setDate(x.getDate()-i);const p=pct(dk(x));h+=`<i class="hc l${p===0?0:p<.34?1:p<.67?2:3}" title="${dk(x)} · ${Math.round(p*100)}%"></i>`}return `<div class="heat">${h}</div>`}

/* ---------- modal ---------- */
function ask(o){return new Promise(res=>{
 const ov=document.createElement('div');ov.className='ovl';
 const f=(o.fields||[]).map(x=>{
  if(x.type==='days')return `<div class="fld"><label>${esc(x.label)}</label><div class="dchips" data-f="${x.id}">${DORDER.map(g=>`<button type="button" class="dchip ${(x.value||[]).includes(g)?'on':''}" data-g="${g}">${DFULL[g]}</button>`).join('')}</div><small>سيبها فاضية = كل يوم</small></div>`;
  if(x.type==='emoji')return `<div class="fld"><label>${esc(x.label)}</label><input data-f="${x.id}" value="${esc(x.value)}" maxlength="4" style="width:90px;text-align:center;font-size:22px"><div class="presets">${['📌','📚','💼','🏋️','🎨','🎧','💰','🧠','🌙','🛒'].map(e=>`<button type="button" class="pe">${e}</button>`).join('')}</div></div>`;
  if(x.type==='textarea')return `<div class="fld"><label>${esc(x.label)}</label><textarea data-f="${x.id}" rows="5" placeholder="${esc(x.ph||'')}">${esc(x.value)}</textarea></div>`;
  return `<div class="fld"><label>${esc(x.label)}</label><input data-f="${x.id}" value="${esc(x.value)}" placeholder="${esc(x.ph||'')}"></div>`}).join('');
 ov.innerHTML=`<div class="modal" role="dialog"><h3>${esc(o.title)}</h3>${o.msg?`<p>${esc(o.msg)}</p>`:''}${f}<div class="mb"><button class="mok ${o.danger?'danger':''}">${esc(o.ok||'تمام')}</button><button class="mno">${o.noCancel?'':'إلغاء'}</button></div></div>`;
 if(o.noCancel)ov.querySelector('.mno').remove();
 document.body.appendChild(ov);
 const close=v=>{ov.remove();document.removeEventListener('keydown',kd,true);res(v)};
 const collect=()=>{const r={};ov.querySelectorAll('[data-f]').forEach(el=>{r[el.dataset.f]=el.classList.contains('dchips')?[...el.querySelectorAll('.dchip.on')].map(b=>+b.dataset.g):el.value});return r};
 const kd=e=>{if(e.key==='Escape')close(null);if(e.key==='Enter'&&e.target.tagName!=='TEXTAREA'){e.preventDefault();close(collect())}};
 document.addEventListener('keydown',kd,true);
 ov.addEventListener('click',e=>{const b=e.target.closest('button');
  if(e.target===ov)return close(null);
  if(!b)return;
  if(b.classList.contains('dchip')){b.classList.toggle('on')}
  else if(b.classList.contains('pe')){ov.querySelector('input').value=b.textContent}
  else if(b.classList.contains('mok'))close(collect());
  else if(b.classList.contains('mno'))close(null)});
 const first=ov.querySelector('input,textarea');if(first)first.focus();
})}
const confirmD=(title,msg,ok='حذف')=>ask({title,msg,ok,danger:true});

/* ---------- focus ---------- */
const mins=m=>m*60;
let FT={mode:'work',total:mins(S.fs.work),left:mins(S.fs.work),run:false,end:0,cycle:0,task:'',iv:null,startedAt:0};
const modeLen=m=>mins(m==='work'?S.fs.work:m==='long'?S.fs.long:S.fs.brk);
const modeName=m=>m==='work'?'جلسة تركيز':m==='long'?'راحة طويلة':'استراحة قصيرة';
let FW=null;
function wk(on){try{if(on){if(!FW){FW=new Worker(URL.createObjectURL(new Blob(['setInterval(function(){postMessage(1)},1000)'],{type:'text/javascript'})));FW.onmessage=()=>{if(FT.run)ftick()}}}else if(FW){FW.terminate();FW=null}}catch(e){FW=null}}
function setMode(m){wk(false);clearInterval(FT.iv);FT.run=false;FT.mode=m;FT.total=FT.left=modeLen(m);document.title='يومي 🌟 مهامي كل يوم'}
function fmt(s){s=Math.max(0,s);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function beep(){if(!S.fs.sound)return;try{const a=new(window.AudioContext||window.webkitAudioContext)();[0,.25,.5].forEach(t=>{const o=a.createOscillator(),g=a.createGain();o.frequency.value=t===.5?880:660;o.connect(g);g.connect(a.destination);g.gain.setValueAtTime(.2,a.currentTime+t);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+t+.2);o.start(a.currentTime+t);o.stop(a.currentTime+t+.22)})}catch(e){}}
function startTimer(){FT.run=true;FT.end=Date.now()+FT.left*1000;if(!FT.startedAt)FT.startedAt=Date.now();clearInterval(FT.iv);FT.iv=setInterval(ftick,500);wk(true)}
function pauseTimer(){wk(false);clearInterval(FT.iv);FT.run=false;FT.left=Math.max(0,Math.ceil((FT.end-Date.now())/1000));document.title=fmt(FT.left)+' · يومي'}
function recordFocus(m){if(m<1)return;const k=today();(S.fl[k]=S.fl[k]||[]).push({t:FT.task||'',m:Math.round(m)});S.focus[k]=(S.focus[k]||0)+1}
function nextAfter(){if(FT.mode==='work'){FT.cycle++;return FT.cycle%S.fs.every===0?'long':'break'}return 'work'}
function finish(rec){wk(false);clearInterval(FT.iv);FT.run=false;
 if(FT.mode==='work'&&rec)recordFocus(rec==='full'?FT.total/60:(FT.total-FT.left)/60);
 const wasWork=FT.mode==='work';FT.startedAt=0;setMode(nextAfter());
 if(rec==='full'){beep();try{navigator.vibrate&&navigator.vibrate([200,100,200])}catch(e){}if(wasWork)confetti();toast(wasWork?'🎉 خلصت جلسة تركيز!':'⏰ الراحة خلصت');if(S.fs.auto)startTimer()}
 render()}
function ftick(){if(!FT.run)return;FT.left=Math.ceil((FT.end-Date.now())/1000);
 const nt=document.getElementById('navft');if(nt)nt.textContent=fmt(FT.left);
 const el=document.getElementById('ft');if(el)el.textContent=fmt(FT.left);
 const r=document.getElementById('fring');if(r)r.style.setProperty('--p',Math.round((1-FT.left/FT.total)*100));
 document.title=(FT.run?fmt(FT.left)+' · ':'')+'يومي';
 if(FT.left<=0)finish('full')}
/* v4.2: صفحة التركيز الجديدة */
function focusView(){const k=today(),m=S.focus[k]||0,tm=(S.fl[k]||[]).reduce((a,x)=>a+x.m,0);
 const bestD=Math.max(0,...Object.keys(S.fl).map(d=>(S.fl[d]||[]).reduce((a,x)=>a+x.m,0)));
 const opts=dueToday().filter(t=>!doneToday(t)).map(t=>`<option value="${t.id}" ${FT.task===t.id?'selected':''}>${esc(t.title)}</option>`).join('');
 const ct=allTasks().find(t=>t.id===FT.task);
 const nm=(id,l,v,mx)=>`<label class="sf"><span>${l}</span><input type="number" min="1" max="${mx||180}" data-fs="${id}" value="${v}"></label>`;
 const cur=FT.cycle%S.fs.every;
 const dots=Array.from({length:S.fs.every},(_,i)=>`<i class="dot ${i<cur?'done':''} ${FT.mode==='work'&&i===cur?'act':''}"></i>`).join('');
 return `<div class="focwrap"><div class="focus ${FT.mode==='work'?'':'brk'}">
 <div class="fmode">${modeName(FT.mode)}${FT.mode==='work'?` · الجلسة ${cur+1} من ${S.fs.every}`:''}</div>
 <div class="ftname">${ct?'🎯 '+esc(ct.title):'اختار مهمة للجلسة دي 👇'}</div>
 <div class="ring big" id="fring" style="--p:${Math.round((1-FT.left/FT.total)*100)}"><div class="ftime" id="ft">${fmt(FT.left)}</div></div>
 <div class="fdots">${dots}</div>
 <div class="ftask"><select id="ftask"><option value="">من غير ربط بمهمة</option>${opts}</select></div>
 <div class="fbtns"><button data-f="toggle" class="main">${FT.run?'⏸ إيقاف مؤقت':(FT.startedAt?'▶ كمّل':'▶ ابدأ')}</button><button data-f="done">✔ إنهاء وتسجيل</button><button data-f="skip">⏭ تخطي</button><button data-f="reset">↺ إعادة</button></div>
 <div class="fbtns small"><button data-f="-5">−5 د</button><button data-f="-1">−1 د</button><button data-f="+1">+1 د</button><button data-f="+5">+5 د</button><button data-f="w">تركيز</button><button data-f="b">راحة</button><button data-f="l">راحة طويلة</button></div>
 <div class="fpresets"><span>⚡ جاهز:</span><button data-fp="25:5">25/5</button><button data-fp="50:10">50/10</button><button data-fp="90:20">90/20</button></div>
 <div class="fstats"><div><b>${m}</b><span>جلسات النهارده</span></div><div><b>${tm}</b><span>دقيقة تركيز النهارده</span></div><div><b>${bestD}</b><span>أفضل يوم (دقيقة)</span></div></div>
 <p class="fhint">⌨️ Space = ابدأ / إيقاف · وقت الجلسة بيتسجل على المهمة المختارة · الوقت بيظهر في عنوان التاب</p>
 </div>
 <div class="setbox"><button class="sethead" data-fset="1"><b>⚙️ إعدادات التركيز</b><span>${S.fsetOpen?'▲':'▼'}</span></button>
 ${S.fsetOpen?`<div class="setbody">
  <div class="setgrp"><b>⏳ مدد الجلسات (بالدقائق)</b><div class="sg">${nm('work','تركيز',S.fs.work)}${nm('brk','راحة قصيرة',S.fs.brk)}${nm('long','راحة طويلة',S.fs.long)}${nm('every','جلسات قبل الراحة الطويلة',S.fs.every,10)}</div></div>
  <div class="setgrp"><b>🎛️ خيارات</b>
   <label class="sw"><input type="checkbox" data-fsb="auto" ${S.fs.auto?'checked':''}><i></i><span>تشغيل تلقائي للجلسة اللي بعدها</span></label>
   <label class="sw"><input type="checkbox" data-fsb="sound" ${S.fs.sound?'checked':''}><i></i><span>صوت عند النهاية</span></label>
  </div>
 </div>`:''}</div></div>`}
function confetti(){const c=document.createElement('div');c.className='conf';let h='';for(let i=0;i<40;i++)h+=`<i style="left:${Math.random()*100}%;background:hsl(${Math.random()*360},80%,60%);animation-delay:${Math.random()*.4}s"></i>`;c.innerHTML=h;document.body.appendChild(c);setTimeout(()=>c.remove(),2200)}
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2400)}

/* ---------- nav ---------- */
const VIEWS=[['home','🏠 الرئيسية'],['calendar','📆 التقويم'],['focus','⏱️ التركيز'],['habits','💧 العادات'],['goals','🎯 الأهداف'],['stats','📊 الإحصائيات'],['review','🌙 مراجعة اليوم'],['pray','🕌 الصلاة والأذكار'],['course','💻 كورس JS'],['settings','⚙️ الإعدادات']];
const PR=[['fajr','الفجر'],['dhuhr','الظهر'],['asr','العصر'],['maghrib','المغرب'],['isha','العشاء']];
const PR2=[['fajr','الفجر','🌅'],['dhuhr','الظهر','☀️'],['asr','العصر','🌤️'],['maghrib','المغرب','🌇'],['isha','العشاء','🌙']];
const prDone=(k=today())=>PR.filter(([i])=>(S.pray[k]||{})[i]).length;
function prayStrip(){const el=document.getElementById('prayStrip');if(!el)return;const d=S.pray[today()]||{};
 el.innerHTML=`<div class="pshead"><span>🕌 الصلوات</span><b>${prDone()}/5</b></div><div class="psrow">${PR.map(([i,n])=>`<button class="pb ${d[i]?'on':''}" data-pr="${i}" title="${n}">${d[i]?'✓':''}<small>${n}</small></button>`).join('')}</div>`}
function nav(){prayStrip();document.getElementById('nav').innerHTML=
 VIEWS.map(([v,l])=>`<button class="nav-btn ${S.view===v?'active':''}" data-v="${v}"><span>${l}</span>${v==='focus'&&FT.run?`<small id="navft">${fmt(FT.left)}</small>`:''}</button>`).join('')+
 '<div class="sep"></div>'+
 S.sections.map(s=>{const ts=s.tasks.filter(t=>due(t,today()));const d=ts.filter(doneToday).length;return `<button class="nav-btn ${S.view===s.id?'active':''}" data-v="${s.id}"><span>${s.icon} ${esc(s.name)}</span><small>${d}/${ts.length}</small></button>`}).join('')}

/* ---------- views ---------- */
/* v4.2: مهام الكورس جوه لسه عليك النهارده */
function courseTaskRows(){const nx=cNext();const na=COURSE.findIndex((s,i)=>!S.course.a[i]);let h='';
 if(nx)h+=`<div class="task ctask"><span class="src" title="كورس JS">💻</span><span class="t">اتفرج على فيديو <b dir="ltr">#${String(nx[0]).padStart(3,'0')}</b> <em dir="ltr">${esc(nx[1])}</em></span><button class="cdone" data-cnext="1">اتفرجت ✓</button></div>`;
 if(na>=0)h+=`<div class="task ctask"><span class="src" title="كورس JS">💻</span><span class="t">حل تكليف: <b dir="ltr">${esc(COURSE[na].n)}</b></span><button class="cdone" data-cas="${na}">حليته ✓</button></div>`;
 return h}
function home(){const ts=dueToday(),d=ts.filter(doneToday).length,p=ts.length?Math.round(d/ts.length*100):0;
 const plays=Object.values(day()).reduce((a,b)=>a+b,0);
 const gamesSec=S.sections.find(s=>s.id==='games');
 const gt=gamesSec?gamesSec.tasks.reduce((a,t)=>a+total(t.id),0):0;
 const msg=p===100&&ts.length?'خلصت كل حاجة النهارده! 🎉':p>=50?'قربت، كمّل يا وحش 💪':'يلا نبدأ اليوم 🚀';
 const y=new Date();y.setDate(y.getDate()-1);const missed=!ok(dk(y))&&Object.keys(S.log).length>0&&!ok(today());
 const kt=allTasks().find(t=>t.id===S.key[today()]);
 const wd=weekDays(),wdone=wd.filter(ok).length;
 const bs=streak(),bb=best(),fs=Object.values(S.focus).reduce((x,y)=>x+y,0);
 const BG=[['🌱 3 أيام',bb>=3],['🔥 7 أيام',bb>=7],['💪 14 يوم',bb>=14],['👑 30 يوم',bb>=30],['⏱️ 10 جلسات',fs>=10],['🎯 50 جلسة',fs>=50]];
 const avg=Math.round(wd.map(k=>pct(k)*100).reduce((x,y)=>x+y,0)/7);
 const carried=(S.carry[today()]||[]).length;
 const todo=ts.filter(t=>!doneToday(t));
 return `<div class="homew">${missed?'<div class="warn hw">⚠️ فاتك إمبارح. قاعدة ذهبية: ما تفوتش مرتين ورا بعض. خلص مهمة واحدة بس النهارده 💛</div>':''}${carried?`<div class="warn hw">📦 عندك ${carried} مهمة اتنقلت لوحدها من إمبارح.</div>`:''}
 <div class="key">${kt?`⭐ مهمتك الأساسية: <b>${esc(kt.title)}</b> ${doneToday(kt)?'✅':''}`:`⭐ اختار مهمة أساسية النهارده (دوس ⭐ جنب أي مهمة)`}<span class="qt"> · ${quote()}</span></div>
 <div class="hero"><div class="ring" style="--p:${p}"><div>${p}%</div></div><div><h2>${msg}</h2><p>خلصت ${d} من ${ts.length} مهمة النهارده</p></div></div>
 <div class="cards"><div class="card"><div class="n">${d}</div><div class="l">مهام خلصتها ✅</div></div><div class="card"><div class="n">${plays}</div><div class="l">مرات اتسجلت</div></div><div class="card"><div class="n">${gt}</div><div class="l">مرات اللعب 🎮</div></div><div class="card"><div class="n">${bs}</div><div class="l">أيام متواصلة 🔥</div></div></div>
 <div class="hc1"><h3>✅ لسه عليك النهارده</h3>${courseTaskRows()}${todo.length?todo.slice(0,6).map(taskRow).join('')+(todo.length>6?`<p class="hint">و ${todo.length-6} كمان في الأقسام</p>`:''):'<p>مفيش حاجة باقية 🎉</p>'}</div>
 <div class="hc2"><h3>📅 الأسبوع: ${wdone} من ${S.weekTarget} أيام ${wdone>=S.weekTarget?'🏆':''}</h3><div class="wk">${wd.map((k,i)=>`<div class="wd ${ok(k)?'on':''}">${DN[(i+6)%7]}</div>`).join('')}<span>متوسط ${avg}% · أطول سلسلة ${bb}</span></div>
 <h3>🏅 إنجازات</h3><div class="badges">${BG.map(([n,o])=>`<div class="badge ${o?'on':''}">${n}</div>`).join('')}</div><h3>آخر ٢٨ يوم</h3>${heat()}</div></div>`}
function sectionView(s){const dn=s.tasks.filter(t=>due(t,today())&&doneToday(t)).length,dt=s.tasks.filter(t=>due(t,today())).length,pp=dt?Math.round(dn/dt*100):0;
 return `<h3>${s.icon} ${esc(s.name)}</h3><div class="pbar"><i style="width:${pp}%"></i></div>${s.tasks.slice().sort((x,y)=>doneToday(x)-doneToday(y)).map(taskRow).join('')||'<p>مفيش مهام لسه، ضيف أول واحدة 👇</p>'}
 <div class="add"><input id="newTask" placeholder="مهمة جديدة..."><button data-add="${s.id}">إضافة</button></div>
 <p class="hint">دوس ✏️ على أي مهمة عشان تخليها تتكرر في أيام محددة (مثلا السبت والثلاثاء بس).</p>
 <button class="rm" data-delsec="${s.id}">🗑️ حذف القسم ده</button>`}
function habitsView(){const P=['💧 أشرب مية','🏃 رياضة','🕌 صلاة الفجر في وقتها','📖 قراءة 10 صفحات','😴 النوم بدري','🧘 تأمل 5 دقايق','🥗 آكل خضار أو فاكهة','🚶 أمشي 5000 خطوة','🌞 أقعد في الشمس 10 دقايق','📵 ساعة بدون موبايل قبل النوم','🦷 أغسل سناني مرتين','🧍 أعمل تمدد وأظبط وقفتي','👀 راحة للعينين كل ساعة','🍬 أقلل السكر والمشروبات الغازية','🥤 مشروب غازي واحد بس أو أقل','🛏️ أنام 7 ساعات على الأقل','🌬️ تنفس عميق 3 دقايق','🍳 فطار صحي','🚿 دش وأنضف نفسي','📝 أكتب 3 حاجات شاكر عليها','🧹 أرتب أوضتي 10 دقايق','🤝 أكلم حد من أهلي أو صحابي'];
 return `<h3>💧 عاداتي اليومية</h3><p class="hint">العادات بتتحسب في السلسلة زي المهام بالظبط، وبتظهر في «لسه عليك النهارده» بأيقونة 💧.</p>${S.habits.map(taskRow).join('')||'<p>لسه مفيش عادات. ضيف من الاقتراحات 👇</p>'}
 <div class="add"><input id="newHabit" placeholder="عادة جديدة (مثلا 💧 أشرب 8 أكواب)"><button data-addh="1">إضافة</button></div>
 <div class="presets pl">${P.map(p=>`<button data-preset="${esc(p)}">${esc(p)}</button>`).join('')}</div>`}
function goalsView(){return `<h3>🎯 الأهداف الكبيرة</h3>${S.goals.map(g=>{const n=g.steps.length,d=g.steps.filter(x=>x.d).length,p=n?Math.round(d/n*100):0;
 return `<div class="gcard"><div class="ghead"><b>${esc(g.title)}</b><span>${d}/${n} · ${p}% ${p===100&&n?'🏆':''}</span></div><div class="pbar"><i style="width:${p}%"></i></div>
 ${g.steps.map(x=>`<div class="gstep ${x.d?'done':''}" data-g="${g.id}" data-s="${x.id}"><span class="grip" title="اسحب لإعادة الترتيب">⠿</span><button class="chk sm" data-gs="${g.id}:${x.id}">${x.d?'✓':''}</button><span>${esc(x.t)}</span><button class="del" title="حذف الخطوة" data-gsdel="${g.id}:${x.id}">🗑️</button></div>`).join('')}
 <div class="gbtns"><button data-gadd="${g.id}">➕ خطوة</button><button data-gedit="${g.id}">✏️ تعديل</button><button class="trashb" data-gdel="${g.id}">🗑️ حذف الهدف</button></div></div>`}).join('')||'<p>مفيش أهداف لسه. مثال: "خلص كورس JS" وقسمه لخطوات.</p>'}
 <div class="tools"><button data-gnew="1">➕ هدف جديد</button></div>`}
/* ---------- v4.2: أذكار كاملة من مصادر موثوقة (نص القرآن من Tanzil / alquran.cloud) ---------- */
const KURSI='اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ';
const IKHLAS='قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ';
const FALAQ='قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ';
const NAS='قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ';
const QULS=IKHLAS+'\n'+FALAQ+'\n'+NAS;
const TASBIH='سُبْحَانَ اللَّهِ ٣٣، الْحَمْدُ لِلَّهِ ٣٣، اللَّهُ أَكْبَرُ ٣٤';
const ADK=[
 ['morning','🌅 أذكار الصباح',[
  {h:'آية الكرسي',t:KURSI,n:'مرة واحدة',s:'سورة البقرة ٢٥٥ - من قالها حين يُصبح أُجير من الجن حتى يمسي (حصن المسلم)'},
  {h:'الإخلاص والمعوذتين',t:QULS,n:'٣ مرات',s:'رواه أبو داود والترمذي'},
  {h:'دعاء الصباح',t:'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',n:'مرة واحدة',s:'رواه الترمذي'},
  {h:'سبحان الله وبحمده',t:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',n:'١٠٠ مرة',s:'رواه مسلم'},
  {h:'الاستغفار',t:'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',n:'١٠٠ مرة',s:'رواه البخاري'},
  {h:'التوحيد',t:'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',n:'١٠ مرات',s:'حصن المسلم'}]],
 ['evening','🌇 أذكار المساء',[
  {h:'آية الكرسي',t:KURSI,n:'مرة واحدة',s:'سورة البقرة ٢٥٥ - من قالها حين يمسي أُجير من الجن حتى يصبح (حصن المسلم)'},
  {h:'الإخلاص والمعوذتين',t:QULS,n:'٣ مرات',s:'رواه أبو داود والترمذي'},
  {h:'دعاء المساء',t:'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',n:'مرة واحدة',s:'رواه أبو داود'},
  {h:'الاستعاذة',t:'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',n:'٣ مرات',s:'رواه مسلم'},
  {h:'سبحان الله وبحمده',t:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',n:'١٠٠ مرة',s:'رواه مسلم'}]],
 ['after','📿 أذكار بعد الصلاة',[
  {h:'بعد السلام',t:'أَسْتَغْفِرُ اللَّهَ (٣ مرات)، ثم: اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',n:'بعد كل صلاة',s:'رواه مسلم'},
  {h:'التسبيح',t:TASBIH,n:'بعد كل صلاة',s:'متفق عليه'},
  {h:'آية الكرسي',t:KURSI,n:'بعد كل صلاة',s:'رواه النسائي (حصن المسلم)'}]],
 ['sleep','🌙 أذكار النوم',[
  {h:'آية الكرسي',t:KURSI,n:'مرة واحدة',s:'رواه البخاري'},
  {h:'الإخلاص والمعوذتين في الكفين',t:QULS,n:'٣ مرات',s:'رواه أبو داود'},
  {h:'دعاء النوم',t:'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',n:'مرة واحدة',s:'رواه البخاري'},
  {h:'التسبيح',t:TASBIH,n:'قبل النوم',s:'متفق عليه'}]]];
const DUAS=['ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار','رب اشرح لي صدري ويسر لي أمري','رب زدني علمًا','اللهم إني أسألك علمًا نافعًا ورزقًا طيبًا وعملًا متقبلًا','اللهم أعني على ذكرك وشكرك وحسن عبادتك','اللهم إني أعوذ بك من الهم والحزن والعجز والكسل','يا مقلب القلوب ثبت قلبي على دينك','اللهم اغفر لي ولوالدي وارحمهما كما ربياني صغيرًا','حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم'];
function prayView(){const d=S.pray[today()]||{},a=S.adk[today()]||{};const dn=prDone();
 return `<div class="praywrap"><div>
 <div class="pbox"><div class="pboxhead"><h3>🕌 صلوات النهارده</h3><span class="ppill">${dn}/5</span></div>
 <div class="pbar"><i style="width:${dn/5*100}%"></i></div>
 <div class="pgrid">${PR2.map(([i,n,ic])=>`<button class="pcard ${d[i]?'on':''}" data-pr="${i}"><span class="pic">${ic}</span><span class="pc">${d[i]?'✓':''}</span><b>${n}</b></button>`).join('')}</div>
 <p class="hint">${dn===5?'ما شاء الله، الخمسة اتصلوا 🌟':dn>0?'كمّل، فاضل '+(5-dn)+' صلوات':'ابدأ بأقرب صلاة 🕌'}</p></div>
 <h3>📿 أذكار اليوم</h3><div class="adk">${ADK.map(([id,t,items])=>`<div class="acard ${a[id]?'on':''}"><div class="ahead"><button class="achk" data-ad="${id}">${a[id]?'✓':''}</button><b>${t}</b></div>
 ${items.map(x=>`<details class="aitem"><summary><span>${esc(x.h)}</span><small>${esc(x.n)}</small></summary><p class="quran">${esc(x.t)}</p><small class="asrc">المصدر: ${esc(x.s)}</small></details>`).join('')}</div>`).join('')}</div></div>
 <div><h3>🤲 أدعية</h3><div class="duas">${DUAS.map(x=>`<div class="dua">${esc(x)}</div>`).join('')}</div></div></div>`}
function settingsView(){return `<h3>⚙️ إعدادات الالتزام</h3><div class="set"><label>اليوم يتحسب لما تخلص <select id="minPct">${[[0,'مهمة واحدة'],[50,'50% من المهام'],[100,'كل المهام']].map(([v,l])=>`<option value="${v}" ${S.minPct===v?'selected':''}>${l}</option>`).join('')}</select></label><label>هدف الأسبوع <select id="wt">${[3,4,5,6,7].map(v=>`<option ${S.weekTarget===v?'selected':''}>${v}</option>`).join('')}</select> أيام</label><label>تذكير يومي <input type="time" id="rem" value="${S.remind}"></label></div>
 <h3>💾 البيانات</h3><div class="tools"><button data-export>⬇️ نسخة احتياطية</button><label class="filebtn">⬆️ استرجاع<input type="file" id="imp" accept=".json" hidden></label><button data-reset>🗑️ إعادة ضبط</button></div>`}
/* ---------- course ---------- */
const CS={sec:-1};
const cWatched=n=>!!S.course.v[n];
const cLessons=()=>COURSE.flatMap(x=>x.l);
function cNext(){const l=cLessons().find(x=>!cWatched(x[0]));return l||null}
function cSecOf(n){return COURSE.findIndex(s=>s.l.some(x=>x[0]===n))}
function courseView(){const all=cLessons(),w=all.filter(x=>cWatched(x[0])).length,ad=COURSE.filter((s,i)=>S.course.a[i]).length;
 if(CS.sec<0||CS.sec>=COURSE.length){const nx=cNext();CS.sec=nx?cSecOf(nx[0]):COURSE.length-1}
 const nx=cNext(),lg=S.course.log[today()]||{v:[],a:[]},sec=COURSE[CS.sec];
 const na=COURSE.findIndex((s,i)=>!S.course.a[i]);
 const pcv=Math.round(w/all.length*100);
 const first=sec.l[0][0],last=sec.l[sec.l.length-1][0],sw=sec.l.filter(x=>cWatched(x[0])).length;
 return `<div class="cwrap"><div class="cards c4"><div class="card"><div class="n">${w}/${all.length}</div><div class="l">🎬 فيديوهات اتشافت</div></div><div class="card"><div class="n">${ad}/${COURSE.length}</div><div class="l">📝 تكليفات اتحلت</div></div><div class="card"><div class="n">${pcv}%</div><div class="l">تقدمك في الكورس</div></div><div class="card"><div class="n">${lg.v.length}🎬 ${lg.a.length}📝</div><div class="l">اللي عملته النهارده</div></div></div>
 <div class="cprog"><div class="pbar big"><i style="width:${pcv}%"></i></div><span>${w} من ${all.length} درس · ${ad} من ${COURSE.length} تكليف</span></div>
 <div class="cnext">${nx?`<div><small>🎬 الفيديو الجاي</small><b>#${String(nx[0]).padStart(3,'0')} · ${esc(nx[1])}</b></div><button class="main" data-cnext="1">اتفرجت عليه ✓</button>`:'<b>🏆 خلصت كل الفيديوهات!</b>'}
 ${na>=0?`<div><small>📝 التكليف الجاي</small><b>${esc(COURSE[na].n)} (دروس ${COURSE[na].l[0][0]} إلى ${COURSE[na].l[COURSE[na].l.length-1][0]})</b></div><button class="main" data-cas="${na}">حليته ✓</button>`:''}</div>
 <p class="hint">💡 الفيديو الجاي والتكليف الجاي بيظهروا كمان في «لسه عليك النهارده» في الرئيسية.</p>
 <div class="cbody"><div class="cside"><b class="csidehead">📚 أقسام الكورس</b>${COURSE.map((s,i)=>{const dn2=s.l.every(x=>cWatched(x[0]));const swc=s.l.filter(x=>cWatched(x[0])).length;return `<button class="csec2 ${i===CS.sec?'on':''} ${dn2?'dn':''}" data-csec="${i}"><span class="csn">${i+1}</span><span class="cst" dir="ltr">${esc(s.n)}</span><small>${swc}/${s.l.length}${S.course.a[i]?' ·📝✓':''}</small></button>`}).join('')}</div>
 <div class="cmain"><div class="csechead"><b>${CS.sec+1}. ${esc(sec.n)}</b><span>دروس ${first} إلى ${last} · ${sw}/${sec.l.length} اتشافت</span><button class="${S.course.a[CS.sec]?'on':''}" data-cas="${CS.sec}">${S.course.a[CS.sec]?'✅ التكليف اتحل':'📝 علّم التكليف اتحل'}</button></div>
 <div class="clist">${sec.l.map(x=>`<button class="cl ${cWatched(x[0])?'on':''}" data-cl="${x[0]}"><span>${cWatched(x[0])?'✓':'○'}</span><b>${String(x[0]).padStart(3,'0')}</b><em>${esc(x[1])}</em></button>`).join('')}</div></div></div></div>`}
function sectionOf(id){if(!id)return 'بدون ربط بمهمة';if(S.habits.some(h=>h.id===id))return '💧 العادات';const s=S.sections.find(s=>s.tasks.some(t=>t.id===id));return s?s.icon+' '+s.name:'مهام محذوفة'}
function statsView(){const R=S.statRange,ks=[];for(let i=R-1;i>=0;i--){const x=new Date();x.setDate(x.getDate()-i);ks.push(dk(x))}
 const by={},perDay=ks.map(k=>{let t=0;(S.fl[k]||[]).forEach(e=>{const n=sectionOf(e.t);by[n]=(by[n]||0)+e.m;t+=e.m});return t});
 const tot=perDay.reduce((a,b)=>a+b,0),mx=Math.max(1,...perDay),rows=Object.entries(by).sort((a,b)=>b[1]-a[1]),rmx=rows.length?rows[0][1]:1;
 const avg=Math.round(ks.map(k=>pct(k)*100).reduce((a,b)=>a+b,0)/R),okd=ks.filter(ok).length;
 const sess=ks.reduce((a,k)=>a+(S.focus[k]||0),0);
 return `<h3>📊 الإحصائيات</h3><div class="fbtns" style="justify-content:flex-start"><button class="${R===7?'main':''}" data-srange="7">آخر 7 أيام</button><button class="${R===30?'main':''}" data-srange="30">آخر 30 يوم</button></div>
 <div class="cards" style="margin-top:14px"><div class="card"><div class="n">${Math.floor(tot/60)}س ${tot%60}د</div><div class="l">إجمالي وقت التركيز</div></div><div class="card"><div class="n">${sess}</div><div class="l">جلسات تركيز</div></div><div class="card"><div class="n">${okd}/${R}</div><div class="l">أيام ملتزم فيها</div></div><div class="card"><div class="n">${avg}%</div><div class="l">متوسط الإنجاز اليومي</div></div></div>
 <h3>⏱️ وقت التركيز لكل قسم</h3><div class="hbars">${rows.map(([n,m])=>`<div class="hrow"><span>${esc(n)}</span><div class="hb"><i style="width:${Math.round(m/rmx*100)}%"></i></div><b>${m} د</b></div>`).join('')||'<p>مفيش جلسات تركيز في الفترة دي. جرب صفحة التركيز.</p>'}</div>
 <h3>📈 التركيز يوم بيوم (دقايق)</h3><div class="bars tall">${ks.map((k,i)=>`<div class="bar"><i style="height:${Math.round(perDay[i]/mx*100)}%" title="${k}: ${perDay[i]} د"></i>${R<=7?new Date(k+'T00:00:00').toLocaleDateString('ar-EG',{weekday:'short'}):(i%5===0?k.slice(8):'')}</div>`).join('')}</div>`}
const CM={y:new Date().getFullYear(),m:new Date().getMonth(),sel:today()};
function calendarView(){const first=new Date(CM.y,CM.m,1),n=new Date(CM.y,CM.m+1,0).getDate(),off=(first.getDay()+1)%7,t=today();
 let cells='';for(let i=0;i<off;i++)cells+='<div class="cd blank"></div>';
 for(let d=1;d<=n;d++){const k=dk(new Date(CM.y,CM.m,d)),fut=k>t,p=pct(k),lv=fut||!(S.log[k]&&Object.values(S.log[k]).some(v=>v>0))?0:p<.34?1:p<.67?2:3;
  cells+=`<button class="cd l${lv} ${k===t?'today':''} ${k===CM.sel?'sel':''}" data-csel="${k}"><span>${d}</span>${S.mood[k]?`<small>${S.mood[k]}</small>`:''}</button>`}
 const k=CM.sel,l=S.log[k]||{},ts=allTasks(),dn=ts.filter(x=>l[x.id]>0),ms=tasksFor(k).filter(x=>!(l[x.id]>0)),fm=(S.fl[k]||[]).reduce((a,x)=>a+x.m,0);
 const title=new Date(CM.y,CM.m,1).toLocaleDateString('ar-EG',{month:'long',year:'numeric'});
 return `<div class="calwrap"><div class="calleft"><div class="calhead"><button data-cal="-1">›</button><h3>📆 ${title}</h3><button data-cal="1">‹</button><button data-cal="0" class="tb">النهارده</button></div>
 <div class="calgrid">${['س','ح','ن','ث','ر','خ','ج'].map(x=>`<div class="ch">${x}</div>`).join('')}${cells}</div>
 <div class="leg">أقل <i class="hc"></i><i class="hc l1"></i><i class="hc l2"></i><i class="hc l3"></i> أكتر</div>
</div><div class="dayd"><h3>📌 ${new Date(k+'T00:00:00').toLocaleDateString('ar-EG',{weekday:'long',day:'numeric',month:'long'})} ${S.mood[k]||''}</h3>
 <p>التزام اليوم: <b>${Math.round(pct(k)*100)}%</b> · وقت التركيز: <b>${fm}</b> دقيقة</p>
 ${dn.length?`<div class="chips">${dn.map(x=>`<span class="chip g">✅ ${esc(x.title)}</span>`).join('')}</div>`:''}
 ${ms.length&&k<=t?`<div class="chips">${ms.map(x=>`<span class="chip r">⬜ ${esc(x.title)}</span>`).join('')}</div>`:''}
 ${S.note[k]?`<div class="quote">📝 ${esc(S.note[k])}</div>`:''}</div></div>`}
/* v4.2: مراجعة اليوم - من غير مزاج/ملاحظة، مع تعديل وتراجع وحذف */
function rvRow(t,done){const c=day()[t.id]||0;const so=srcOf(t.id);
 return `<div class="rvrow ${done?'g':'r'}"><span class="src" title="${esc(so.name)}">${so.icon}</span><span class="t">${esc(t.title)}${done&&c>1?` <small>×${c}</small>`:''}</span>
 ${done?`<button class="del" data-rvundo="${t.id}" title="تراجع (نقص مرة)">↩️</button><button class="del" data-edit="${t.id}" title="تعديل">✏️</button><button class="del" data-rvclear="${t.id}" title="امسح تسجيلها النهارده">🗑️</button>`:`<button class="del" data-edit="${t.id}" title="تعديل">✏️</button><button class="del" data-del="${t.id}" title="حذف المهمة">🗑️</button>`}</div>`}
function reviewView(){const ts=dueToday(),dn=ts.filter(doneToday),un=ts.filter(t=>!doneToday(t)),tm=(S.fl[today()]||[]).reduce((a,x)=>a+x.m,0);
 return `<h3>🌙 مراجعة آخر اليوم</h3><div class="cards"><div class="card"><div class="n">${dn.length}</div><div class="l">اتعمل ✅</div></div><div class="card"><div class="n">${un.length}</div><div class="l">اتأجل ⏳</div></div><div class="card"><div class="n">${tm}</div><div class="l">دقيقة تركيز</div></div><div class="card"><div class="n">${streak()}</div><div class="l">أيام متواصلة 🔥</div></div></div>
 <div class="grid2"><div><h3>✅ اللي اتعمل</h3>${dn.map(t=>rvRow(t,true)).join('')||'<p>لسه مفيش حاجة.</p>'}</div>
 <div><h3>⏳ اللي اتأجل</h3>${un.map(t=>rvRow(t,false)).join('')||'<p>خلصت كل حاجة، برافو 🎉</p>'}
 <p class="hint">📦 اللي ما اتعملش بيتنقل لوحده لبكرة، وممكن تعدل أو تحذف أي مهمة من هنا.</p></div></div>`}
function render(){nav();document.getElementById('date').textContent=new Date().toLocaleDateString('ar-EG',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
 document.getElementById('streak').textContent=streak();
 document.body.dataset.theme=S.theme;const tb=document.getElementById('theme');if(tb)tb.textContent=S.theme==='dark'?'☀️':'🌙';const h=new Date().getHours();document.getElementById('greet').textContent=(h<12?'صباح الخير':h<18?'نهارك سعيد':'مساء الخير')+' يا Malky 👋';
 const s=S.sections.find(x=>x.id===S.view);const V={pray:prayView,course:courseView,settings:settingsView,focus:focusView,habits:habitsView,goals:goalsView,stats:statsView,calendar:calendarView,review:reviewView,home};
 document.getElementById('view').innerHTML=V[S.view]?V[S.view]():s?sectionView(s):(S.view='home',home());save()}
/* ---------- events ---------- */
const parseSteps=t=>t.split('\n').map(x=>x.trim()).filter(Boolean).map(x=>({id:uid(),t:x,d:false}));
document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b||b.closest('.ovl'))return;const q=k=>b.dataset[k];
 if(b.id==='theme'){S.theme=S.theme==='dark'?'light':'dark'}
 else if(q('f')){const f=q('f');
  if(f==='toggle'){FT.run?pauseTimer():startTimer()}
  else if(f==='done'){if(FT.mode==='work'&&FT.run)pauseTimer();if(FT.mode==='work'&&FT.total-FT.left<60){toast('لازم يعدي دقيقة على الأقل');return}finish('part');return}
  else if(f==='skip'){finish(null);return}
  else if(f==='reset'){FT.startedAt=0;setMode(FT.mode)}
  else if(f==='w'||f==='b'||f==='l'){FT.startedAt=0;setMode(f==='w'?'work':f==='b'?'break':'long')}
  else{const d=parseInt(f);if(FT.run)FT.end+=d*60000;FT.left=Math.max(60,FT.left+d*60);FT.total=Math.max(60,FT.total+d*60);if(FT.run)FT.left=Math.ceil((FT.end-Date.now())/1000)}}
 else if(q('fp')){const [w2,b2]=q('fp').split(':').map(Number);S.fs.work=w2;S.fs.brk=b2;if(!FT.run&&!FT.startedAt){setMode('work')}toast('⚡ '+w2+' تركيز / '+b2+' راحة')}
 else if(q('fset')!==undefined){S.fsetOpen=!S.fsetOpen}
 else if(q('rvundo')){const l=day(),id=q('rvundo');l[id]=Math.max(0,(l[id]||0)-1)}
 else if(q('rvclear')){day()[q('rvclear')]=0}
 else if(q('pr')){const d=S.pray[today()]=S.pray[today()]||{};d[q('pr')]=d[q('pr')]?0:1}
 else if(q('ad')){const d=S.adk[today()]=S.adk[today()]||{};d[q('ad')]=d[q('ad')]?0:1}
 else if(q('cl')){const n=+q('cl'),lg=(S.course.log[today()]=S.course.log[today()]||{v:[],a:[]});if(cWatched(n)){delete S.course.v[n];lg.v=lg.v.filter(x=>x!==n)}else{S.course.v[n]=1;if(!lg.v.includes(n))lg.v.push(n)}}
 else if(q('cnext')){const nx=cNext();if(nx){const lg=(S.course.log[today()]=S.course.log[today()]||{v:[],a:[]});S.course.v[nx[0]]=1;lg.v.push(nx[0]);CS.sec=-1;toast('🎬 تمام، فيديو '+nx[0])}}
 else if(q('cas')){const i=+q('cas'),lg=(S.course.log[today()]=S.course.log[today()]||{v:[],a:[]});if(S.course.a[i]){delete S.course.a[i];lg.a=lg.a.filter(x=>x!==i)}else{S.course.a[i]=1;if(!lg.a.includes(i))lg.a.push(i);toast('📝 تكليف '+COURSE[i].n+' اتحل')}}
 else if(q('csec')){CS.sec=+q('csec')}
 else if(q('key')){S.key[today()]=S.key[today()]===q('key')?null:q('key')}
 else if(q('mood')){S.mood[today()]=q('mood')}
 else if(b.hasAttribute('data-export')){const u=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));const l=document.createElement('a');l.href=u;l.download='yawmi-backup-'+today()+'.json';l.click();toast('تم تنزيل النسخة ✅');return}
 else if(q('edit')){const t=allTasks().find(x=>x.id===q('edit'));if(!t)return;const r=await ask({title:'تعديل المهمة',fields:[{id:'title',label:'اسم المهمة',value:t.title},{id:'days',type:'days',label:'تتكرر في أيام',value:t.days||[]}],ok:'حفظ'});if(!r||!r.title.trim())return;t.title=r.title.trim();t.days=r.days.length&&r.days.length<7?r.days:undefined}
 else if(q('v')){S.view=q('v')}
 else if(q('tick')){const l=day();l[q('tick')]=l[q('tick')]>0?0:1;if(l[q('tick')]){const ts=dueToday();if(ts.every(t=>l[t.id]>0)){setTimeout(()=>{confetti();toast('خلصت كل مهامك! 🎉')},50)}}}
 else if(q('p')){const l=day();l[q('p')]=(l[q('p')]||0)+1}
 else if(q('m')){const l=day();l[q('m')]=Math.max(0,(l[q('m')]||0)-1)}
 else if(q('del')!==undefined){const t=allTasks().find(x=>x.id===q('del'));if(!await confirmD('حذف المهمة؟','"'+(t?t.title:'')+'" هتتحذف نهائيًا.'))return;S.sections.forEach(s=>s.tasks=s.tasks.filter(t=>t.id!==q('del')));S.habits=S.habits.filter(h=>h.id!==q('del'))}
 else if(q('add')){const i=document.getElementById('newTask'),v=i.value.trim();if(!v)return;const s=S.sections.find(x=>x.id===q('add'));s.tasks.push({id:uid(),title:v,played:s.id==='games'})}
 else if(q('addh')){const i=document.getElementById('newHabit'),v=i.value.trim();if(!v)return;S.habits.push({id:uid(),title:v})}
 else if(q('preset')){if(S.habits.some(h=>h.title===q('preset')))return toast('موجودة بالفعل');S.habits.push({id:uid(),title:q('preset')})}
 else if(q('delsec')){if(!await confirmD('حذف القسم؟','القسم بكل مهامه هيتحذف.'))return;S.sections=S.sections.filter(s=>s.id!==q('delsec'));S.view='home'}
 else if(b.id==='addSection'){const r=await ask({title:'قسم جديد',fields:[{id:'name',label:'اسم القسم',value:'',ph:'مثلا: الرياضة'},{id:'icon',type:'emoji',label:'إيموجي',value:'📌'}],ok:'إضافة'});if(!r||!r.name.trim())return;const id=uid();S.sections.push({id,name:r.name.trim(),icon:r.icon.trim()||'📌',tasks:[]});S.view=id}
 else if(b.hasAttribute('data-reset')){if(!await confirmD('إعادة ضبط؟','كل البيانات هتتمسح ومش هترجع. اعمل نسخة احتياطية الأول.','امسح كل حاجة'))return;localStorage.removeItem(KEY);location.reload();return}
 else if(q('gnew')){const r=await ask({title:'هدف جديد',fields:[{id:'title',label:'الهدف',value:'',ph:'مثلا: خلص كورس JavaScript'},{id:'steps',type:'textarea',label:'الخطوات (كل خطوة في سطر)',value:'',ph:'أساسيات\nالدوال\nمشروع صغير'}],ok:'إضافة'});if(!r||!r.title.trim())return;S.goals.push({id:uid(),title:r.title.trim(),steps:parseSteps(r.steps)})}
 else if(q('gadd')){const g=S.goals.find(x=>x.id===q('gadd'));const r=await ask({title:'خطوات جديدة',fields:[{id:'steps',type:'textarea',label:'كل خطوة في سطر',value:''}],ok:'إضافة'});if(!r)return;g.steps.push(...parseSteps(r.steps))}
 else if(q('gedit')){const g=S.goals.find(x=>x.id===q('gedit'));const r=await ask({title:'تعديل الهدف',fields:[{id:'title',label:'الهدف',value:g.title}],ok:'حفظ'});if(!r||!r.title.trim())return;g.title=r.title.trim()}
 else if(q('gdel')){const g=S.goals.find(x=>x.id===q('gdel'));if(!await confirmD('حذف الهدف؟','"'+g.title+'" بكل خطواته.'))return;S.goals=S.goals.filter(x=>x!==g)}
 else if(q('gs')){const [a,c]=q('gs').split(':');const st=S.goals.find(x=>x.id===a).steps.find(x=>x.id===c);st.d=!st.d;const g=S.goals.find(x=>x.id===a);if(st.d&&g.steps.every(x=>x.d)){confetti();toast('🏆 خلصت الهدف: '+g.title)}}
 else if(q('gsdel')){const [a,c]=q('gsdel').split(':');const g=S.goals.find(x=>x.id===a);g.steps=g.steps.filter(x=>x.id!==c)}
 else if(q('srange')){S.statRange=+q('srange')}
 else if(q('csel')){CM.sel=q('csel')}
 else if(q('cal')!==undefined){const d=+q('cal');if(d===0){const n=new Date();CM.y=n.getFullYear();CM.m=n.getMonth();CM.sel=today()}else{const n=new Date(CM.y,CM.m+d,1);CM.y=n.getFullYear();CM.m=n.getMonth()}}
 else if(q('carry')){const tmr=new Date();tmr.setDate(tmr.getDate()+1);const k=dk(tmr);const ids=dueToday().filter(t=>!doneToday(t)).map(t=>t.id);S.carry[k]=[...new Set([...(S.carry[k]||[]),...ids])];toast('📦 اتنقلت '+ids.length+' مهمة لبكرة')}
 else return;
 render()});
document.addEventListener('keydown',e=>{
 if(e.key==='Enter'&&e.target.id==='newTask')document.querySelector('[data-add]').click();
 if(e.key==='Enter'&&e.target.id==='newHabit')document.querySelector('[data-addh]').click();
 if(e.code==='Space'&&S.view==='focus'&&!/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(e.target.tagName)){e.preventDefault();FT.run?pauseTimer():startTimer();render()}});
document.addEventListener('input',e=>{if(e.target.id==='note'){S.note[today()]=e.target.value;save()}});
document.addEventListener('change',e=>{const t=e.target;
 if(t.id==='ftask'){FT.task=t.value;render();return}
 if(t.dataset.fs){S.fs[t.dataset.fs]=Math.max(1,Math.min(+t.max||180,+t.value||1));if(!FT.run&&!FT.startedAt)setMode(FT.mode);render();return}
 if(t.dataset.fsb){S.fs[t.dataset.fsb]=t.checked;save();return}
 if(t.id==='minPct'){S.minPct=+t.value;render()}if(t.id==='wt'){S.weekTarget=+t.value;render()}if(t.id==='rem'){S.remind=t.value;if(S.remind&&'Notification' in window)Notification.requestPermission();render()}
 if(t.id==='imp'){const f=t.files[0];if(!f)return;f.text().then(x=>{try{const d=JSON.parse(x);if(!d.sections)throw 0;localStorage.setItem(KEY,x);location.reload()}catch(z){ask({title:'الملف مش صالح',msg:'اختار ملف نسخة احتياطية من يومي.',ok:'تمام',noCancel:true})}})}});
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
if(location.hash.length>1){const h=location.hash.slice(1);if(VIEWS.some(v=>v[0]===h))S.view=h}
render();
setInterval(()=>{if(!S.remind)return;const n=new Date(),hm=String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0');if(hm>=S.remind&&S.lastRemind!==today()&&!ok(today())){S.lastRemind=today();save();try{if(Notification.permission==='granted')new Notification('يومي',{body:'لسه ما سجلتش حاجة النهارده. مهمة واحدة بس! 💪'})}catch(e){}toast('⏰ وقت مهامك! مهمة واحدة بس')}},30000);

document.addEventListener('visibilitychange',()=>{if(FT.run)ftick()});
window.addEventListener('focus',()=>{if(FT.run)ftick()});

let DR=null;
document.addEventListener('pointerdown',e=>{const g=e.target.closest('.grip');if(!g)return;const row=g.closest('.gstep');DR={row,card:row.closest('.gcard'),gid:row.dataset.g,y0:e.clientY,to:null};row.classList.add('drag');e.preventDefault()});
document.addEventListener('pointermove',e=>{if(!DR)return;DR.row.style.transform='translateY('+(e.clientY-DR.y0)+'px)';
 const rows=[...DR.card.querySelectorAll('.gstep')];rows.forEach(r=>r.classList.remove('ob','oa'));DR.to=null;
 for(const r of rows){if(r===DR.row)continue;const b=r.getBoundingClientRect();if(e.clientY>=b.top&&e.clientY<=b.bottom){const bef=e.clientY<b.top+b.height/2;r.classList.add(bef?'ob':'oa');DR.to={id:r.dataset.s,bef};break}}});
function endDrag(){if(!DR)return;const d=DR;DR=null;if(d.to){const g=S.goals.find(x=>x.id===d.gid),id=d.row.dataset.s,i=g.steps.findIndex(x=>x.id===id),it=g.steps.splice(i,1)[0];let j=g.steps.findIndex(x=>x.id===d.to.id);if(!d.to.bef)j++;g.steps.splice(j,0,it)}render()}
document.addEventListener('pointerup',endDrag);document.addEventListener('pointercancel',endDrag);
