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
function taskRow(t){const c=day()[t.id]||0;const done=c>0;const off=!due(t,today());
 return `<div class="task ${done?'done':''} ${off?'off':''}"><button class="chk" data-tick="${t.id}">${done?'✓':''}</button><span class="t">${S.key[today()]===t.id?'⭐ ':''}${esc(t.title)}${t.days&&t.days.length?` <small class="rep">${daysLabel(t)}</small>`:''}</span>${tstreak(t.id)>=2?`<span class="sk">🔥 ${tstreak(t.id)}</span>`:''}<button class="del" data-key="${t.id}" title="مهمة اليوم الأساسية">⭐</button>
 ${t.played?`<span class="cnt"><button data-m="${t.id}">−</button><b>${c}</b><button data-p="${t.id}">+</button></span>`:''}
 <button class="del" data-edit="${t.id}" title="تعديل">✏️</button><button class="del" data-del="${t.id}" title="حذف">🗑</button></div>`}
const QUOTES=['الاستمرارية أهم من الكمال 💎','خطوة صغيرة كل يوم بتعمل فرق كبير 🌱','النهارده أحسن من إمبارح بحاجة بسيطة ✨','ابدأ بأسهل مهمة وهتشد الباقي 🚀','ريّح دماغك شوية وارجع أقوى 🧘'];
const quote=()=>QUOTES[new Date().getDate()%QUOTES.length];
function heat(){let h='';for(let i=27;i>=0;i--){const x=new Date();x.setDate(x.getDate()-i);const p=pct(dk(x));h+=`<i class="hc l${p===0?0:p<.34?1:p<.67?2:3}" title="${dk(x)} · ${Math.round(p*100)}%"></i>`}return `<div class="heat">${h}</div>`}
const MOODS=['😫','😕','😐','🙂','🤩'];

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
function setMode(m){clearInterval(FT.iv);FT.run=false;FT.mode=m;FT.total=FT.left=modeLen(m)}
function fmt(s){s=Math.max(0,s);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function beep(){if(!S.fs.sound)return;try{const a=new(window.AudioContext||window.webkitAudioContext)();[0,.25,.5].forEach(t=>{const o=a.createOscillator(),g=a.createGain();o.frequency.value=t===.5?880:660;o.connect(g);g.connect(a.destination);g.gain.setValueAtTime(.2,a.currentTime+t);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+t+.2);o.start(a.currentTime+t);o.stop(a.currentTime+t+.22)})}catch(e){}}
function startTimer(){FT.run=true;FT.end=Date.now()+FT.left*1000;if(!FT.startedAt)FT.startedAt=Date.now();clearInterval(FT.iv);FT.iv=setInterval(ftick,500)}
function pauseTimer(){clearInterval(FT.iv);FT.run=false;FT.left=Math.max(0,Math.ceil((FT.end-Date.now())/1000))}
function recordFocus(m){if(m<1)return;const k=today();(S.fl[k]=S.fl[k]||[]).push({t:FT.task||'',m:Math.round(m)});S.focus[k]=(S.focus[k]||0)+1}
function nextAfter(){if(FT.mode==='work'){FT.cycle++;return FT.cycle%S.fs.every===0?'long':'break'}return 'work'}
function finish(rec){clearInterval(FT.iv);FT.run=false;
 if(FT.mode==='work'&&rec)recordFocus(rec==='full'?FT.total/60:(FT.total-FT.left)/60);
 const wasWork=FT.mode==='work';FT.startedAt=0;setMode(nextAfter());
 if(rec==='full'){beep();try{navigator.vibrate&&navigator.vibrate([200,100,200])}catch(e){}if(wasWork)confetti();toast(wasWork?'🎉 خلصت جلسة تركيز!':'⏰ الراحة خلصت');if(S.fs.auto)startTimer()}
 render()}
