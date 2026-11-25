const KEY='yawmi-v1';
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
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
 log:{}, // date -> {taskId:count}
 view:'home'};
S.mood=S.mood||{};S.note=S.note||{};S.theme=S.theme||'light';S.focus=S.focus||{};S.goal=S.goal||0;S.minPct=S.minPct||0;S.weekTarget=S.weekTarget||5;S.key=S.key||{};S.remind=S.remind||'';S.lastRemind=S.lastRemind||'';
const save=()=>localStorage.setItem(KEY,JSON.stringify(S));
const day=(d=today())=>S.log[d]||(S.log[d]={});
const allTasks=()=>S.sections.flatMap(s=>s.tasks);
const doneToday=t=>(day()[t.id]||0)>0;
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function total(id){return Object.values(S.log).reduce((a,d)=>a+(d[id]||0),0)}
function pct(d){const ts=allTasks();if(!ts.length)return 0;const l=S.log[d]||{};return ts.filter(t=>l[t.id]>0).length/ts.length}
const ok=k=>{const p=pct(k);return S.minPct?p*100>=S.minPct:p>0};
function streak(){let n=0,d=new Date();if(!ok(today()))d.setDate(d.getDate()-1);
 for(;;){const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');if(ok(k)){n++;d.setDate(d.getDate()-1)}else break}return n}
function best(){const ks=Object.keys(S.log).sort();let b=0,c=0,prev=null;for(const k of ks){if(!ok(k)){c=0;prev=null;continue}const d=new Date(k+'T00:00:00');if(prev&&Math.round((d-prev)/864e5)===1)c++;else c=1;prev=d;b=Math.max(b,c)}return Math.max(b,streak())}
function tstreak(id){let n=0,d=new Date();if(!((S.log[dk(d)]||{})[id]>0))d.setDate(d.getDate()-1);while((S.log[dk(d)]||{})[id]>0){n++;d.setDate(d.getDate()-1)}return n}
function weekDays(){const r=[],x=new Date();const off=(x.getDay()+1)%7;x.setDate(x.getDate()-off);for(let i=0;i<7;i++){r.push(dk(x));x.setDate(x.getDate()+1)}return r}
function taskRow(t){const c=day()[t.id]||0;const done=c>0;
 return `<div class="task ${done?'done':''}"><button class="chk" data-tick="${t.id}">${done?'✓':''}</button><span class="t">${S.key[today()]===t.id?'⭐ ':''}${esc(t.title)}</span>${tstreak(t.id)>=2?`<span class="sk">🔥 ${tstreak(t.id)}</span>`:''}<button class="del" data-key="${t.id}" title="مهمة اليوم الأساسية">⭐</button>
 ${t.played?`<span class="cnt"><button data-m="${t.id}">−</button><b>${c}</b><button data-p="${t.id}">+</button></span>`:''}
 <button class="del" data-edit="${t.id}" title="تعديل">✏️</button><button class="del" data-del="${t.id}" title="حذف">🗑</button></div>`}
const dk=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const QUOTES=['الاستمرارية أهم من الكمال 💎','خطوة صغيرة كل يوم بتعمل فرق كبير 🌱','النهارده أحسن من إمبارح بحاجة بسيطة ✨','ابدأ بأسهل مهمة وهتشد الباقي 🚀','ريّح دماغك شوية وارجع أقوى 🧘'];
const quote=()=>QUOTES[new Date().getDate()%QUOTES.length];
function heat(){let h='';for(let i=27;i>=0;i--){const x=new Date();x.setDate(x.getDate()-i);const p=pct(dk(x));h+=`<i class="hc l${p===0?0:p<.34?1:p<.67?2:3}" title="${dk(x)} · ${Math.round(p*100)}%"></i>`}return `<div class="heat">${h}</div>`}
const MOODS=['😫','😕','😐','🙂','🤩'];
let FT={left:25*60,run:false,iv:null,mode:'work'};
function fmt(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function focusView(){const m=S.focus[today()]||0;return `<h3>⏱️ وقت التركيز</h3><div class="focus"><div class="ftime" id="ft">${fmt(FT.left)}</div><p>${FT.mode==='work'?'جلسة تركيز':'استراحة'} · جلسات النهارده: <b>${m}</b></p>
 <div class="fbtns"><button data-f="toggle">${FT.run?'⏸ إيقاف':'▶ ابدأ'}</button><button data-f="reset">↺ إعادة</button><button data-f="w">25 دقيقة</button><button data-f="b">استراحة 5</button></div></div>`}
function ftick(){FT.left--;const el=document.getElementById('ft');if(el)el.textContent=fmt(FT.left);
 if(FT.left<=0){clearInterval(FT.iv);FT.run=false;if(FT.mode==='work'){S.focus[today()]=(S.focus[today()]||0)+1;FT.mode='break';FT.left=300}else{FT.mode='work';FT.left=1500}
  try{navigator.vibrate&&navigator.vibrate([200,100,200])}catch(e){}confetti();render()}}
function confetti(){const c=document.createElement('div');c.className='conf';let h='';for(let i=0;i<40;i++)h+=`<i style="left:${Math.random()*100}%;background:hsl(${Math.random()*360},80%,60%);animation-delay:${Math.random()*.4}s"></i>`;c.innerHTML=h;document.body.appendChild(c);setTimeout(()=>c.remove(),2200)}
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}
function nav(){document.getElementById('nav').innerHTML=
 `<button class="nav-btn ${S.view==='home'?'active':''}" data-v="home"><span>🏠 الرئيسية</span></button>`+
 `<button class="nav-btn ${S.view==='focus'?'active':''}" data-v="focus"><span>⏱️ التركيز</span></button>`+
 S.sections.map(s=>{const d=s.tasks.filter(doneToday).length;return `<button class="nav-btn ${S.view===s.id?'active':''}" data-v="${s.id}"><span>${s.icon} ${esc(s.name)}</span><small>${d}/${s.tasks.length}</small></button>`}).join('')}
function home(){const ts=allTasks(),d=ts.filter(doneToday).length,p=ts.length?Math.round(d/ts.length*100):0;
 const plays=Object.values(day()).reduce((a,b)=>a+b,0);
 const gamesSec=S.sections.find(s=>s.id==='games');
 const gt=gamesSec?gamesSec.tasks.reduce((a,t)=>a+total(t.id),0):0;
 const days=[];for(let i=6;i>=0;i--){const x=new Date();x.setDate(x.getDate()-i);const k=x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');days.push([k,x.toLocaleDateString('ar-EG',{weekday:'short'})])}
 const msg=p===100?'خلصت كل حاجة النهارده! 🎉':p>=50?'قربت، كمّل يا وحش 💪':'يلا نبدأ اليوم 🚀';
 const mood=S.mood[today()];
 const y=new Date();y.setDate(y.getDate()-1);const missed=!ok(dk(y))&&Object.keys(S.log).length>0&&!ok(today());
 const kt=allTasks().find(t=>t.id===S.key[today()]);
 const wd=weekDays(),wdone=wd.filter(ok).length,names=['س','ح','ن','ث','ر','خ','ج'];
 const bs=streak(),bb=best(),fs=Object.values(S.focus).reduce((x,y)=>x+y,0);
 const BG=[['🌱 3 أيام',bb>=3],['🔥 7 أيام',bb>=7],['💪 14 يوم',bb>=14],['👑 30 يوم',bb>=30],['⏱️ 10 جلسات تركيز',fs>=10],['🎯 50 جلسة',fs>=50]];
 const last7=wd.map(k=>Math.round(pct(k)*100)),avg=Math.round(last7.reduce((x,y)=>x+y,0)/7);
 return `${missed?'<div class="warn">⚠️ فاتك إمبارح. قاعدة ذهبية: ما تفوتش مرتين ورا بعض. خلص مهمة واحدة بس النهارده 💛</div>':''}<div class="key">${kt?`⭐ مهمتك الأساسية النهارده: <b>${esc(kt.title)}</b> ${doneToday(kt)?'✅':''}`:`⭐ اختار مهمة أساسية واحدة النهارده (دوس على ⭐ جنب أي مهمة)`}</div><div class="quote">${quote()}</div><div class="hero"><div class="ring" style="--p:${p}"><div>${p}%</div></div><div><h2>${msg}</h2><p>خلصت ${d} من ${ts.length} مهمة النهارده</p></div></div>
 <div class="cards"><div class="card"><div class="n">${d}</div><div class="l">مهام خلصتها النهارده ✅</div></div>
 <div class="card"><div class="n">${plays}</div><div class="l">مرات اتسجلت النهارده</div></div>
 <div class="card"><div class="n">${gt}</div><div class="l">إجمالي مرات اللعب 🎮</div></div>
 <div class="card"><div class="n">${streak()}</div><div class="l">أيام متواصلة 🔥</div></div></div>
 <h3>📅 الأسبوع ده: ${wdone} من ${S.weekTarget} أيام ${wdone>=S.weekTarget?'🏆':''}</h3><div class="wk">${wd.map((k,i)=>`<div class="wd ${ok(k)?'on':''}">${names[i]}</div>`).join('')}<span>متوسط الأسبوع ${avg}% · أطول سلسلة ${bb} يوم</span></div>
 <h3>🏅 إنجازات</h3><div class="badges">${BG.map(([n,o])=>`<div class="badge ${o?'on':''}">${n}</div>`).join('')}</div>
 <h3>⚙️ إعدادات الالتزام</h3><div class="set"><label>اليوم يتحسب لما تخلص <select id="minPct">${[[0,'مهمة واحدة'],[50,'50% من المهام'],[100,'كل المهام']].map(([v,l])=>`<option value="${v}" ${S.minPct===v?'selected':''}>${l}</option>`).join('')}</select></label><label>هدف الأسبوع <select id="wt">${[3,4,5,6,7].map(v=>`<option ${S.weekTarget===v?'selected':''}>${v}</option>`).join('')}</select> أيام</label><label>تذكير يومي <input type="time" id="rem" value="${S.remind}"></label></div>
 <h3>إزاي حاسس النهارده؟</h3><div class="moods">${MOODS.map(m=>`<button class="mood ${mood===m?'on':''}" data-mood="${m}">${m}</button>`).join('')}</div>
 <h3>📝 ملاحظة اليوم</h3><textarea id="note" placeholder="اكتب أي حاجة عن يومك...">${esc(S.note[today()]||'')}</textarea>
 <h3>آخر ٢٨ يوم</h3>${heat()}
 <h3>آخر ٧ أيام</h3><div class="bars">${days.map(([k,l])=>`<div class="bar"><i style="height:${Math.round(pct(k)*100)}%"></i>${l}</div>`).join('')}</div>
 <div class="tools"><button data-export>⬇️ نسخة احتياطية</button><label class="filebtn">⬆️ استرجاع<input type="file" id="imp" accept=".json" hidden></label><button data-reset>إعادة ضبط</button></div>`}
function sectionView(s){const dn=s.tasks.filter(doneToday).length,pp=s.tasks.length?Math.round(dn/s.tasks.length*100):0;
 return `<h3>${s.icon} ${esc(s.name)}</h3><div class="pbar"><i style="width:${pp}%"></i></div>${s.tasks.slice().sort((x,y)=>doneToday(x)-doneToday(y)).map(taskRow).join('')||'<p>مفيش مهام لسه، ضيف أول واحدة 👇</p>'}
 <div class="add"><input id="newTask" placeholder="مهمة جديدة..."><button data-add="${s.id}">إضافة</button></div>
 ${s.id==='games'||s.tasks.some(t=>t.played)?'<p style="opacity:.6;font-size:13px">المهام اللي جنبها عدّاد تقدر تسجل عدد مرات اللعب بـ + و −</p>':''}
 <button class="rm" data-delsec="${s.id}">حذف القسم ده</button>`}
function render(){nav();document.getElementById('date').textContent=new Date().toLocaleDateString('ar-EG',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
 document.getElementById('streak').textContent=streak();
 document.body.dataset.theme=S.theme;const tb=document.getElementById('theme');if(tb)tb.textContent=S.theme==='dark'?'☀️':'🌙';const h=new Date().getHours();document.getElementById('greet').textContent=(h<12?'صباح الخير':h<18?'نهارك سعيد':'مساء الخير')+' يا بطل 👋';
 const s=S.sections.find(x=>x.id===S.view);document.getElementById('view').innerHTML=S.view==='focus'?focusView():s?sectionView(s):(S.view='home',home());save()}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const q=k=>b.dataset[k];
 if(b.id==='theme'){S.theme=S.theme==='dark'?'light':'dark'}
 else if(q('f')){const f=q('f');if(f==='toggle'){if(FT.run){clearInterval(FT.iv);FT.run=false}else{FT.run=true;FT.iv=setInterval(ftick,1000)}}else{clearInterval(FT.iv);FT.run=false;if(f==='b'){FT.mode='break';FT.left=300}else{FT.mode='work';FT.left=1500}}}
 else if(q('key')){S.key[today()]=S.key[today()]===q('key')?null:q('key')}
 else if(q('mood')){S.mood[today()]=q('mood')}
 else if(b.hasAttribute('data-export')){const u=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));const l=document.createElement('a');l.href=u;l.download='yawmi-backup-'+today()+'.json';l.click();toast('تم تنزيل النسخة ✅');return}
 else if(q('edit')){const t=allTasks().find(x=>x.id===q('edit'));const n=prompt('عدّل المهمة',t.title);if(!n||!n.trim())return;t.title=n.trim()}
 else if(q('v')){S.view=q('v')}
 else if(q('tick')){const l=day();l[q('tick')]=l[q('tick')]>0?0:1;if(l[q('tick')]){const ts=allTasks();if(ts.every(t=>l[t.id]>0)){setTimeout(()=>{confetti();toast('خلصت كل مهامك! 🎉')},50)}}}
 else if(q('p')){const l=day();l[q('p')]=(l[q('p')]||0)+1}
 else if(q('m')){const l=day();l[q('m')]=Math.max(0,(l[q('m')]||0)-1)}
 else if(q('del')!==undefined){if(!confirm('تحذف المهمة؟'))return;S.sections.forEach(s=>s.tasks=s.tasks.filter(t=>t.id!==q('del')))}
 else if(q('add')){const i=document.getElementById('newTask'),v=i.value.trim();if(!v)return;const s=S.sections.find(x=>x.id===q('add'));s.tasks.push({id:uid(),title:v,played:s.id==='games'})}
 else if(q('delsec')){if(!confirm('تحذف القسم بكل مهامه؟'))return;S.sections=S.sections.filter(s=>s.id!==q('delsec'));S.view='home'}
 else if(b.id==='addSection'){const n=prompt('اسم القسم الجديد؟');if(!n)return;const ic=prompt('إيموجي للقسم (اختياري)','📌')||'📌';const id=uid();S.sections.push({id,name:n.trim(),icon:ic,tasks:[]});S.view=id}
 else if(b.hasAttribute('data-reset')){if(!confirm('متأكد؟ كل البيانات هتتمسح'))return;localStorage.removeItem(KEY);location.reload();return}
 else return;
 render()});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='newTask')document.querySelector('[data-add]').click()});
document.addEventListener('input',e=>{if(e.target.id==='note'){S.note[today()]=e.target.value;save()}});
document.addEventListener('change',e=>{if(e.target.id==='minPct'){S.minPct=+e.target.value;render()}if(e.target.id==='wt'){S.weekTarget=+e.target.value;render()}if(e.target.id==='rem'){S.remind=e.target.value;if(S.remind&&'Notification' in window)Notification.requestPermission();render()}if(e.target.id==='imp'){const f=e.target.files[0];if(!f)return;f.text().then(t=>{try{const d=JSON.parse(t);if(!d.sections)throw 0;localStorage.setItem(KEY,t);location.reload()}catch(x){alert('الملف مش صالح')}})}});
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
render();
setInterval(()=>{if(!S.remind)return;const n=new Date(),hm=String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0');if(hm>=S.remind&&S.lastRemind!==today()&&!ok(today())){S.lastRemind=today();save();try{if(Notification.permission==='granted')new Notification('يومي',{body:'لسه ما سجلتش حاجة النهارده. مهمة واحدة بس! 💪'})}catch(e){}toast('⏰ وقت مهامك! مهمة واحدة بس')}},30000);
