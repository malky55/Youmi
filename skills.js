(function(){
const LV=['مبتدئ','متوسط','متقدم','محترف'];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function open(ed){
 if(!Array.isArray(S.skills)||(S.skills[0]&&!S.skills[0].items))S.skills=[];
 let m=document.getElementById('skm');const sc=m?m.querySelector('.skp').scrollTop:0;if(m)m.remove();
 m=document.createElement('div');m.id='skm';m.className='skov';
 const total=S.skills.reduce((a,g)=>a+g.items.length,0);
 const E=ed?S.skills[ed[0]].items[ed[1]]:{n:'',l:1};const eg=ed?ed[0]:(S.skills.length?S.skills.length-1:-1);
 const groups=S.skills.map((g,gi)=>`<div class="skg"><div class="skgh"><span class="skgt" data-gr="${gi}" title="دوس لتغيير الاسم">${esc(g.g)} ✎</span><span class="skc">${g.items.length}</span><button class="skx" data-gd="${gi}" title="حذف المجموعة">🗑</button></div>${g.items.map((k,i)=>`<div class="skrow"><div class="skn">${esc(k.n)}</div><div class="skl">${[0,1,2,3].map(j=>`<button class="skd ${j<=k.l?'on':''}" data-sl="${gi}:${i}:${j}" title="${LV[j]}"></button>`).join('')}<span class="sklt">${LV[k.l]}</span></div><button class="skx" data-se="${gi}:${i}" title="تعديل">✎</button><button class="skx" data-sd="${gi}:${i}" title="حذف">🗑</button></div>`).join('')||'<div class="pjn">مفيش مهارات في المجموعة دي</div>'}</div>`).join('')||'<div class="skem">لسه مفيش مهارات. ضيف أول مهارة من تحت.</div>';
 const opts=S.skills.map((g,i)=>`<option value="${i}" ${i===eg?'selected':''}>${esc(g.g)}</option>`).join('')+`<option value="new" ${eg<0?'selected':''}>＋ مجموعة جديدة…</option>`;
 m.innerHTML=`<div class="skp"><div class="skh"><h3>🧠 مهاراتي</h3><button class="skx" data-sc>✕</button></div><div class="sksub">${S.skills.length} مجموعات · ${total} مهارة · دوس على النقط لتحديد المستوى</div>${groups}<div class="skg pjf"><div class="skgt" style="cursor:default">${ed?'تعديل المهارة':'مهارة جديدة'}</div><select id="skgs">${opts}</select><input id="skgn" placeholder="اسم المجموعة الجديدة (مثال: البرمجة)" maxlength="30" style="${eg<0?'':'display:none'}"><input id="skname" placeholder="اسم المهارة" maxlength="40" value="${esc(E.n)}"><select id="sklv">${LV.map((l,i)=>`<option value="${i}" ${E.l===i?'selected':''}>${l}</option>`).join('')}</select><div class="skadd"><button class="skgo" data-ss="${ed?ed.join(':'):''}" style="padding:10px 22px">${ed?'حفظ التعديل':'إضافة'}</button>${ed?'<button class="skx" data-scn style="width:auto;padding:0 14px;border-radius:14px">إلغاء</button>':''}</div></div></div>`;
 document.body.appendChild(m);m.querySelector('.skp').scrollTop=sc;
 m.querySelector('#skgs').onchange=e=>{m.querySelector('#skgn').style.display=e.target.value==='new'?'block':'none'};
 m.onclick=e=>{const t=e.target,d=t.dataset;
  if(t===m||t.hasAttribute('data-sc')){m.remove();return}
  if(t.hasAttribute('data-scn')){open();return}
  if(d.gd!==undefined){if(confirm('حذف المجموعة بكل مهاراتها؟')){S.skills.splice(+d.gd,1);save();open()}return}
  if(d.gr!==undefined){const g=S.skills[+d.gr],v=prompt('اسم المجموعة',g.g);if(v&&v.trim()){g.g=v.trim();save();open()}return}
  if(d.se){open(d.se.split(':').map(Number));return}
  if(d.sd){const[a,b]=d.sd.split(':').map(Number);S.skills[a].items.splice(b,1);save();open();return}
  if(d.sl){const[a,b,c]=d.sl.split(':').map(Number);S.skills[a].items[b].l=c;save();open();return}
  if(d.ss!==undefined){const n=m.querySelector('#skname').value.trim();if(!n)return;const l=+m.querySelector('#sklv').value;let gv=m.querySelector('#skgs').value;
   if(gv==='new'){const gn=m.querySelector('#skgn').value.trim();if(!gn)return;S.skills.push({g:gn,items:[]});gv=S.skills.length-1}else gv=+gv;
   if(d.ss){const[a,b]=d.ss.split(':').map(Number);S.skills[a].items.splice(b,1)}
   S.skills[gv].items.push({n,l});save();open()}};
 m.onkeydown=e=>{if(e.key==='Enter'&&e.target.tagName==='INPUT')m.querySelector('[data-ss]').click()};
}
document.addEventListener('click',e=>{const c=e.target.closest&&e.target.closest('#skbtn,#pjbtn');if(!c)return;if(c.id==='skbtn')open();else popen(-1)});
window.openSkills=open;
/* ---- projects ---- */
const U=u=>{u=(u||'').trim();return u&&!/^https?:\/\//i.test(u)?'https://'+u:u};
function popen(ed){
 if(!Array.isArray(S.projects))S.projects=[];
 let m=document.getElementById('pjm');const sc=m?m.querySelector('.skp').scrollTop:0;if(m)m.remove();
 m=document.createElement('div');m.id='pjm';m.className='skov';
 const e=ed>=0?S.projects[ed]:{t:'',d:'',u:''};
 const cards=S.projects.map((k,i)=>`<div class="pjc"><div class="pjt">${esc(k.t)}</div>${k.d?`<div class="pjd">${esc(k.d)}</div>`:''}<div class="pja">${k.u?`<a class="pjl" href="${esc(U(k.u))}" target="_blank" rel="noopener">🔗 افتح المشروع</a>`:'<span class="pjn">من غير لينك</span>'}<span style="flex:1"></span><button class="skx" data-pe="${i}" title="تعديل">✎</button><button class="skx" data-pd="${i}" title="حذف">🗑</button></div></div>`).join('')||'<div class="skem">لسه مفيش مشاريع. ضيف أول مشروع من تحت.</div>';
 m.innerHTML=`<div class="skp"><div class="skh"><h3>💻 مشاريعي</h3><button class="skx" data-pc>✕</button></div><div class="sksub">${S.projects.length} مشروع</div>${cards}<div class="skg pjf"><div class="skgt" style="cursor:default">${ed>=0?'تعديل المشروع':'مشروع جديد'}</div><input id="pjt" placeholder="اسم المشروع" maxlength="40" value="${esc(e.t)}"><input id="pjd" placeholder="وصف قصير" maxlength="120" value="${esc(e.d)}"><input id="pju" dir="ltr" placeholder="https://github.com/..." value="${esc(e.u)}"><div class="skadd"><button class="skgo" data-ps="${ed}" style="padding:10px 22px">${ed>=0?'حفظ التعديل':'إضافة'}</button>${ed>=0?'<button class="skx" data-pcn style="width:auto;padding:0 14px;border-radius:14px">إلغاء</button>':''}</div></div></div>`;
 document.body.appendChild(m);m.querySelector('.skp').scrollTop=sc;
 m.onclick=ev=>{const t=ev.target,d=t.dataset;
  if(t===m||t.hasAttribute('data-pc')){m.remove();return}
  if(t.hasAttribute('data-pcn')){popen(-1);return}
  if(d.pe!==undefined){popen(+d.pe);return}
  if(d.pd!==undefined){if(confirm('حذف المشروع؟')){S.projects.splice(+d.pd,1);save();popen(-1);rs()}return}
  if(d.ps!==undefined){const t1=m.querySelector('#pjt').value.trim();if(!t1)return;const o={id:Date.now(),t:t1,d:m.querySelector('#pjd').value.trim(),u:U(m.querySelector('#pju').value)};
   if(+d.ps>=0)S.projects[+d.ps]=Object.assign(S.projects[+d.ps],o,{id:S.projects[+d.ps].id});else S.projects.push(o);save();popen(-1);rs()}};
}
function rs(){}
window.openProjects=popen;
})();