function ftick(){FT.left=Math.ceil((FT.end-Date.now())/1000);
 const el=document.getElementById('ft');if(el)el.textContent=fmt(FT.left);
 const r=document.getElementById('fring');if(r)r.style.setProperty('--p',Math.round((1-FT.left/FT.total)*100));
 document.title=(FT.run?fmt(FT.left)+' · ':'')+'يومي';
 if(FT.left<=0)finish('full')}
function focusView(){const k=today(),m=S.focus[k]||0,tm=(S.fl[k]||[]).reduce((a,x)=>a+x.m,0);
 const opts=dueToday().filter(t=>!doneToday(t)).map(t=>`<option value="${t.id}" ${FT.task===t.id?'selected':''}>${esc(t.title)}</option>`).join('');
 const nm=(id,l,v,mx)=>`<label>${l} <input type="number" min="1" max="${mx||180}" data-fs="${id}" value="${v}"></label>`;
 return `<h3>⏱️ وقت التركيز</h3><div class="focus"><div class="fmode">${modeName(FT.mode)}${FT.mode==='work'?` · الجلسة ${FT.cycle%S.fs.every+1} من ${S.fs.every}`:''}</div>
 <div class="ring big" id="fring" style="--p:${Math.round((1-FT.left/FT.total)*100)}"><div class="ftime" id="ft">${fmt(FT.left)}</div></div>
 <div class="ftask"><label>🎯 الجلسة دي لمهمة: <select id="ftask"><option value="">من غير ربط</option>${opts}</select></label></div>
 <div class="fbtns"><button data-f="toggle" class="main">${FT.run?'⏸ إيقاف مؤقت':(FT.startedAt?'▶ كمّل':'▶ ابدأ')}</button><button data-f="done">✔ إنهاء وتسجيل</button><button data-f="skip">⏭ تخطي</button><button data-f="reset">↺ إعادة</button></div>
 <div class="fbtns small"><button data-f="-5">−5 د</button><button data-f="-1">−1 د</button><button data-f="+1">+1 د</button><button data-f="+5">+5 د</button><button data-f="w">تركيز</button><button data-f="b">راحة</button><button data-f="l">راحة طويلة</button></div>
 <p class="fstat">جلسات النهارده: <b>${m}</b> · وقت التركيز: <b>${tm}</b> دقيقة</p></div>
 <h3>⚙️ إعدادات التركيز</h3><div class="set">${nm('work','تركيز (د)',S.fs.work)}${nm('brk','راحة (د)',S.fs.brk)}${nm('long','راحة طويلة (د)',S.fs.long)}${nm('every','جلسات قبل الراحة الطويلة',S.fs.every,10)}<label><input type="checkbox" data-fsb="auto" ${S.fs.auto?'checked':''}> تشغيل تلقائي للجلسة اللي بعدها</label><label><input type="checkbox" data-fsb="sound" ${S.fs.sound?'checked':''}> صوت عند النهاية</label></div>`}
function confetti(){const c=document.createElement('div');c.className='conf';let h='';for(let i=0;i<40;i++)h+=`<i style="left:${Math.random()*100}%;background:hsl(${Math.random()*360},80%,60%);animation-delay:${Math.random()*.4}s"></i>`;c.innerHTML=h;document.body.appendChild(c);setTimeout(()=>c.remove(),2200)}
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2400)}

/* ---------- nav ---------- */
const VIEWS=[['home','🏠 الرئيسية'],['calendar','📆 التقويم'],['focus','⏱️ التركيز'],['habits','💧 العادات'],['goals','🎯 الأهداف'],['stats','📊 الإحصائيات'],['review','🌙 مراجعة اليوم']];
function nav(){document.getElementById('nav').innerHTML=
 VIEWS.map(([v,l])=>`<button class="nav-btn ${S.view===v?'active':''}" data-v="${v}"><span>${l}</span>${v==='focus'&&FT.run?`<small>${fmt(FT.left)}</small>`:''}</button>`).join('')+
 '<div class="sep"></div>'+
 S.sections.map(s=>{const ts=s.tasks.filter(t=>due(t,today()));const d=ts.filter(doneToday).length;return `<button class="nav-btn ${S.view===s.id?'active':''}" data-v="${s.id}"><span>${s.icon} ${esc(s.name)}</span><small>${d}/${ts.length}</small></button>`}).join('')}

