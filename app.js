/* يومي v4.5 */
const KEY='yawmi-v1';
const dk=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const nowD=()=>new Date(Date.now()-((typeof S!=='undefined'&&S&&S.dayStart)||0)*36e5);
const today=()=>dk(nowD());
const uid=()=>Math.random().toString(36).slice(2,9);
let S=JSON.parse(localStorage.getItem(KEY)||'null')||{
 sections:[
  {id:'games',name:'الألعاب',icon:'🎮',tasks:[
    {id:uid(),title:'ماتش فالورانت',played:true},
    {id:uid(),title:'أخلص دايلي كويست',played:true},
    {id:uid(),title:'ألعب مع الشباب في ديسكورد',played:true}]},
  {id:'life',name:'يومي',icon:'🌿',tasks:[
    {id:uid(),title:'أصلي الصلوات في وقتها'},
    {id:uid(),title:'أشرب مية'},
    {id:uid(),title:'أمشي شوية'}]}
 ],
 log:{},view:'home'};
S.mood=S.mood||{};S.note=S.note||{};S.theme=S.theme||'light';S.focus=S.focus||{};S.goal=S.goal||0;S.minPct=S.minPct||0;S.weekTarget=S.weekTarget||5;S.key=S.key||{};S.remind=S.remind||'';S.lastRemind=S.lastRemind||'';
S.habits=[];S.sections=S.sections.filter(x=>x.id!=='study');if(S.view==='study'||S.view==='habits')S.view='home';S.goals=S.goals||[];S.carry=S.carry||{};S.fl=S.fl||{};S.statRange=S.statRange||7;
S.pray=S.pray||{};S.adk=S.adk||{};S.rollTo=S.rollTo||'';S.fsetOpen=!!S.fsetOpen;
if(!S.course){const v={};for(let i=1;i<=176;i++)v[i]=1;const a={};for(let i=0;i<15;i++)a[i]=1;S.course={v,a,log:{}}}
S.name=S.name||'Malky';S.dayStart=S.dayStart||0;S.accent=S.accent||'#6c5ce7';S.hh=S.hh||{};S.al=Object.assign({on:true,sound:'chime',vol:.8,off:{}},S.al||{});S.alDone=S.alDone||{};S.nt=Object.assign({pray:false,focus:false},S.nt||{});
S.city=S.city||'shibin';S.method=S.method||'egypt';S.clat=S.clat||30.56;S.clon=S.clon||31.01;
S.fs=Object.assign({work:25,brk:5,long:15,every:4,auto:false,sound:true},S.fs||{});
S.en=S.en||{w:{},ph:{}};S.ch=S.ch||{done:{},ans:{},idx:0};S.count=S.count||{date:'2027-03-01',label:'هدفي'};S.fa=Object.assign({sound:'beep',vol:.8},S.fa||{});
const save=()=>localStorage.setItem(KEY,JSON.stringify(S));
const day=(d=today())=>S.log[d]||(S.log[d]={});
const CH3={id:'ch3',title:'⚡ أحل 3 تحديات',target:3,played:true,auto:true};
const allTasks=()=>[...S.sections.flatMap(s=>s.tasks),CH3];
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const DN=['ح','ن','ث','ر','خ','ج','س'],DFULL=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'],DORDER=[6,0,1,2,3,4,5];
function due(t,k){const g=new Date(k+'T00:00:00').getDay();return !t.days||!t.days.length||t.days.includes(g)||(S.carry[k]||[]).includes(t.id)}
const tasksFor=k=>allTasks().filter(t=>due(t,k));
const dueToday=()=>tasksFor(today());
const doneToday=t=>{const v=day()[t.id]||0;return t.target?v>=t.target:v>0};
const doneOn=(t,k)=>{const v=((S.log[k]||{})[t.id])||0;return t.target?v>=t.target:v>0};
function total(id){return Object.values(S.log).reduce((a,d)=>a+(d[id]||0),0)}
function pct(k){const l=S.log[k]||{};const ts=tasksFor(k);if(!ts.length)return 0;return ts.filter(t=>doneOn(t,k)).length/ts.length}
const ok=k=>{const p=pct(k);return S.minPct?p*100>=S.minPct:p>0};
function streak(){let n=0,d=nowD();if(!ok(today()))d.setDate(d.getDate()-1);
 for(;;){if(ok(dk(d))){n++;d.setDate(d.getDate()-1)}else break}return n}
function best(){const ks=Object.keys(S.log).sort();let b=0,c=0,prev=null;for(const k of ks){if(!ok(k)){c=0;prev=null;continue}const d=new Date(k+'T00:00:00');if(prev&&Math.round((d-prev)/864e5)===1)c++;else c=1;prev=d;b=Math.max(b,c)}return Math.max(b,streak())}
function tstreak(id){const t=allTasks().find(x=>x.id===id)||{id};let n=0,d=nowD();if(!doneOn(t,dk(d)))d.setDate(d.getDate()-1);while(doneOn(t,dk(d))){n++;d.setDate(d.getDate()-1)}return n}
function weekDays(){const r=[],x=nowD();const off=(x.getDay()+1)%7;x.setDate(x.getDate()-off);for(let i=0;i<7;i++){r.push(dk(x));x.setDate(x.getDate()+1)}return r}
const daysLabel=t=>t.days&&t.days.length?'🔁 '+DORDER.filter(g=>t.days.includes(g)).map(g=>DN[g]).join(' '):'';
/* v4.2: مصدر كل مهمة (القسم اللي جاية منه) */
function srcOf(id){if(id==='ch3')return{icon:'⚡',name:'تحديات'};const s=S.sections.find(s=>s.tasks.some(t=>t.id===id));return s?{icon:s.icon,name:s.name}:{icon:'📌',name:''}}
/* v4.2: ترحيل تلقائي - أي مهمة ما اتعملتش بتتنقل لوحدها لليوم اللي بعده */
function autoRollover(){const t=today();if(S.rollTo===t)return;
 Object.keys(S.log).filter(k=>k<t).sort().forEach(k=>{
  const nx=dk(new Date(new Date(k+'T00:00:00').getTime()+864e5));if(nx>t)return;
  const un=tasksFor(k).filter(x=>!doneOn(x,k)).map(x=>x.id);
  if(un.length)S.carry[nx]=[...new Set([...(S.carry[nx]||[]),...un])]});
 S.rollTo=t;save()}
autoRollover();
while(S.ch.done[S.ch.idx%CHALLENGES.length]&&Object.keys(S.ch.done).length<CHALLENGES.length)S.ch.idx++;
function taskRow(t){const c=day()[t.id]||0;const done=doneToday(t);const off=!due(t,today());
 const g=nowD().getDay();const norm=!t.days||!t.days.length||t.days.includes(g);
 const carried=(S.carry[today()]||[]).includes(t.id)&&!norm;const so=srcOf(t.id);
 return `<div class="task ${done?'done':''} ${off?'off':''}"><button class="chk" data-tick="${t.id}">${done?'✓':''}</button><span class="src" title="${esc(so.name)}">${so.icon}</span><span class="t">${S.key[today()]===t.id?'⭐ ':''}${esc(t.title)}${t.days&&t.days.length?` <small class="rep">${daysLabel(t)}</small>`:''}${carried?' <small class="rep">📦 من إمبارح</small>':''}</span>${tstreak(t.id)>=2?`<span class="sk">🔥 ${tstreak(t.id)}</span>`:''}${t.auto?'':`<button class="del" data-key="${t.id}" title="مهمة اليوم الأساسية">⭐</button>`}
 ${t.auto?`<span class="cnt auto"><b>${Math.min(c,t.target)}/${t.target}</b></span>`:t.played?`<span class="cnt"><button data-m="${t.id}">−</button><b>${t.target?Math.min(c,t.target)+'/'+t.target:c}</b><button data-p="${t.id}">+</button></span>`:''}
 ${t.auto?'':`<button class="del" data-edit="${t.id}" title="تعديل">✏️</button><button class="del" data-del="${t.id}" title="حذف">🗑️</button>`}</div>`}
