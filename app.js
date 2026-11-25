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
const save=()=>localStorage.setItem(KEY,JSON.stringify(S));
const day=(d=today())=>S.log[d]||(S.log[d]={});
const allTasks=()=>S.sections.flatMap(s=>s.tasks);
const doneToday=t=>(day()[t.id]||0)>0;
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function total(id){return Object.values(S.log).reduce((a,d)=>a+(d[id]||0),0)}
function pct(d){const ts=allTasks();if(!ts.length)return 0;const l=S.log[d]||{};return ts.filter(t=>l[t.id]>0).length/ts.length}
function streak(){let n=0,d=new Date();if(pct(today())===0)d.setDate(d.getDate()-1);
 for(;;){const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');if(pct(k)>0){n++;d.setDate(d.getDate()-1)}else break}return n}
function taskRow(t){const c=day()[t.id]||0;const done=c>0;
 return `<div class="task ${done?'done':''}"><button class="chk" data-tick="${t.id}">${done?'✓':''}</button><span class="t">${esc(t.title)}</span>
 ${t.played?`<span class="cnt"><button data-m="${t.id}">−</button><b>${c}</b><button data-p="${t.id}">+</button></span>`:''}
 <button class="del" data-del="${t.id}" title="حذف">🗑</button></div>`}
function nav(){document.getElementById('nav').innerHTML=
 `<button class="nav-btn ${S.view==='home'?'active':''}" data-v="home"><span>🏠 الرئيسية</span></button>`+
 S.sections.map(s=>{const d=s.tasks.filter(doneToday).length;return `<button class="nav-btn ${S.view===s.id?'active':''}" data-v="${s.id}"><span>${s.icon} ${esc(s.name)}</span><small>${d}/${s.tasks.length}</small></button>`}).join('')}
function home(){const ts=allTasks(),d=ts.filter(doneToday).length,p=ts.length?Math.round(d/ts.length*100):0;
 const plays=Object.values(day()).reduce((a,b)=>a+b,0);
 const gamesSec=S.sections.find(s=>s.id==='games');
 const gt=gamesSec?gamesSec.tasks.reduce((a,t)=>a+total(t.id),0):0;
 const days=[];for(let i=6;i>=0;i--){const x=new Date();x.setDate(x.getDate()-i);const k=x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');days.push([k,x.toLocaleDateString('ar-EG',{weekday:'short'})])}
 const msg=p===100?'خلصت كل حاجة النهارده! 🎉':p>=50?'قربت، كمّل يا وحش 💪':'يلا نبدأ اليوم 🚀';
 return `<div class="hero"><div class="ring" style="--p:${p}"><div>${p}%</div></div><div><h2>${msg}</h2><p>خلصت ${d} من ${ts.length} مهمة النهارده</p></div></div>
 <div class="cards"><div class="card"><div class="n">${d}</div><div class="l">مهام خلصتها النهارده ✅</div></div>
 <div class="card"><div class="n">${plays}</div><div class="l">مرات اتسجلت النهارده</div></div>
 <div class="card"><div class="n">${gt}</div><div class="l">إجمالي مرات اللعب 🎮</div></div>
 <div class="card"><div class="n">${streak()}</div><div class="l">أيام متواصلة 🔥</div></div></div>
 <h3>آخر ٧ أيام</h3><div class="bars">${days.map(([k,l])=>`<div class="bar"><i style="height:${Math.round(pct(k)*100)}%"></i>${l}</div>`).join('')}</div>
 <button class="rm" data-reset>إعادة ضبط كل البيانات</button>`}
function sectionView(s){return `<h3>${s.icon} ${esc(s.name)}</h3>${s.tasks.map(taskRow).join('')||'<p>مفيش مهام لسه، ضيف أول واحدة 👇</p>'}
 <div class="add"><input id="newTask" placeholder="مهمة جديدة..."><button data-add="${s.id}">إضافة</button></div>
 ${s.id==='games'||s.tasks.some(t=>t.played)?'<p style="opacity:.6;font-size:13px">المهام اللي جنبها عدّاد تقدر تسجل عدد مرات اللعب بـ + و −</p>':''}
 <button class="rm" data-delsec="${s.id}">حذف القسم ده</button>`}
function render(){nav();document.getElementById('date').textContent=new Date().toLocaleDateString('ar-EG',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
 document.getElementById('streak').textContent=streak();
 const s=S.sections.find(x=>x.id===S.view);document.getElementById('view').innerHTML=s?sectionView(s):(S.view='home',home());save()}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const q=k=>b.dataset[k];
 if(q('v')){S.view=q('v')}
 else if(q('tick')){const l=day();l[q('tick')]=l[q('tick')]>0?0:1}
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
render();