/* ---------- views ---------- */
function home(){const ts=dueToday(),d=ts.filter(doneToday).length,p=ts.length?Math.round(d/ts.length*100):0;
 const plays=Object.values(day()).reduce((a,b)=>a+b,0);
 const gamesSec=S.sections.find(s=>s.id==='games');
 const gt=gamesSec?gamesSec.tasks.reduce((a,t)=>a+total(t.id),0):0;
 const days=[];for(let i=6;i>=0;i--){const x=new Date();x.setDate(x.getDate()-i);days.push([dk(x),x.toLocaleDateString('ar-EG',{weekday:'short'})])}
 const msg=p===100&&ts.length?'خلصت كل حاجة النهارده! 🎉':p>=50?'قربت، كمّل يا وحش 💪':'يلا نبدأ اليوم 🚀';
 const mood=S.mood[today()];
 const y=new Date();y.setDate(y.getDate()-1);const missed=!ok(dk(y))&&Object.keys(S.log).length>0&&!ok(today());
 const kt=allTasks().find(t=>t.id===S.key[today()]);
 const wd=weekDays(),wdone=wd.filter(ok).length;
 const bs=streak(),bb=best(),fs=Object.values(S.focus).reduce((x,y)=>x+y,0);
 const BG=[['🌱 3 أيام',bb>=3],['🔥 7 أيام',bb>=7],['💪 14 يوم',bb>=14],['👑 30 يوم',bb>=30],['⏱️ 10 جلسات تركيز',fs>=10],['🎯 50 جلسة',fs>=50]];
 const avg=Math.round(wd.map(k=>pct(k)*100).reduce((x,y)=>x+y,0)/7);
 const carried=(S.carry[today()]||[]).length;
 const todo=ts.filter(t=>!doneToday(t));
 return `${missed?'<div class="warn">⚠️ فاتك إمبارح. قاعدة ذهبية: ما تفوتش مرتين ورا بعض. خلص مهمة واحدة بس النهارده 💛</div>':''}${carried?`<div class="warn">📦 عندك ${carried} مهمة متأجلة من إمبارح.</div>`:''}<div class="key">${kt?`⭐ مهمتك الأساسية النهارده: <b>${esc(kt.title)}</b> ${doneToday(kt)?'✅':''}`:`⭐ اختار مهمة أساسية واحدة النهارده (دوس على ⭐ جنب أي مهمة)`}</div><div class="quote">${quote()}</div><div class="hero"><div class="ring" style="--p:${p}"><div>${p}%</div></div><div><h2>${msg}</h2><p>خلصت ${d} من ${ts.length} مهمة النهارده</p></div></div>
 <div class="cards"><div class="card"><div class="n">${d}</div><div class="l">مهام خلصتها النهارده ✅</div></div>
 <div class="card"><div class="n">${plays}</div><div class="l">مرات اتسجلت النهارده</div></div>
 <div class="card"><div class="n">${gt}</div><div class="l">إجمالي مرات اللعب 🎮</div></div>
 <div class="card"><div class="n">${bs}</div><div class="l">أيام متواصلة 🔥</div></div></div>
 <div class="grid2"><div><h3>✅ لسه عليك النهارده</h3>${todo.length?todo.slice(0,8).map(taskRow).join(''):'<p>مفيش حاجة باقية 🎉</p>'}</div>
 <div><h3>📅 الأسبوع ده: ${wdone} من ${S.weekTarget} أيام ${wdone>=S.weekTarget?'🏆':''}</h3><div class="wk">${wd.map((k,i)=>`<div class="wd ${ok(k)?'on':''}">${DN[(i+6)%7]}</div>`).join('')}<span>متوسط الأسبوع ${avg}% · أطول سلسلة ${bb} يوم</span></div>
 <h3>🏅 إنجازات</h3><div class="badges">${BG.map(([n,o])=>`<div class="badge ${o?'on':''}">${n}</div>`).join('')}</div>
 <h3>آخر ٢٨ يوم</h3>${heat()}</div></div>
 <div class="grid2"><div><h3>إزاي حاسس النهارده؟</h3><div class="moods">${MOODS.map(m=>`<button class="mood ${mood===m?'on':''}" data-mood="${m}">${m}</button>`).join('')}</div>
 <h3>📝 ملاحظة اليوم</h3><textarea id="note" placeholder="اكتب أي حاجة عن يومك...">${esc(S.note[today()]||'')}</textarea></div>
 <div><h3>آخر ٧ أيام</h3><div class="bars">${days.map(([k,l])=>`<div class="bar"><i style="height:${Math.round(pct(k)*100)}%"></i>${l}</div>`).join('')}</div></div></div>
 <h3>⚙️ إعدادات الالتزام</h3><div class="set"><label>اليوم يتحسب لما تخلص <select id="minPct">${[[0,'مهمة واحدة'],[50,'50% من المهام'],[100,'كل المهام']].map(([v,l])=>`<option value="${v}" ${S.minPct===v?'selected':''}>${l}</option>`).join('')}</select></label><label>هدف الأسبوع <select id="wt">${[3,4,5,6,7].map(v=>`<option ${S.weekTarget===v?'selected':''}>${v}</option>`).join('')}</select> أيام</label><label>تذكير يومي <input type="time" id="rem" value="${S.remind}"></label></div>
 <div class="tools"><button data-export>⬇️ نسخة احتياطية</button><label class="filebtn">⬆️ استرجاع<input type="file" id="imp" accept=".json" hidden></label><button data-reset>إعادة ضبط</button></div>`}