const QUOTES=['الاستمرارية أهم من الكمال 💎','خطوة صغيرة كل يوم بتعمل فرق كبير 🌱','النهارده أحسن من إمبارح بحاجة بسيطة ✨','ابدأ بأسهل مهمة وهتشد الباقي 🚀','ريّح دماغك شوية وارجع أقوى 🧘'];
const quote=()=>QUOTES[nowD().getDate()%QUOTES.length];
function heat(){let h='';for(let i=27;i>=0;i--){const x=nowD();x.setDate(x.getDate()-i);const p=pct(dk(x));h+=`<i class="hc l${p===0?0:p<.34?1:p<.67?2:3}" title="${dk(x)} · ${Math.round(p*100)}%"></i>`}return `<div class="heat">${h}</div>`}

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
function beep(){if(!S.fs.sound)return;playSeq(S.fa.vol,S.fa.sound)}
function startTimer(){FT.run=true;FT.end=Date.now()+FT.left*1000;if(!FT.startedAt)FT.startedAt=Date.now();clearInterval(FT.iv);FT.iv=setInterval(ftick,500);wk(true)}
function pauseTimer(){wk(false);clearInterval(FT.iv);FT.run=false;FT.left=Math.max(0,Math.ceil((FT.end-Date.now())/1000));document.title=fmt(FT.left)+' · يومي'}
function recordFocus(m){if(m<1)return;const k=today();(S.fl[k]=S.fl[k]||[]).push({t:FT.task||'',m:Math.round(m)});S.focus[k]=(S.focus[k]||0)+1}
function nextAfter(){if(FT.mode==='work'){FT.cycle++;return FT.cycle%S.fs.every===0?'long':'break'}return 'work'}
function finish(rec){wk(false);clearInterval(FT.iv);FT.run=false;
 if(FT.mode==='work'&&rec)recordFocus(rec==='full'?FT.total/60:(FT.total-FT.left)/60);
 const wasWork=FT.mode==='work';FT.startedAt=0;setMode(nextAfter());
 if(rec==='full'){beep();try{navigator.vibrate&&navigator.vibrate([200,100,200])}catch(e){}if(wasWork)confetti();toast(wasWork?'🎉 خلصت جلسة تركيز!':'⏰ الراحة خلصت');if(S.nt.focus){try{if(Notification.permission==='granted')new Notification('يومي',{body:wasWork?'خلصت جلسة التركيز 🎉 خد راحة':'الراحة خلصت، يلا نرجع ⏱️'})}catch(e){}}if(S.fs.auto)startTimer()}
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
 <div class="setbox"><div class="sethead"><b>⚙️ إعدادات التركيز</b></div>
 <div class="setbody">
  <div class="setgrp"><b>⏳ مدد الجلسات (بالدقائق)</b><div class="sg">${nm('work','تركيز',S.fs.work)}${nm('brk','راحة قصيرة',S.fs.brk)}${nm('long','راحة طويلة',S.fs.long)}${nm('every','جلسات قبل الراحة الطويلة',S.fs.every,10)}</div></div>
  <div class="setgrp"><b>🎛️ خيارات</b>
   <label class="sw"><input type="checkbox" data-fsb="auto" ${S.fs.auto?'checked':''}><i></i><span>تشغيل تلقائي للجلسة اللي بعدها</span></label>
   <label class="sw"><input type="checkbox" data-fsb="sound" ${S.fs.sound?'checked':''}><i></i><span>صوت عند النهاية</span></label>
   <div class="sg"><label class="sf"><span>الصوت</span><select data-fsnd style="padding:8px;border-radius:10px;border:2px solid #e0dbff">${Object.entries(SNDS).map(([k,v])=>`<option value="${k}" ${S.fa.sound===k?'selected':''}>${v[0]}</option>`).join('')}</select></label><label class="sf"><span>مستوى الصوت</span><input type="range" data-fvol min="0.1" max="1" step="0.1" value="${S.fa.vol}"></label><label class="sf"><span>&nbsp;</span><button type="button" data-ftest style="border:0;background:var(--ac);color:#fff;border-radius:10px;padding:9px;cursor:pointer">▶ جرّب</button></label></div>
  </div>
 </div></div></div>`}
function confetti(){const c=document.createElement('div');c.className='conf';let h='';for(let i=0;i<40;i++)h+=`<i style="left:${Math.random()*100}%;background:hsl(${Math.random()*360},80%,60%);animation-delay:${Math.random()*.4}s"></i>`;c.innerHTML=h;document.body.appendChild(c);setTimeout(()=>c.remove(),2200)}
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2400)}

/* ---------- nav ---------- */
const VIEWS=[['home','🏠 الرئيسية'],['calendar','📆 التقويم'],['focus','⏱️ التركيز'],['goals','🎯 الأهداف'],['stats','📊 الإحصائيات'],['review','🌙 مراجعة اليوم'],['pray','🕌 الصلاة والأذكار'],['course','💻 الدراسة والكود'],['settings','⚙️ الإعدادات']];
/* ---------- v4.3: مواقيت الصلاة (حساب محلي بدون إنترنت) ---------- */
const CITIES={shibin:['شبين الكوم',30.56,31.01],cairo:['القاهرة',30.04,31.24],giza:['الجيزة',30.01,31.21],alex:['الإسكندرية',31.2,29.92],mansoura:['المنصورة',31.04,31.38],tanta:['طنطا',30.79,31.0],zagazig:['الزقازيق',30.59,31.5],suez:['السويس',29.97,32.55],assiut:['أسيوط',27.18,31.18],luxor:['الأقصر',25.69,32.64],aswan:['أسوان',24.09,32.9],makkah:['مكة المكرمة',21.42,39.83],madinah:['المدينة المنورة',24.47,39.61],riyadh:['الرياض',24.71,46.68],jeddah:['جدة',21.54,39.17],dubai:['دبي',25.2,55.27],kuwait:['الكويت',29.38,47.99],doha:['الدوحة',25.29,51.53],amman:['عمّان',31.95,35.93],casa:['الدار البيضاء',33.57,-7.59],istanbul:['إسطنبول',41.01,28.98],london:['لندن',51.51,-0.13],custom:['مخصص (إحداثيات)',0,0]};
const METHODS={egypt:['الهيئة المصرية العامة للمساحة',19.5,17.5],mwl:['رابطة العالم الإسلامي',18,17],makkah:['أم القرى',18.5,'90'],karachi:['جامعة كراتشي',18,18],isna:['أمريكا الشمالية (ISNA)',15,15]};
function prayTimes(date){const c=S.city==='custom'?['',S.clat,S.clon]:CITIES[S.city]||CITIES.shibin,lat=c[1],lon=c[2],m=METHODS[S.method]||METHODS.egypt;
 const tz=-date.getTimezoneOffset()/60,R=Math.PI/180;
 const D=Date.UTC(date.getFullYear(),date.getMonth(),date.getDate(),12)/864e5+2440587.5-2451545;
 const g=((357.529+0.98560028*D)%360)*R,q=(280.459+0.98564736*D)%360,L=(q+1.915*Math.sin(g)+0.02*Math.sin(2*g))*R,e=(23.439-3.6e-7*D)*R;
 let RA=Math.atan2(Math.cos(e)*Math.sin(L),Math.cos(L))/R/15;RA=((RA%24)+24)%24;const dec=Math.asin(Math.sin(e)*Math.sin(L));
 let eq=q/15-RA;eq=((eq+12)%24+24)%24-12;
 const noon=12+tz-lon/15-eq;
 const A=a=>{const x=(-Math.sin(a*R)-Math.sin(dec)*Math.sin(lat*R))/(Math.cos(dec)*Math.cos(lat*R));return Math.acos(Math.max(-1,Math.min(1,x)))/R/15};
 const asrA=-Math.atan(1/(1+Math.tan(Math.abs(lat*R-dec))))/R;
 const mag=noon+A(.833);
 const t={fajr:noon-A(m[1]),dhuhr:noon+.0333,asr:noon+A(asrA),maghrib:mag+.0167,isha:m[2]==='90'?mag+1.5:noon+A(m[2])};
 const out={};for(const k in t){const h=((t[k]%24)+24)%24;out[k]=new Date(date.getFullYear(),date.getMonth(),date.getDate(),Math.floor(h),Math.round((h%1)*60),0)}return out}
const ptStr=d=>{let h=d.getHours(),mm=String(d.getMinutes()).padStart(2,'0');const ap=h<12?'ص':'م';h=h%12||12;return h+':'+mm+' '+ap};
function nextPrayer(){const n=new Date(),t=prayTimes(n);for(const [i,nm] of PR){if(t[i]>n)return{i,nm,at:t[i]}}const tm=new Date(n.getFullYear(),n.getMonth(),n.getDate()+1);return{i:'fajr',nm:'الفجر',at:prayTimes(tm).fajr}}
function untilStr(at){const m=Math.max(0,Math.round((at-new Date())/60000)),h=Math.floor(m/60);return (h?h+' س ':'')+(m%60)+' د'}
/* ---------- v4.3: صوت وتنبيه الصلاة ---------- */
let AC=null;const unlock=()=>{try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume()}catch(e){}};
document.addEventListener('pointerdown',unlock);document.addEventListener('keydown',unlock);
const SNDS={chime:['جرس هادي',[523.25,659.25,783.99,1046.5,783.99,659.25,523.25],'sine',.45],beep:['بيب قصير',[880,880],'square',.15],bell:['ناقوس',[1568,1175,1568,2093],'sine',.3],alarm:['منبه',[660,880,660,880,660,880],'sawtooth',.18],soft:['نغمة ناعمة',[392,523.25,659.25],'triangle',.5],digital:['ديجيتال',[1046.5,1318.5,1568,1318.5],'square',.12]};
function playSeq(vol,name){unlock();if(!AC)return;const d=SNDS[name]||SNDS.chime;const n=d[1],type=d[2],step=d[3];n.forEach((f,i)=>{const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime+i*step;o.type=type;o.frequency.value=f;o.connect(g);g.connect(AC.destination);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.001,.35*vol),t+.05);g.gain.exponentialRampToValueAtTime(.0001,t+step*1.9);o.start(t);o.stop(t+step*2)})}
function chime(vol){unlock();if(!AC)return;const n=[523.25,659.25,783.99,1046.5,783.99,659.25,523.25];n.forEach((f,i)=>{const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime+i*.45;o.type='sine';o.frequency.value=f;o.connect(g);g.connect(AC.destination);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.001,.35*vol),t+.05);g.gain.exponentialRampToValueAtTime(.0001,t+1.4);o.start(t);o.stop(t+1.5)})}
let ADH=null;
function playAlert(test){const a=S.al,vol=a.vol;const cu=localStorage.getItem('yawmi-adhan');
 if(a.sound==='custom'&&cu){try{if(ADH){ADH.pause()}ADH=new Audio(cu);ADH.volume=vol;ADH.play().catch(()=>playSeq(vol,'chime'))}catch(e){playSeq(vol,'chime')}}else playSeq(vol,a.sound)}
function stopAlert(){if(ADH){ADH.pause();ADH=null}}
function checkPrayerAlerts(){const n=new Date(),k=dk(n),t=prayTimes(n);
 for(const [i,nm] of PR){const diff=n-t[i];if(diff>=0&&diff<90000&&!S.alDone[k+i]){S.alDone[k+i]=1;
   Object.keys(S.alDone).filter(x=>x.slice(0,10)<k).forEach(x=>delete S.alDone[x]);save();
   if(S.al.on&&!S.al.off[i]){playAlert();toast('🕌 حان وقت صلاة '+nm)}
   if(S.nt.pray){try{if(Notification.permission==='granted')new Notification('يومي · '+nm,{body:'حان الآن وقت صلاة '+nm+' 🕌'})}catch(e){}}}}
 const el=document.getElementById('pnext');if(el){const x=nextPrayer();el.textContent='🕌 '+x.nm+' بعد '+untilStr(x.at)}}
/* ---------- v4.3: الشكل (ثيم + لون) ---------- */
const ACCENTS=[['#6c5ce7','بنفسجي'],['#0984e3','أزرق'],['#00b894','أخضر'],['#e17055','برتقالي'],['#e84393','وردي'],['#2d3436','رمادي']];
const effTheme=()=>S.theme==='auto'?(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):S.theme;
function mixW(h,p){const n=parseInt(h.slice(1),16),r=n>>16,g=(n>>8)&255,b=n&255,f=c=>Math.round(c+(255-c)*p);return '#'+[f(r),f(g),f(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function applyLook(){document.body.dataset.theme=effTheme();const r=document.documentElement.style;r.setProperty('--ac',S.accent);r.setProperty('--ac2',mixW(S.accent,.45));const m=document.querySelector('meta[name=theme-color]');if(m)m.content=S.accent}
const PR=[['fajr','الفجر'],['dhuhr','الظهر'],['asr','العصر'],['maghrib','المغرب'],['isha','العشاء']];
const PR2=[['fajr','الفجر','🌅'],['dhuhr','الظهر','☀️'],['asr','العصر','🌤️'],['maghrib','المغرب','🌇'],['isha','العشاء','🌙']];
const prDone=(k=today())=>PR.filter(([i])=>(S.pray[k]||{})[i]).length;
function prayStrip(){const el=document.getElementById('prayStrip');if(!el)return;const d=S.pray[today()]||{};const PT=prayTimes(new Date());
 el.innerHTML=`<div class="pshead"><span>🕌 الصلوات</span><b>${prDone()}/5</b></div><div class="psrow">${PR.map(([i,n])=>`<button class="pb ${d[i]?'on':''}" data-pr="${i}" title="${n}">${d[i]?'✓':''}<small>${n}</small><em>${ptStr(PT[i])}</em></button>`).join('')}</div><div class="pnext" id="pnext"></div>`;checkPrayerAlerts()}
function nav(){prayStrip();document.getElementById('nav').innerHTML=
 VIEWS.map(([v,l])=>`<button class="nav-btn ${S.view===v?'active':''}" data-v="${v}"><span>${l}</span>${v==='focus'&&FT.run?`<small id="navft">${fmt(FT.left)}</small>`:''}</button>`).join('')+
 '<div class="sep"></div>'+
 S.sections.map(s=>{const ts=s.tasks.filter(t=>due(t,today()));const d=ts.filter(doneToday).length;return `<button class="nav-btn ${S.view===s.id?'active':''}" data-v="${s.id}"><span>${s.icon} ${esc(s.name)}</span><small>${d}/${ts.length}</small></button>`}).join('')}

/* ---------- views ---------- */
/* v4.2: مهام الكورس جوه لسه عليك النهارده */
function courseTaskRows(){const nx=cNext();const na=COURSE.findIndex((s,i)=>!S.course.a[i]);let h='';
 if(nx)h+=`<div class="task ctask"><span class="src" title="الدراسة والكود">💻</span><span class="t">اتفرج على فيديو <b dir="ltr">#${String(nx[0]).padStart(3,'0')}</b> <em dir="ltr">${esc(nx[1])}</em></span><button class="cdone" data-cnext="1">اتفرجت ✓</button></div>`;
 if(na>=0)h+=`<div class="task ctask"><span class="src" title="الدراسة والكود">💻</span><span class="t">حل تكليف: <b dir="ltr">${esc(COURSE[na].n)}</b></span><button class="cdone" data-cas="${na}">حليته ✓</button></div>`;
 return h}
function home(){const ts=dueToday(),d=ts.filter(doneToday).length,p=ts.length?Math.round(d/ts.length*100):0;
 const plays=Object.values(day()).reduce((a,b)=>a+b,0);
 const gamesSec=S.sections.find(s=>s.id==='games');
 const gt=gamesSec?gamesSec.tasks.reduce((a,t)=>a+total(t.id),0):0;
 const msg=p===100&&ts.length?'خلصت كل حاجة النهارده! 🎉':p>=50?'قربت، كمّل يا وحش 💪':'يلا نبدأ اليوم 🚀';
 const H=S.hh||{};
 const kt=allTasks().find(t=>t.id===S.key[today()]);
 const wd=weekDays(),wdone=wd.filter(ok).length;
 const bs=streak(),bb=best(),fs=Object.values(S.focus).reduce((x,y)=>x+y,0);
 const BG=[['🌱 3 أيام',bb>=3],['🔥 7 أيام',bb>=7],['💪 14 يوم',bb>=14],['👑 30 يوم',bb>=30],['⏱️ 10 جلسات',fs>=10],['🎯 50 جلسة',fs>=50]];
 const avg=Math.round(wd.map(k=>pct(k)*100).reduce((x,y)=>x+y,0)/7);
 const carried=(S.carry[today()]||[]).length;
 const todo=ts.filter(t=>!doneToday(t)).sort((x,y)=>(y.auto?1:0)-(x.auto?1:0));
 const cd=(()=>{if(!S.count.date)return '';const df=Math.ceil((new Date(S.count.date+'T00:00:00')-new Date(today()+'T00:00:00'))/864e5);return `<div class="cdown"><b>${df<0?'🎉':df}</b><span>${df<0?'وصلت!':esc(S.count.txt!=null?S.count.txt:'يوم على '+(S.count.label||''))}</span></div>`})();
 return `<div class="homew">${carried?`<div class="warn hw">📦 عندك ${carried} مهمة اتنقلت لوحدها من إمبارح.</div>`:''}
 ${kt?`<div class="key">⭐ مهمتك الأساسية: <b>${esc(kt.title)}</b> ${doneToday(kt)?'✅':''}</div>`:''}
 <div class="toprow">${cd}${H.hero?'':`<div class="hero"><div class="ring" style="--p:${p}"><div>${p}%</div></div><div><h2>${msg}</h2><p>خلصت ${d} من ${ts.length} مهمة النهارده · ${quote()}</p></div></div>`}</div>
 ${H.cards?'':`<div class="cards"><div class="card"><div class="n">${d}</div><div class="l">مهام خلصتها ✅</div></div><div class="card"><div class="n">${plays}</div><div class="l">مرات اتسجلت</div></div><div class="card"><div class="n">${gt}</div><div class="l">مرات اللعب 🎮</div></div><div class="card"><div class="n">${bs}</div><div class="l">أيام متواصلة 🔥</div></div></div>`}
 ${H.tasks?'':`<div class="hc1"><h3>✅ لسه عليك النهارده</h3>${courseTaskRows()}${todo.length?todo.slice(0,6).map(taskRow).join('')+(todo.length>6?`<p class="hint">و ${todo.length-6} كمان في الأقسام</p>`:''):'<p>مفيش حاجة باقية 🎉</p>'}</div>`}
 ${H.week&&H.badges&&H.heat?'':`<div class="hc2">${H.week?'':`<h3>📅 الأسبوع: ${wdone} من ${S.weekTarget} أيام ${wdone>=S.weekTarget?'🏆':''}</h3><div class="wk">${wd.map((k,i)=>`<div class="wd ${ok(k)?'on':''} ${k===today()?'today':''}">${DN[(i+6)%7]}</div>`).join('')}<span>متوسط ${avg}% · أطول سلسلة ${bb}</span></div>`}
 ${H.badges?'':`<h3>🏅 إنجازات</h3><div class="badges">${BG.map(([n,o])=>`<div class="badge ${o?'on':''}">${n}</div>`).join('')}</div>`}${H.heat?'':`<h3>آخر ٢٨ يوم</h3>${heat()}`}</div>`}</div>`}