function sectionView(s){const dn=s.tasks.filter(t=>due(t,today())&&doneToday(t)).length,dt=s.tasks.filter(t=>due(t,today())).length,pp=dt?Math.round(dn/dt*100):0;
 return `<h3>${s.icon} ${esc(s.name)}</h3><div class="pbar"><i style="width:${pp}%"></i></div>${s.tasks.slice().sort((x,y)=>doneToday(x)-doneToday(y)).map(taskRow).join('')||'<p>مفيش مهام لسه، ضيف أول واحدة 👇</p>'}
 <div class="add"><input id="newTask" placeholder="مهمة جديدة..."><button data-add="${s.id}">إضافة</button></div>
 <p class="hint">دوس ✏️ على أي مهمة عشان تخليها تتكرر في أيام محددة (مثلا السبت والثلاثاء بس).</p>
 <button class="rm" data-delsec="${s.id}">حذف القسم ده</button>`}
function habitsView(){const P=['💧 أشرب مية','🏃 رياضة','🕌 صلاة الفجر في وقتها','📖 قراءة 10 صفحات','😴 النوم بدري','🧘 تأمل 5 دقايق'];
 return `<h3>💧 عاداتي اليومية</h3><p class="hint">العادات بتتحسب في السلسلة زي المهام بالظبط.</p>${S.habits.map(taskRow).join('')||'<p>لسه مفيش عادات. ضيف من الاقتراحات 👇</p>'}
 <div class="add"><input id="newHabit" placeholder="عادة جديدة (مثلا 💧 أشرب 8 أكواب)"><button data-addh="1">إضافة</button></div>
 <div class="presets pl">${P.map(p=>`<button data-preset="${esc(p)}">${esc(p)}</button>`).join('')}</div>`}