function sectionView(s){const dn=s.tasks.filter(t=>due(t,today())&&doneToday(t)).length,dt=s.tasks.filter(t=>due(t,today())).length,pp=dt?Math.round(dn/dt*100):0;
 return `<h3>${s.icon} ${esc(s.name)}</h3><div class="pbar"><i style="width:${pp}%"></i></div>${s.tasks.slice().sort((x,y)=>doneToday(x)-doneToday(y)).map(taskRow).join('')||'<p>مفيش مهام لسه، ضيف أول واحدة 👇</p>'}
 <div class="add"><input id="newTask" placeholder="مهمة جديدة..."><button data-add="${s.id}">إضافة</button></div>
 <p class="hint">دوس ✏️ على أي مهمة عشان تخليها تتكرر في أيام محددة (مثلا السبت والثلاثاء بس).</p>
 <button class="rm" data-delsec="${s.id}">🗑️ حذف القسم ده</button>`}
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
  {h:'سبحان الله وبحمده',t:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',n:'١٠٠ مرة',s:'رواه مسلم'}]]
];
const DUAS=['ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار','رب اشرح لي صدري ويسر لي أمري','رب زدني علمًا','اللهم إني أسألك علمًا نافعًا ورزقًا طيبًا وعملًا متقبلًا','اللهم أعني على ذكرك وشكرك وحسن عبادتك','اللهم إني أعوذ بك من الهم والحزن والعجز والكسل','يا مقلب القلوب ثبت قلبي على دينك','اللهم اغفر لي ولوالدي وارحمهما كما ربياني صغيرًا','حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم'];
function prayView(){const d=S.pray[today()]||{},a=S.adk[today()]||{};const dn=prDone();const PT=prayTimes(new Date()),NX=nextPrayer();
 return `<div class="praywrap"><div>
 <div class="pbox"><div class="pboxhead"><h3>🕌 صلوات النهارده</h3><span class="ppill">${dn}/5</span></div>
 <div class="pbar"><i style="width:${dn/5*100}%"></i></div>
 <div class="pgrid">${PR2.map(([i,n,ic])=>`<button class="pcard ${d[i]?'on':''}" data-pr="${i}"><span class="pic">${ic}</span><span class="pc">${d[i]?'✓':''}</span><b>${n}</b><small class="ptm">${ptStr(PT[i])}</small></button>`).join('')}</div>
 <p class="hint">🕌 الصلاة الجاية: ${NX.nm} بعد ${untilStr(NX.at)} · ${dn===5?'ما شاء الله، الخمسة اتصلوا 🌟':dn>0?'كمّل، فاضل '+(5-dn)+' صلوات':'ابدأ بأقرب صلاة 🕌'}</p></div>
 <h3>📿 أذكار اليوم</h3><div class="adk">${ADK.map(([id,t,items])=>`<div class="acard ${a[id]?'on':''}"><div class="ahead"><button class="achk" data-ad="${id}">${a[id]?'✓':''}</button><b>${t}</b></div>
 ${items.map(x=>`<details class="aitem"><summary><span>${esc(x.h)}</span><small>${esc(x.n)}</small></summary><p class="quran">${esc(x.t)}</p><small class="asrc">المصدر: ${esc(x.s)}</small></details>`).join('')}</div>`).join('')}</div></div>
 <div><h3>🤲 أدعية</h3><div class="duas">${DUAS.map(x=>`<div class="dua">${esc(x)}</div>`).join('')}</div></div></div>`}
function settingsView(){const sel=(id,opts,cur)=>`<select id="${id}">${opts.map(([v,l])=>`<option value="${v}" ${String(cur)===String(v)?'selected':''}>${l}</option>`).join('')}</select>`;
 const sw=(attr,k,on,l)=>`<label class="sw"><input type="checkbox" ${attr}="${k}" ${on?'checked':''}><i></i><span>${l}</span></label>`;
 const nx=cNext(),na=COURSE.findIndex((x,i)=>!S.course.a[i]);
 const HH=[['hero','بطاقة التقدم الكبيرة'],['cards','كروت الأرقام'],['tasks','لسه عليك النهارده'],['week','الأسبوع'],['badges','الإنجازات'],['heat','آخر ٢٨ يوم']];
 const has=!!localStorage.getItem('yawmi-adhan');
 return `<div class="setg">
 <div class="scard"><h3>⚙️ الالتزام</h3><div class="set"><label>اليوم يتحسب لما تخلص ${sel('minPct',[[0,'مهمة واحدة'],[50,'50% من المهام'],[100,'كل المهام']],S.minPct)}</label><label>هدف الأسبوع ${sel('wt',[3,4,5,6,7].map(v=>[v,v]),S.weekTarget)} أيام</label><label>تذكير يومي <input type="time" id="rem" value="${S.remind}"></label><label>بداية اليوم الساعة ${sel('dstart',[0,1,2,3,4,5,6].map(v=>[v,v===0?'12 منتصف الليل':v+' الفجر']),S.dayStart)}</label></div><p class="hint">لو بتسهر، المهام مش بتترحّل ولا بيتغير اليوم إلا بعد الساعة دي.</p></div>
 <div class="scard"><h3>👤 الاسم</h3><div class="set"><label>الاسم في التحية <input id="sname" maxlength="20" value="${esc(S.name)}"></label></div></div>
 <div class="scard"><h3>🕌 مواقيت الصلاة</h3><div class="set"><label>المدينة ${sel('scity',Object.entries(CITIES).map(([k,v])=>[k,v[0]]),S.city)}</label><label>طريقة الحساب ${sel('smethod',Object.entries(METHODS).map(([k,v])=>[k,v[0]]),S.method)}</label>${S.city==='custom'?`<label>خط العرض <input type="number" step="0.01" id="clat" value="${S.clat}"></label><label>خط الطول <input type="number" step="0.01" id="clon" value="${S.clon}"></label>`:''}</div><p class="hint">الحساب بيتم جوه المتصفح حسب توقيت جهازك، مفيش إنترنت مطلوب. قارنه بتطبيق الصلاة اللي بتثق فيه أول مرة.</p></div>
 <div class="scard"><h3>🔔 صوت الصلاة</h3><div class="set">${sw('data-aon','1',S.al.on,'شغّل صوت عند كل صلاة')}<label>الصوت ${sel('alsound',[...Object.entries(SNDS).map(([k,v])=>[k,v[0]]),['custom','ملف أذان من عندي']],S.al.sound)}</label><label class="filebtn2">⬆️ ${has?'غيّر ملف الأذان':'ارفع ملف الأذان (mp3)'}<input type="file" id="adhanf" accept="audio/*" hidden></label><label>الصوت ${'<input type="range" id="alvol" min="0.1" max="1" step="0.1" value="'+S.al.vol+'">'}</label><div class="pchk">${PR.map(([i,n])=>sw('data-aoff',i,!S.al.off[i],n)).join('')}</div><div class="tools"><button data-atest>▶ جرّب الصوت</button><button data-astop>⏹ إيقاف</button></div></div><p class="hint">الصوت بيشتغل طول ما الموقع مفتوح في المتصفح. لو قافله مش هيرن. المتصفح كمان بيطلب إنك تضغط على أي حاجة في الصفحة مرة بعد ما تفتحها.</p></div>
 <div class="scard"><h3>🎨 الشكل</h3><div class="set"><div class="seg">${[['light','☀️ فاتح'],['dark','🌙 غامق'],['auto','🖥️ تلقائي']].map(([v,l])=>`<button class="${S.theme===v?'on':''}" data-th="${v}">${l}</button>`).join('')}</div><div class="swatches">${ACCENTS.map(([c,n])=>`<button class="${S.accent===c?'on':''}" data-ac="${c}" title="${n}" style="background:${c}"></button>`).join('')}</div></div></div>
 <div class="scard"><h3>🏠 كروت الرئيسية</h3><div class="set hh">${HH.map(([k,l])=>sw('data-hh',k,!S.hh[k],l)).join('')}</div></div>
 <div class="scard"><h3>💻 مكانك في الكورس</h3><div class="set cposv"><span>الفيديو الجاي: <b dir="ltr">${nx?'#'+nx[0]+' '+esc(nx[1]):'خلصت كل الفيديوهات 🎉'}</b></span><span>التكليف الجاي: <b dir="ltr">${na<0?'خلصت كل التكليفات 🎉':(na+1)+'. '+esc(COURSE[na].n)}</b></span><button class="solid" data-cpos2>✏️ تعديل المكان</button></div></div>
 <div class="scard"><h3>⏳ العد التنازلي</h3><div class="set"><label>التاريخ المستهدف <input type="date" id="cntdate" value="${S.count.date}"></label><label>نص البانر كله <input id="cnttxt" maxlength="60" value="${esc(S.count.txt!=null?S.count.txt:'يوم على '+(S.count.label||''))}" placeholder="مثال: يوم على أول عميل"></label></div><p class="hint">بيظهر في أعلى الرئيسية جنب بطاقة التقدم.</p></div>
 <div class="scard"><h3>⏱️ صوت التركيز</h3><div class="set"><label>الصوت ${sel('fasound',Object.entries(SNDS).map(([k,v])=>[k,v[0]]),S.fa.sound)}</label><label>مستوى الصوت <input type="range" id="favol" min="0.1" max="1" step="0.1" value="${S.fa.vol}"></label><div class="tools"><button data-ftest>▶ جرّب الصوت</button></div></div></div>
 <div class="scard"><h3>📣 إشعارات المتصفح</h3><div class="set">${sw('data-nt','pray',S.nt.pray,'إشعار وقت الصلاة')}${sw('data-nt','focus',S.nt.focus,'إشعار نهاية جلسة التركيز')}</div><p class="hint">لازم تسمح بالإشعارات لما المتصفح يسأل.</p></div>
 <div class="scard wide"><h3>💾 البيانات</h3><div class="tools"><button data-export>⬇️ نسخة احتياطية</button><label class="filebtn">⬆️ استرجاع<input type="file" id="imp" accept=".json" hidden></label><button data-reset>🗑️ إعادة ضبط الكل</button></div>
 <h3 class="sub">🧹 مسح قسم واحد بس</h3><div class="tools">${[['log','سجل المهام والإحصائيات'],['focus','جلسات التركيز'],['pray','الصلوات والأذكار'],['course','تقدم الكورس'],['goals','الأهداف']].map(([k,l])=>`<button class="danger" data-clr="${k}">${l}</button>`).join('')}</div></div>
 </div>`}
/* ---------- course ---------- */
const CS={sec:-1,tab:S.course.tab||'v'};
const cWatched=n=>!!S.course.v[n];
const cLessons=()=>COURSE.flatMap(x=>x.l);
function cNext(){const l=cLessons().find(x=>!cWatched(x[0]));return l||null}
function cSecOf(n){return COURSE.findIndex(s=>s.l.some(x=>x[0]===n))}
function courseView(){const all=cLessons(),w=all.filter(x=>cWatched(x[0])).length,ad=COURSE.filter((s,i)=>S.course.a[i]).length;
 if(CS.sec<0||CS.sec>=COURSE.length){const nx=cNext();CS.sec=nx?cSecOf(nx[0]):COURSE.length-1}
 const lg=S.course.log[today()]||{v:[],a:[]},sec=COURSE[CS.sec];
 const pcv=Math.round(w/all.length*100);
 const first=sec.l[0][0],last=sec.l[sec.l.length-1][0],sw=sec.l.filter(x=>cWatched(x[0])).length;
 const tabs=`<div class="ctabs"><button class="ctab ${CS.tab==='v'?'on':''}" data-ctab="v"><b>${w}/${all.length}</b><span>🎬 فيديوهات</span></button><button class="ctab ${CS.tab==='a'?'on':''}" data-ctab="a"><b>${ad}/${COURSE.length}</b><span>📝 تكليفات</span></button><button class="ctab ${CS.tab==='ch'?'on':''}" data-ctab="ch"><b>${Object.keys(S.ch.done).length}/${CHALLENGES.length}</b><span>⚡ تحديات</span></button><button class="ctab ${CS.tab==='en'?'on':''}" data-ctab="en"><b>${Object.keys(S.en.w).length}+${Object.keys(S.en.ph).length}</b><span>🇬🇧 إنجليزي</span></button></div>`;
 let main='';
 if(CS.tab==='v')main=`<div class="cmain"><div class="csechead"><b>${CS.sec+1}. ${esc(sec.n)}</b><span>دروس ${first} إلى ${last} · ${sw}/${sec.l.length}</span></div><div class="clist cvideos" style="--r:${Math.ceil(sec.l.length/3)}">${sec.l.map((x,ix)=>{const n=sec.l.length,rem=n%3,lastRow=rem&&ix>=n-rem;return `<button class="cl ${cWatched(x[0])?'on':''}" style="grid-column:span ${lastRow?6/rem:2}" data-cl="${x[0]}"><span>${cWatched(x[0])?'✓':'○'}</span><b>${String(x[0]).padStart(3,'0')}</b><em>${esc(x[1])}</em></button>`}).join('')}</div></div>`;
 else if(CS.tab==='a')main=`<div class="cmain"><div class="csechead"><b>${CS.sec+1}. ${esc(sec.n)}</b><span>تكليف القسم ${S.course.a[CS.sec]?'✅ اتحل':'لسه'}</span><button class="${S.course.a[CS.sec]?'on':''}" data-cas="${CS.sec}">${S.course.a[CS.sec]?'✅ التكليف اتحل':'📝 علّم التكليف اتحل'}</button></div><div class="clist cassign">${sec.l.map(x=>`<div class="cl"><b>${String(x[0]).padStart(3,'0')}</b><em>${esc(x[1])}</em></div>`).join('')}</div></div>`;
 else if(CS.tab==='ch')main=chView();
 else main=enView();
 return `<div class="cwrap c43">${tabs}
 <div class="cbody2 ${CS.tab==='v'||CS.tab==='a'?'':'noside'}">${CS.tab==='v'||CS.tab==='a'?`<div class="cside">${COURSE.map((s,i)=>{const dn2=s.l.every(x=>cWatched(x[0]));const swc=s.l.filter(x=>cWatched(x[0])).length;return `<button class="csec2 ${i===CS.sec?'on':''} ${dn2?'dn':''}" data-csec="${i}"><span class="csn">${i+1}</span><span class="cst" dir="ltr">${esc(s.n)}</span><small>${swc}/${s.l.length}${S.course.a[i]?' ·📝✓':''}</small></button>`}).join('')}</div>`:''}
 ${main}</div></div>`}
function sectionOf(id){if(!id)return 'بدون ربط بمهمة';const s=S.sections.find(s=>s.tasks.some(t=>t.id===id));return s?s.icon+' '+s.name:'مهام محذوفة'}
function statsView(){const R=S.statRange,ks=[];for(let i=R-1;i>=0;i--){const x=nowD();x.setDate(x.getDate()-i);ks.push(dk(x))}
 const by={},perDay=ks.map(k=>{let t=0;(S.fl[k]||[]).forEach(e=>{const n=sectionOf(e.t);by[n]=(by[n]||0)+e.m;t+=e.m});return t});
 const tot=perDay.reduce((a,b)=>a+b,0),mx=Math.max(1,...perDay),rows=Object.entries(by).sort((a,b)=>b[1]-a[1]),rmx=rows.length?rows[0][1]:1;
 const avg=Math.round(ks.map(k=>pct(k)*100).reduce((a,b)=>a+b,0)/R),okd=ks.filter(ok).length;
 const sess=ks.reduce((a,k)=>a+(S.focus[k]||0),0);
 return `<h3>📊 الإحصائيات</h3><div class="fbtns" style="justify-content:flex-start"><button class="${R===7?'main':''}" data-srange="7">آخر 7 أيام</button><button class="${R===30?'main':''}" data-srange="30">آخر 30 يوم</button></div>
 <div class="cards" style="margin-top:14px"><div class="card"><div class="n">${Math.floor(tot/60)}س ${tot%60}د</div><div class="l">إجمالي وقت التركيز</div></div><div class="card"><div class="n">${sess}</div><div class="l">جلسات تركيز</div></div><div class="card"><div class="n">${okd}/${R}</div><div class="l">أيام ملتزم فيها</div></div><div class="card"><div class="n">${avg}%</div><div class="l">متوسط الإنجاز اليومي</div></div></div>
 <h3>⏱️ وقت التركيز لكل قسم</h3><div class="hbars">${rows.map(([n,m])=>`<div class="hrow"><span>${esc(n)}</span><div class="hb"><i style="width:${Math.round(m/rmx*100)}%"></i></div><b>${m} د</b></div>`).join('')||'<p>مفيش جلسات تركيز في الفترة دي. جرب صفحة التركيز.</p>'}</div>
 <h3>📈 التركيز يوم بيوم (دقايق)</h3><div class="bars tall">${ks.map((k,i)=>`<div class="bar"><i style="height:${Math.round(perDay[i]/mx*100)}%" title="${k}: ${perDay[i]} د"></i>${R<=7?new Date(k+'T00:00:00').toLocaleDateString('ar-EG',{weekday:'short'}):(i%5===0?k.slice(8):'')}</div>`).join('')}</div>`}