function goalsView(){return `<h3>🎯 الأهداف الكبيرة</h3>${S.goals.map(g=>{const n=g.steps.length,d=g.steps.filter(x=>x.d).length,p=n?Math.round(d/n*100):0;
 return `<div class="gcard"><div class="ghead"><b>${esc(g.title)}</b><span>${d}/${n} · ${p}% ${p===100&&n?'🏆':''}</span></div><div class="pbar"><i style="width:${p}%"></i></div>
 ${g.steps.map(x=>`<div class="gstep ${x.d?'done':''}"><button class="chk sm" data-gs="${g.id}:${x.id}">${x.d?'✓':''}</button><span>${esc(x.t)}</span><button class="del" data-gsdel="${g.id}:${x.id}">✕</button></div>`).join('')}
 <div class="gbtns"><button data-gadd="${g.id}">➕ خطوة</button><button data-gedit="${g.id}">✏️ تعديل</button><button data-gdel="${g.id}">🗑 حذف الهدف</button></div></div>`}).join('')||'<p>مفيش أهداف لسه. مثال: "خلص كورس JS" وقسمه لخطوات.</p>'}
 <div class="tools"><button data-gnew="1">➕ هدف جديد</button></div>`}
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
 return `<div class="calhead"><button data-cal="-1">›</button><h3>📆 ${title}</h3><button data-cal="1">‹</button><button data-cal="0" class="tb">النهارده</button></div>
 <div class="calgrid">${['س','ح','ن','ث','ر','خ','ج'].map(x=>`<div class="ch">${x}</div>`).join('')}${cells}</div>
 <div class="leg">أقل <i class="hc"></i><i class="hc l1"></i><i class="hc l2"></i><i class="hc l3"></i> أكتر</div>
 <div class="dayd"><h3>📌 ${new Date(k+'T00:00:00').toLocaleDateString('ar-EG',{weekday:'long',day:'numeric',month:'long'})} ${S.mood[k]||''}</h3>
 <p>التزام اليوم: <b>${Math.round(pct(k)*100)}%</b> · وقت التركيز: <b>${fm}</b> دقيقة</p>
 ${dn.length?`<div class="chips">${dn.map(x=>`<span class="chip g">✅ ${esc(x.title)}</span>`).join('')}</div>`:''}
 ${ms.length&&k<=t?`<div class="chips">${ms.map(x=>`<span class="chip r">⬜ ${esc(x.title)}</span>`).join('')}</div>`:''}
 ${S.note[k]?`<div class="quote">📝 ${esc(S.note[k])}</div>`:''}</div>`}
function reviewView(){const ts=dueToday(),dn=ts.filter(doneToday),un=ts.filter(t=>!doneToday(t)),tm=(S.fl[today()]||[]).reduce((a,x)=>a+x.m,0),mood=S.mood[today()];
 const tmr=new Date();tmr.setDate(tmr.getDate()+1);const kt=dk(tmr),moved=(S.carry[kt]||[]).length;
 return `<h3>🌙 مراجعة آخر اليوم</h3><div class="cards"><div class="card"><div class="n">${dn.length}</div><div class="l">اتعمل ✅</div></div><div class="card"><div class="n">${un.length}</div><div class="l">اتأجل ⏳</div></div><div class="card"><div class="n">${tm}</div><div class="l">دقيقة تركيز</div></div><div class="card"><div class="n">${streak()}</div><div class="l">أيام متواصلة 🔥</div></div></div>
 <div class="grid2"><div><h3>✅ اللي اتعمل</h3>${dn.map(t=>`<div class="chip g big">${esc(t.title)}</div>`).join('')||'<p>لسه مفيش حاجة.</p>'}</div>
 <div><h3>⏳ اللي اتأجل</h3>${un.map(t=>`<div class="chip r big">${esc(t.title)}</div>`).join('')||'<p>خلصت كل حاجة، برافو 🎉</p>'}
 ${un.length?`<div class="tools"><button data-carry="1">📦 انقل غير المنجز لبكرة</button></div>`:''}${moved?`<p class="hint">✔ تم نقل ${moved} مهمة لبكرة.</p>`:''}</div></div>
 <h3>إزاي كان يومك؟</h3><div class="moods">${MOODS.map(m=>`<button class="mood ${mood===m?'on':''}" data-mood="${m}">${m}</button>`).join('')}</div>
 <h3>📝 إيه أهم حاجة اتعلمتها / هتعملها بكرة؟</h3><textarea id="note" placeholder="اكتب...">${esc(S.note[today()]||'')}</textarea>`}