const CM={y:nowD().getFullYear(),m:nowD().getMonth(),sel:today()};
function calendarView(){const first=new Date(CM.y,CM.m,1),n=new Date(CM.y,CM.m+1,0).getDate(),off=(first.getDay()+1)%7,t=today();
 let cells='';for(let i=0;i<off;i++)cells+='<div class="cd blank"></div>';
 for(let d=1;d<=n;d++){const k=dk(new Date(CM.y,CM.m,d)),fut=k>t,p=pct(k),lv=fut||!(S.log[k]&&Object.values(S.log[k]).some(v=>v>0))?0:p<.34?1:p<.67?2:3;
  cells+=`<button class="cd l${lv} ${k===t?'today':''} ${k===CM.sel?'sel':''}" data-csel="${k}"><span>${d}</span>${S.mood[k]?`<small>${S.mood[k]}</small>`:''}</button>`}
 const k=CM.sel,l=S.log[k]||{},ts=allTasks(),dn=ts.filter(x=>doneOn(x,k)),ms=tasksFor(k).filter(x=>!doneOn(x,k)),fm=(S.fl[k]||[]).reduce((a,x)=>a+x.m,0);
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
/* ---------- v4.4: تحديات ---------- */
function chTrack(i,on){S.ch.sl=S.ch.sl||{};const k=today(),a=S.ch.sl[k]=S.ch.sl[k]||[];const p=a.indexOf(i);if(on&&p<0)a.push(i);if(!on&&p>=0)a.splice(p,1);day().ch3=a.length;
 if(on&&a.length===3){setTimeout(()=>{confetti();toast('🎯 خلصت هدف التحديات النهارده!')},50)}}
const CHPP=10;
function pager(tot,cur,att){const n=Math.ceil(tot/CHPP);if(n<=1)return '';let b='';for(let i=0;i<n;i++)b+=`<button class="pgb ${i===cur?'on':''}" ${att}="${i}">${i+1}</button>`;return `<div class="pager"><button class="pgb" ${att}="${Math.max(0,cur-1)}" ${cur===0?'disabled':''}>›</button>${b}<button class="pgb" ${att}="${Math.min(n-1,cur+1)}" ${cur>=n-1?'disabled':''}>‹</button><span class="pgi">${cur*CHPP+1}-${Math.min(tot,cur*CHPP+CHPP)} من ${tot}</span></div>`}
const chDaily=()=>CHALLENGES[S.ch.idx%CHALLENGES.length];
function chCard(c,i,daily){const dn=!!S.ch.done[i];
 return `<div class="chq ${dn?'on':''} ${daily?'dly':''}">
 <div class="chtop"><b class="chn">${i+1}</b><div class="chtags"><span class="chb ${c.d===1?'b1':c.d===2?'b2':'b3'}">${['','متوسط','فوق متوسط','صعب'][c.d]}</span><span class="chb b0">${CH_TOPICS[c.s]}</span>${daily?'<span class="chb bd">🌟 النهارده</span>':''}${dn?'<span class="chb bg">✅ اتحل</span>':''}</div></div>
 <p class="cht">${esc(c.t)}</p>
 ${!dn?`<div class="chans"><input data-chin="${i}" placeholder="اكتب إجابتك أو ملاحظتك هنا..." value="${esc(S.ch.ans[i]||'')}"></div>`:''}
 ${S.ch.hint===i?`<div class="chhint">💡 ${esc(c.h)}</div>`:''}
 ${S.ch.show===i?`<div class="chsol"><b>الحل:</b><pre dir="ltr">${esc(c.a)}</pre><p>💬 ${esc(c.x)}</p></div>`:''}
 <div class="chctl"><button data-chh="${i}">💡 تلميح</button><button data-chs="${i}">${S.ch.show===i?'إخفاء الحل':'عرض الحل'}</button>${dn?'<button data-chx="'+i+'">↩️ فتح تاني</button>':`<button class="ok" data-chok="${i}">حليته ✓</button>`}</div></div>`}
function chView(){const dn=Object.keys(S.ch.done).length,pc=Math.round(dn/CHALLENGES.length*100);
 const sol=((S.ch.sl||{})[today()]||[]).length;const f=S.ch.f||'all',dayIdx=S.ch.idx%CHALLENGES.length;
 const opts=['all','new','done',1,2,3].map(v=>`<button class="chipb ${String(f)===String(v)?'on':''}" data-chf="${v}">${v==='all'?'الكل':v==='new'?'اللي لسه':v==='done'?'المتحلولة':['','متوسط','فوق متوسط','صعب'][v]}</button>`).join('');
 let idxs=CHALLENGES.map((c,i)=>i).filter(i=>f==='all'?i!==dayIdx:f==='new'?!S.ch.done[i]&&i!==dayIdx:f==='done'&&S.ch.done[i]||(CHALLENGES[i].d===+f&&i!==dayIdx));
 if(S.ch.f&&S.ch.f!=='all'&&S.ch.f!=='new'&&S.ch.f!=='done')idxs=CHALLENGES.map((c,i)=>i).filter(i=>CHALLENGES[i].d===+f&&i!==dayIdx);
 const pg=Math.min(S.ch.pg||0,Math.max(0,Math.ceil(idxs.length/CHPP)-1));
 return `<div class="cmain chwrap">
 <div class="chday"><div><h4>🌟 تحدي النهارده</h4><p>كل يوم تحدي جديد بالترتيب. هدف النهارده: ${Math.min(sol,3)}/3 تحديات.</p></div><div class="chprog"><b>${dn}/${CHALLENGES.length}</b><div class="pbar"><i style="width:${pc}%"></i></div></div></div>
 ${chCard(CHALLENGES[dayIdx],dayIdx,true)}
 <h4>📚 كل التحديات</h4><div class="chfl">${opts}</div>
 <div class="chlist">${idxs.slice(pg*CHPP,pg*CHPP+CHPP).map(i=>chCard(CHALLENGES[i],i,false)).join('')||'<p class="hint">مفيش تحديات هنا.</p>'}</div>${pager(idxs.length,pg,'data-chpg')}</div>`}
/* ---------- v4.4: إنجليزي ---------- */
const enDailyW=()=>{const d=Math.floor((new Date(today()+'T00:00:00')-new Date('2026-11-25T00:00:00'))/864e5);return [EN_WORDS[((d%EN_WORDS.length)+EN_WORDS.length)%EN_WORDS.length],EN_PHRASES[((d%EN_PHRASES.length)+EN_PHRASES.length)%EN_PHRASES.length]]};
function enWordRow(w,i){const kn=!!S.en.w[i];return `<div class="enw ${kn?'on':''}" data-enflip="w${i}"><div class="enf ${S.en.flip==='w'+i?'fl':''}"><span class="enword" dir="ltr">${esc(w[0])}</span><span class="enmean">${kn?esc(w[1]):''}</span></div><div class="enex" dir="ltr">${esc(w[2])}</div><div class="enbtns"><button data-enkn="${i}">${kn?'✓ عارفها':'علّمها معروفة'}</button></div></div>`}
function enView(){const [dw,dp]=enDailyW(),dwi=EN_WORDS.indexOf(dw),dpi=EN_PHRASES.indexOf(dp);
 const kw=Object.keys(S.en.w).length,kp=Object.keys(S.en.ph).length;
 const ppg=Math.min(S.en.pp||0,Math.max(0,Math.ceil(EN_PHRASES.length/CHPP)-1)),wpg=Math.min(S.en.wp||0,Math.max(0,Math.ceil(EN_WORDS.length/CHPP)-1));
 const tip=EN_TIPS[nowD().getDate()%EN_TIPS.length];
 return `<div class="cmain enwrap">
 <div class="enday">
  <div class="encard"><h4>📖 كلمة النهارده</h4><div class="enbig" dir="ltr">${esc(dw[0])}</div><div class="enm">${esc(dw[1])}</div><div class="enex" dir="ltr">${esc(dw[2])}</div><button data-enkn="${dwi}">${S.en.w[dwi]?'✓ عارفها':'علّمها معروفة'}</button></div>
  <div class="encard"><h4>💬 جملة النهارده</h4><div class="enph" dir="ltr">${esc(dp[0])}</div><div class="enm">${esc(dp[1])}</div><p class="hint">اقراها بصوت عالي 3 مرات</p><button data-enpk="${dpi}">${S.en.ph[dpi]?'✓ اتقنتها':'علّمها متقنة'}</button></div>
  <div class="encard entip"><h4>💡 نصيحة</h4><p>${tip}</p><div class="enst"><b>${kw}</b> كلمة · <b>${kp}</b> جملة اتقنتهم</div></div>
 </div>
 <h4>🃏 كروت المراجعة (${kw} كلمة معروفة)</h4>
 <div class="enrev">${kw?Object.keys(S.en.w).map(i=>{const w=EN_WORDS[i];return `<div class="enc ${S.en.flip==='r'+i?'fl':''}" data-enflip="r${i}"><span class="ena">${S.en.flip==='r'+i?esc(w[1]):esc(w[0])}</span><small>${S.en.flip==='r'+i?'':'دوس للمعنى'}</small></div>`}).join(''):'<p class="hint">علّم كلمات معروفة من بنك الكلمات عشان تتراجع هنا.</p>'}</div>
 <h4>💼 جمل للعملاء (${kp}/${EN_PHRASES.length})</h4>
 <div class="enphs">${EN_PHRASES.map((p,i)=>[p,i]).slice(ppg*CHPP,ppg*CHPP+CHPP).map(([p,i])=>`<div class="enp ${S.en.ph[i]?'on':''}"><span dir="ltr">${esc(p[0])}</span><small>${esc(p[1])}</small><button data-enpk="${i}">${S.en.ph[i]?'✓':'اتقنتها'}</button></div>`).join('')}</div>${pager(EN_PHRASES.length,ppg,'data-enpp')}
 <h4>📚 بنك الكلمات (${kw}/${EN_WORDS.length})</h4>
 <div class="enws">${EN_WORDS.map((w,i)=>[w,i]).slice(wpg*CHPP,wpg*CHPP+CHPP).map(([w,i])=>enWordRow(w,i)).join('')}</div>${pager(EN_WORDS.length,wpg,'data-enwp')}</div>`}
function render(){nav();document.getElementById('date').textContent=nowD().toLocaleDateString('ar-EG',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
 document.getElementById('streak').textContent=streak();
 applyLook();document.body.dataset.view=S.view;const tb=document.getElementById('theme');if(tb)tb.textContent=effTheme()==='dark'?'☀️':'🌙';const h=new Date().getHours();document.getElementById('greet').textContent=(h<12?'صباح الخير':h<18?'نهارك سعيد':'مساء الخير')+' يا '+S.name+' 👋';
 const s=S.sections.find(x=>x.id===S.view);const V={pray:prayView,course:courseView,settings:settingsView,focus:focusView,goals:goalsView,stats:statsView,calendar:calendarView,review:reviewView,home};
 document.body.dataset.ctab=S.view==='course'?CS.tab:'';
 document.getElementById('view').innerHTML=V[S.view]?V[S.view]():s?sectionView(s):(S.view='home',home());save()}
/* ---------- events ---------- */
const parseSteps=t=>t.split('\n').map(x=>x.trim()).filter(Boolean).map(x=>({id:uid(),t:x,d:false}));
document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b||b.closest('.ovl'))return;const q=k=>b.dataset[k];
 if(b.id==='theme'){S.theme=effTheme()==='dark'?'light':'dark'}
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
 else if(q('ctab')){CS.tab=q('ctab');S.course.tab=CS.tab}
 else if(q('chf')){S.ch.f=q('chf')==='all'?undefined:q('chf');S.ch.pg=0}
 else if(q('chpg')){S.ch.pg=+q('chpg')}
 else if(q('enpp')){S.en.pp=+q('enpp')}
 else if(q('enwp')){S.en.wp=+q('enwp')}
 else if(q('chh')){S.ch.hint=S.ch.hint===+q('chh')?undefined:+q('chh')}
 else if(q('chs')){S.ch.show=S.ch.show===+q('chs')?undefined:+q('chs')}
 else if(q('chok')){const i=+q('chok');S.ch.done[i]=1;chTrack(i,1);if(i===S.ch.idx%CHALLENGES.length)S.ch.idx++;confetti();toast('⚡ تحدي جديد اتحل!')}
 else if(q('chx')){delete S.ch.done[+q('chx')];chTrack(+q('chx'),0)}
 else if(q('enkn')){const i=+q('enkn');S.en.w[i]?delete S.en.w[i]:S.en.w[i]=1}
 else if(q('enpk')){const i=+q('enpk');S.en.ph[i]?delete S.en.ph[i]:S.en.ph[i]=1}
 else if(q('enflip')){S.en.flip=S.en.flip===q('enflip')?undefined:q('enflip')}
 else if(b.hasAttribute('data-cpos2')){const nx2=cNext(),na2=COURSE.findIndex((x,i)=>!S.course.a[i]);const r=await ask({title:'مكانك في الكورس',fields:[{id:'v',label:'رقم الفيديو الجاي (1-'+(cLessons().length+1)+')',value:nx2?nx2[0]:cLessons().length+1},{id:'a',label:'رقم التكليف الجاي (1-'+(COURSE.length+1)+')',value:na2<0?COURSE.length+1:na2+1}],ok:'حفظ'});if(!r)return;const n=Math.max(1,Math.min(cLessons().length+1,+r.v||1)),k=Math.max(1,Math.min(COURSE.length+1,+r.a||1));S.course.v={};for(let i=1;i<n;i++)S.course.v[i]=1;S.course.a={};for(let i=0;i<k-1;i++)S.course.a[i]=1;CS.sec=-1;toast('💻 اتحفظ مكانك في الكورس')}
 else if(b.hasAttribute('data-ftest')){playSeq(S.fa.vol,S.fa.sound);return}
 else if(q('th')){S.theme=q('th')}
 else if(q('ac')){S.accent=q('ac')}
 else if(b.hasAttribute('data-atest')){playAlert(true);return}
 else if(b.hasAttribute('data-astop')){stopAlert();return}
 else if(b.hasAttribute('data-cpos')){const n=Math.max(1,Math.min(cLessons().length+1,+document.getElementById('cvid').value||1)),k=+document.getElementById('cas2').value;S.course.v={};for(let i=1;i<n;i++)S.course.v[i]=1;S.course.a={};for(let i=0;i<k-1;i++)S.course.a[i]=1;CS.sec=-1;toast('💻 اتحفظ مكانك في الكورس')}
 else if(q('clr')){const k=q('clr'),nm={log:'سجل المهام والإحصائيات',focus:'جلسات التركيز',pray:'الصلوات والأذكار',course:'تقدم الكورس',goals:'الأهداف'}[k];if(!await confirmD('مسح '+nm+'؟','البيانات دي بس هتتمسح ومش هترجع. اعمل نسخة احتياطية الأول لو محتاج.','امسح'))return;
  if(k==='log'){S.log={};S.carry={};S.key={};S.mood={};S.note={};S.rollTo=''}else if(k==='focus'){S.focus={};S.fl={}}else if(k==='pray'){S.pray={};S.adk={};S.alDone={}}else if(k==='course'){S.course={v:{},a:{},log:{}};CS.sec=-1}else if(k==='goals'){S.goals=[]}toast('🧹 اتمسح: '+nm)}
 else if(q('key')){S.key[today()]=S.key[today()]===q('key')?null:q('key')}
 else if(q('mood')){S.mood[today()]=q('mood')}
 else if(b.hasAttribute('data-export')){const u=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));const l=document.createElement('a');l.href=u;l.download='yawmi-backup-'+today()+'.json';l.click();toast('تم تنزيل النسخة ✅');return}
 else if(q('edit')){const t=allTasks().find(x=>x.id===q('edit'));if(!t)return;const fl=[{id:'title',label:'اسم المهمة',value:t.title},{id:'days',type:'days',label:'تتكرر في أيام',value:t.days||[]}];if(t.played)fl.push({id:'target',label:'الهدف اليومي (فاضي = عداد مفتوح)',value:t.target||'',ph:'مثلا 5'});const r=await ask({title:'تعديل المهمة',fields:fl,ok:'حفظ'});if(!r||!r.title.trim())return;t.title=r.title.trim();t.days=r.days.length&&r.days.length<7?r.days:undefined;if(t.played){const v=parseInt(r.target);t.target=v>0?v:undefined}}
 else if(q('v')){S.view=q('v')}
 else if(q('tick')){const l=day(),tk=allTasks().find(x=>x.id===q('tick'));if(tk&&tk.target){l[q('tick')]=(l[q('tick')]||0)>=tk.target?0:tk.target}else{l[q('tick')]=l[q('tick')]>0?0:1};if(doneToday(allTasks().find(t=>t.id===q('tick')))){const ts=dueToday();if(ts.every(doneToday)){setTimeout(()=>{confetti();toast('خلصت كل مهامك! 🎉')},50)}}}
 else if(q('p')){const l=day(),id=q('p'),t=allTasks().find(x=>x.id===id),before=doneToday(t);if(t&&t.auto)return;l[id]=(l[id]||0)+1;if(!before&&doneToday(t)){const ts=dueToday();if(ts.every(doneToday))setTimeout(()=>{confetti();toast('خلصت كل مهامك! 🎉')},50);else if(t&&t.target)toast('🎯 خلصت '+t.title)}}
 else if(q('m')){if(q('m')==='ch3')return;const l=day();l[q('m')]=Math.max(0,(l[q('m')]||0)-1)}
 else if(q('del')!==undefined){const t=allTasks().find(x=>x.id===q('del'));if(!await confirmD('حذف المهمة؟','"'+(t?t.title:'')+'" هتتحذف نهائيًا.'))return;S.sections.forEach(s=>s.tasks=s.tasks.filter(t=>t.id!==q('del')));0}
 else if(q('add')){const i=document.getElementById('newTask'),v=i.value.trim();if(!v)return;const s=S.sections.find(x=>x.id===q('add'));s.tasks.push({id:uid(),title:v,played:s.id==='games'})}
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
 else if(q('cal')!==undefined){const d=+q('cal');if(d===0){const n=nowD();CM.y=n.getFullYear();CM.m=n.getMonth();CM.sel=today()}else{const n=new Date(CM.y,CM.m+d,1);CM.y=n.getFullYear();CM.m=n.getMonth()}}
 else if(q('carry')){const tmr=nowD();tmr.setDate(tmr.getDate()+1);const k=dk(tmr);const ids=dueToday().filter(t=>!doneToday(t)).map(t=>t.id);S.carry[k]=[...new Set([...(S.carry[k]||[]),...ids])];toast('📦 اتنقلت '+ids.length+' مهمة لبكرة')}
 else return;
 render()});
document.addEventListener('keydown',e=>{
 if(e.key==='Enter'&&e.target.id==='newTask')document.querySelector('[data-add]').click();
 if(e.code==='Space'&&S.view==='focus'&&!/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(e.target.tagName)){e.preventDefault();FT.run?pauseTimer():startTimer();render()}});
document.addEventListener('input',e=>{if(e.target.id==='note'){S.note[today()]=e.target.value;save()}
 if(e.target.dataset.chin!==undefined){S.ch.ans[+e.target.dataset.chin]=e.target.value;save()}});
document.addEventListener('change',e=>{const t=e.target;
 if(t.id==='ftask'){FT.task=t.value;render();return}
 if(t.dataset.fs){S.fs[t.dataset.fs]=Math.max(1,Math.min(+t.max||180,+t.value||1));if(!FT.run&&!FT.startedAt)setMode(FT.mode);render();return}
 if(t.dataset.fsb){S.fs[t.dataset.fsb]=t.checked;save();return}
 if(t.id==='minPct'){S.minPct=+t.value;render()}if(t.id==='wt'){S.weekTarget=+t.value;render()}if(t.id==='rem'){S.remind=t.value;if(S.remind&&'Notification' in window)Notification.requestPermission();render()}
 if(t.id==='sname'){S.name=t.value.trim()||'Malky';render();return}
 if(t.id==='scity'){S.city=t.value;render();return}
 if(t.id==='smethod'){S.method=t.value;render();return}
 if(t.id==='clat'||t.id==='clon'){S[t.id]=+t.value||0;render();return}
 if(t.id==='dstart'){S.dayStart=+t.value;S.rollTo='';autoRollover();render();return}
 if(t.id==='alsound'){S.al.sound=t.value;if(t.value==='custom'&&!localStorage.getItem('yawmi-adhan'))toast('ارفع ملف الأذان الأول');save();return}
 if(t.id==='alvol'){S.al.vol=+t.value;save();return}
 if(t.id==='fasound'){S.fa.sound=t.value;save();return}
 if(t.id==='favol'){S.fa.vol=+t.value;save();return}
 if(t.id==='cntdate'){S.count.date=t.value;save();return}
 if(t.id==='cnttxt'){S.count.txt=t.value.trim();save();return}
 if(t.dataset.fsnd){S.fa.sound=t.dataset.fsnd&&t.value;save();return}
 if(t.dataset.fvol!==undefined){S.fa.vol=+t.value;save();return}
 if(t.id==='adhanf'){const f=t.files[0];if(!f)return;if(f.size>3.5*1024*1024){toast('الملف كبير. اختار ملف أقل من 3.5 ميجا');return}const r=new FileReader();r.onload=()=>{try{localStorage.setItem('yawmi-adhan',r.result);S.al.sound='custom';toast('✅ اتحفظ ملف الأذان');render()}catch(e){toast('المتصفح مش قادر يحفظ الملف ده، جرب ملف أصغر')}};r.readAsDataURL(f);return}
 if(t.dataset.aon){S.al.on=t.checked;save();return}
 if(t.dataset.aoff){S.al.off[t.dataset.aoff]=!t.checked;save();return}
 if(t.dataset.hh){S.hh[t.dataset.hh]=!t.checked;save();return}
 if(t.dataset.nt){S.nt[t.dataset.nt]=t.checked;if(t.checked&&'Notification' in window)Notification.requestPermission();save();return}
 if(t.id==='imp'){const f=t.files[0];if(!f)return;f.text().then(x=>{try{const d=JSON.parse(x);if(!d.sections)throw 0;localStorage.setItem(KEY,x);location.reload()}catch(z){ask({title:'الملف مش صالح',msg:'اختار ملف نسخة احتياطية من يومي.',ok:'تمام',noCancel:true})}})}});
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
if(location.hash.length>1){const h=location.hash.slice(1);if(VIEWS.some(v=>v[0]===h)){S.view=h;if(h==='course')CS.tab='v'}}
render();
setInterval(()=>{if(!S.remind)return;const n=new Date(),hm=String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0');if(hm>=S.remind&&S.lastRemind!==today()&&!ok(today())){S.lastRemind=today();save();try{if(Notification.permission==='granted')new Notification('يومي',{body:'لسه ما سجلتش حاجة النهارده. مهمة واحدة بس! 💪'})}catch(e){}toast('⏰ وقت مهامك! مهمة واحدة بس')}},30000);

setInterval(checkPrayerAlerts,5000);
document.addEventListener('visibilitychange',()=>{if(FT.run)ftick()});
window.addEventListener('focus',()=>{if(FT.run)ftick()});

let DR=null;
document.addEventListener('pointerdown',e=>{const g=e.target.closest('.grip');if(!g)return;const row=g.closest('.gstep');DR={row,card:row.closest('.gcard'),gid:row.dataset.g,y0:e.clientY,to:null};row.classList.add('drag');e.preventDefault()});
document.addEventListener('pointermove',e=>{if(!DR)return;DR.row.style.transform='translateY('+(e.clientY-DR.y0)+'px)';
 const rows=[...DR.card.querySelectorAll('.gstep')];rows.forEach(r=>r.classList.remove('ob','oa'));DR.to=null;
 for(const r of rows){if(r===DR.row)continue;const b=r.getBoundingClientRect();if(e.clientY>=b.top&&e.clientY<=b.bottom){const bef=e.clientY<b.top+b.height/2;r.classList.add(bef?'ob':'oa');DR.to={id:r.dataset.s,bef};break}}});
function endDrag(){if(!DR)return;const d=DR;DR=null;if(d.to){const g=S.goals.find(x=>x.id===d.gid),id=d.row.dataset.s,i=g.steps.findIndex(x=>x.id===id),it=g.steps.splice(i,1)[0];let j=g.steps.findIndex(x=>x.id===d.to.id);if(!d.to.bef)j++;g.steps.splice(j,0,it)}render()}
document.addEventListener('pointerup',endDrag);document.addEventListener('pointercancel',endDrag);