function render(){nav();document.getElementById('date').textContent=new Date().toLocaleDateString('ar-EG',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
 document.getElementById('streak').textContent=streak();
 document.body.dataset.theme=S.theme;const tb=document.getElementById('theme');if(tb)tb.textContent=S.theme==='dark'?'☀️':'🌙';const h=new Date().getHours();document.getElementById('greet').textContent=(h<12?'صباح الخير':h<18?'نهارك سعيد':'مساء الخير')+' يا بطل 👋';
 const s=S.sections.find(x=>x.id===S.view);const V={focus:focusView,habits:habitsView,goals:goalsView,stats:statsView,calendar:calendarView,review:reviewView,home};
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
 else if(q('key')){S.key[today()]=S.key[today()]===q('key')?null:q('key')}
 else if(q('mood')){S.mood[today()]=q('mood')}
 else if(b.hasAttribute('data-export')){const u=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));const l=document.createElement('a');l.href=u;l.download='yawmi-backup-'+today()+'.json';l.click();toast('تم تنزيل النسخة ✅');return}
 else if(q('edit')){const t=allTasks().find(x=>x.id===q('edit'));const r=await ask({title:'تعديل المهمة',fields:[{id:'title',label:'اسم المهمة',value:t.title},{id:'days',type:'days',label:'تتكرر في أيام',value:t.days||[]}],ok:'حفظ'});if(!r||!r.title.trim())return;t.title=r.title.trim();t.days=r.days.length&&r.days.length<7?r.days:undefined}
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
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='newTask')document.querySelector('[data-add]').click();if(e.key==='Enter'&&e.target.id==='newHabit')document.querySelector('[data-addh]').click()});
document.addEventListener('input',e=>{if(e.target.id==='note'){S.note[today()]=e.target.value;save()}});
document.addEventListener('change',e=>{const t=e.target;
 if(t.id==='ftask'){FT.task=t.value;return}
 if(t.dataset.fs){S.fs[t.dataset.fs]=Math.max(1,Math.min(+t.max||180,+t.value||1));if(!FT.run&&!FT.startedAt)setMode(FT.mode);render();return}
 if(t.dataset.fsb){S.fs[t.dataset.fsb]=t.checked;save();return}
 if(t.id==='minPct'){S.minPct=+t.value;render()}if(t.id==='wt'){S.weekTarget=+t.value;render()}if(t.id==='rem'){S.remind=t.value;if(S.remind&&'Notification' in window)Notification.requestPermission();render()}
 if(t.id==='imp'){const f=t.files[0];if(!f)return;f.text().then(x=>{try{const d=JSON.parse(x);if(!d.sections)throw 0;localStorage.setItem(KEY,x);location.reload()}catch(z){ask({title:'الملف مش صالح',msg:'اختار ملف نسخة احتياطية من يومي.',ok:'تمام',noCancel:true})}})}});
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
render();
setInterval(()=>{if(!S.remind)return;const n=new Date(),hm=String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0');if(hm>=S.remind&&S.lastRemind!==today()&&!ok(today())){S.lastRemind=today();save();try{if(Notification.permission==='granted')new Notification('يومي',{body:'لسه ما سجلتش حاجة النهارده. مهمة واحدة بس! 💪'})}catch(e){}toast('⏰ وقت مهامك! مهمة واحدة بس')}},30000);
