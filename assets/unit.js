/* Unit page engine — Gramática de uso A1–B2 (study site)
   Requires: assets/units.js (UNITS, GROUPS) and window.UNIT (this unit's data) */
const U = window.UNIT, N = U.id, LAST = UNITS.length;
const PKEY = 'gdu-a1b2-progress', NKEY = 'gdu-name';
const $ = s => document.querySelector(s);
const state = {}, marks = {}; let focusedInput = null, lastResult = null;
const store = {
  get(k){ try{ return JSON.parse(localStorage.getItem(k)); }catch(e){ return null; } },
  set(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
};
const progress = () => store.get(PKEY) || {};
const total = () => U.ex.reduce((n,e)=>n+e.items.length,0);
const fmt = n => (Math.round(n*10)/10).toString();

function speak(t){
  try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='es-ES'; u.rate=.9; speechSynthesis.speak(u);}catch(e){}
}
document.addEventListener('click',e=>{ const s=e.target.closest('.es'); if(s) speak(s.dataset.say); });
document.addEventListener('keydown',e=>{ if((e.key==='Enter'||e.key===' ') && e.target.classList && e.target.classList.contains('es')){ e.preventDefault(); speak(e.target.dataset.say);} });

const NOBREAK='(?<!\\bSra?)(?<!\\bDra?)(?<!\\bSrta)(?<!\\bUds?)(?<!\\bEE)';
function fmtQ(s){
  if(!s) return s;
  s=s.replace(/ (?=–)/g,'<br>');
  s=s.replace(new RegExp('(?<![A-Za-z]\\.[A-Z])'+NOBREAK+'([.!?…])\\s+(?=[¿¡A-ZÁÉÍÓÚÑ(\\[])','g'),'$1<br>');
  return s;
}

function chapter(){
  const T = total(), prev = N>1, next = N<LAST;
  document.title = `Unidad ${N} · ${U.es} — Gramática de uso A1–B2`;
  $('#app').innerHTML = `
  <div class="studybar"><div class="wrap">
    <div class="sb-row">
      <a class="home" href="../">← 메인</a>
      <span class="home" style="background:transparent">UNIDAD ${N} / ${LAST}</span>
      <span class="sb-spacer"></span>
      <span class="count" id="count">답한 문제 0 / ${T}</span>
      <button class="btn" id="gradeBtn">채점하기</button>
    </div>
    <div class="keys" aria-label="스페인어 특수문자 입력"><span>입력 도우미</span>${['á','é','í','ó','ú','ñ','ü','¿','¡'].map(k=>`<button type="button" data-k="${k}">${k}</button>`).join('')}</div>
  </div></div>
  <header class="col ch-head"><div class="no">UNIDAD ${N}</div><h1>${U.es}<small>${U.ko}</small></h1>
    <nav class="ex-nav" aria-label="바로가기"><a href="#theory">문법 정리</a>${U.ex.map((e,i)=>`<a href="#ex${i}">연습 ${i+1}</a>`).join('')}</nav></header>
  <main class="col">
    <section class="theory" id="theory">${U.theory}</section>
    ${U.ex.map((e,ei)=>exHTML(e,ei)).join('')}
    <section class="result" id="result" hidden aria-live="polite"></section>
    <div class="pager">${prev?`<a href="../Unidad${N-1}/">← Unidad ${N-1}</a>`:'<span></span>'}<a href="../">전체 목차</a>${next?`<a href="../Unidad${N+1}/">Unidad ${N+1} →</a>`:'<span></span>'}</div>
  </main>`;
  state.v = state.v || {}; marks.v = marks.v || {};
  updateCount();
  $('#gradeBtn').addEventListener('click',grade);
  const keys=document.querySelector('.keys');
  keys.addEventListener('mousedown',e=>{ if(e.target.dataset.k) e.preventDefault(); });
  keys.addEventListener('click',e=>{
    const k=e.target.dataset.k; if(!k) return;
    const inp = focusedInput && document.body.contains(focusedInput) ? focusedInput : null;
    if(!inp) return;
    const s=inp.selectionStart??inp.value.length, en=inp.selectionEnd??s;
    inp.value=inp.value.slice(0,s)+k+inp.value.slice(en); inp.setSelectionRange(s+1,s+1); inp.focus();
    inp.dispatchEvent(new Event('input',{bubbles:true}));
  });
}
function exHTML(e,ei){
  return `<section class="ex" id="ex${ei}">
    <div class="ex-head"><h2>${e.title}</h2><span class="ex-score" id="sc${ei}"></span></div>
    <p class="instr">${e.instr}</p>
    <ol class="items">${e.items.map((it,ii)=>{
      const k=`${ei}-${ii}`; const [a,b]=it.q.split('___').map(fmtQ);
      const body = it.t==='text'
        ? `${a}<input type="text" id="in-${k}" data-k="${k}" autocomplete="off" autocapitalize="none" spellcheck="false" aria-label="${ii+1}번 답">${b||''}`
        : `${a}<span class="blank" id="bl-${k}"></span>${b||''}<div class="opts" role="radiogroup" aria-label="${ii+1}번 선택지">${it.o.map(o=>`<button type="button" role="radio" aria-checked="false" data-k="${k}" data-v="${o.replace(/"/g,'&quot;')}">${o}</button>`).join('')}</div>`;
      return `<li class="item" id="i-${k}"><span class="n">${ii+1}</span><div class="q">${body}</div><div class="fb" id="fb-${k}"></div></li>`;
    }).join('')}</ol></section>`;
}
function setPick(li,v){
  li.querySelector('.blank').textContent=v;
  li.querySelectorAll('.opts button').forEach(b=>b.setAttribute('aria-checked',b.dataset.v===v?'true':'false'));
}
function clearMark(k){
  delete marks.v[k]; const li=document.getElementById('i-'+k); if(!li) return;
  li.classList.remove('ok','bad','half'); document.getElementById('fb-'+k).innerHTML='';
}
function updateCount(){
  let a=0; U.ex.forEach((e,ei)=>e.items.forEach((it,ii)=>{ const v=state.v[`${ei}-${ii}`]; if(v!==undefined&&v!=='') a++; }));
  const el=$('#count'); if(el) el.textContent=`답한 문제 ${a} / ${total()}`; return a;
}
document.addEventListener('focusin',e=>{ if(e.target.matches && e.target.matches('.q input')) focusedInput=e.target; });
document.addEventListener('input',e=>{
  const t=e.target; if(!t.matches||!t.matches('.q input')) return;
  const k=t.dataset.k; state.v[k]=t.value; clearMark(k); updateCount();
});
document.addEventListener('click',e=>{
  const b=e.target.closest('.opts button'); if(!b) return;
  const k=b.dataset.k;
  state.v[k]=b.dataset.v; setPick(document.getElementById('i-'+k),b.dataset.v); clearMark(k); updateCount();
});
document.addEventListener('keydown',e=>{
  if(e.key==='Enter' && e.target.matches && e.target.matches('.q input')){
    const ins=[...document.querySelectorAll('.q input')]; const i=ins.indexOf(e.target); if(ins[i+1]) ins[i+1].focus();
  }
});

/* ---------- grading ---------- */
const strip = s => s.replace(/ñ/g,'\u0001').normalize('NFD').replace(/[̀-ͯ]/g,'');
const norm = s => s.toLowerCase().trim().replace(/\s+/g,' ').replace(/[.!?¡¿]+/g,'').replace(/\s*,\s*/g,', ').trim();
function judge(it,v){
  if(v===undefined||v==='') return 'none';
  if(it.t==='pick') return v===it.a?'ok':'bad';
  const x=norm(v);
  if(it.a.some(a=>norm(a)===x)) return 'ok';
  if(it.a.some(a=>strip(norm(a))===strip(x))) return 'half';
  return 'bad';
}
function showMark(ei,ii){
  const k=`${ei}-${ii}`, it=U.ex[ei].items[ii], m=marks.v[k], li=document.getElementById('i-'+k), fb=document.getElementById('fb-'+k);
  li.classList.remove('ok','bad','half'); if(!m) return; li.classList.add(m);
  const ans = it.t==='pick'?it.a:it.a.join(' / '); const rule = U.ex[ei].rule;
  const why = m==='half'?'':(it.why||(m!=='ok'?rule:''));
  const head = m==='ok'?'✔ 정답':m==='half'?`△ 악센트(´) 확인 · 정답 <b>${ans}</b> (0.5점)`:`✘ 오답 · 정답 <b>${ans}</b>`;
  fb.innerHTML = head + (why?`<span class="why">${why}</span>`:'');
}
function grade(){
  const res={ex:[],score:0,total:0,blank:0};
  U.ex.forEach((e,ei)=>{
    let s=0;
    e.items.forEach((it,ii)=>{
      const k=`${ei}-${ii}`, j=judge(it,state.v[k]);
      if(j==='none'){ marks.v[k]='bad'; res.blank++; } else marks.v[k]=j;
      if(j==='ok') s+=1; else if(j==='half') s+=.5;
      showMark(ei,ii);
      if(j==='none'){ document.getElementById('fb-'+k).innerHTML='✘ 미응답 · 정답 <b>'+(it.t==='pick'?it.a:it.a.join(' / '))+'</b>'+`<span class="why">${it.why||e.rule}</span>`; }
    });
    document.getElementById('sc'+ei).textContent=`${fmt(s)} / ${e.items.length}`;
    res.ex.push({title:e.title,s,t:e.items.length}); res.score+=s; res.total+=e.items.length;
  });
  lastResult=res;
  const pr=progress(); const old=pr['u'+N];
  if(!old||res.score>=old.score){ pr['u'+N]={score:res.score,total:res.total}; store.set(PKEY,pr); }
  renderResult(true);
}
function renderResult(scroll){
  const res=lastResult, pct=Math.round(res.score/res.total*100), name=(store.get(NKEY)||'').trim();
  const msg = pct>=90?['훌륭해요!','거의 완벽합니다. 다음 단원으로 넘어가도 좋아요.']:pct>=70?['잘했어요!','틀린 문제의 해설을 읽고 다시 도전해 보세요.']:pct>=50?['조금만 더!','문법 정리를 한 번 더 읽고 틀린 문제를 다시 풀어 보세요.']:['다시 도전해요','문법 정리를 천천히 읽고 예문을 소리 내어 따라 해 보세요.'];
  const R=54, C=2*Math.PI*R;
  const el=$('#result'); el.hidden=false;
  const nx = N<LAST?`<a class="btn ghost" style="text-decoration:none" href="../Unidad${N+1}/">다음 Unidad ${N+1} →</a>`:'';
  el.innerHTML=`
   <div class="r-top">
    <div class="ring"><svg viewBox="0 0 132 132" aria-hidden="true"><circle class="bg" cx="66" cy="66" r="${R}"/><circle class="fg" cx="66" cy="66" r="${R}" stroke-dasharray="${C*pct/100} ${C}"/></svg><b>${pct}%</b></div>
    <div class="r-txt"><div class="eyebrow">${name?name+' · ':''}UNIDAD ${N} 결과</div><h2>${fmt(res.score)} / ${res.total}점 · ${msg[0]}</h2><p>${msg[1]}</p>${res.blank?`<p>풀지 않은 문제가 ${res.blank}개 있어요. 오답으로 처리되었습니다.</p>`:''}</div>
   </div>
   <div class="brk">${res.ex.map(e=>`<div><span>${e.title}</span><span class="bar"><i style="width:${e.s/e.t*100}%"></i></span><span>${fmt(e.s)}/${e.t}</span></div>`).join('')}</div>
   <div class="r-act"><button class="btn" id="retryWrong">틀린 문제만 다시 풀기</button><button class="btn ghost" id="retryAll">처음부터 다시 풀기</button>${nx}</div>`;
  $('#retryWrong').onclick=()=>retry(false); $('#retryAll').onclick=()=>retry(true);
  if(scroll) el.scrollIntoView({behavior:'smooth',block:'center'});
}
function retry(all){
  U.ex.forEach((e,ei)=>e.items.forEach((it,ii)=>{
    const k=`${ei}-${ii}`, m=marks.v[k];
    if(all || m!=='ok'){
      delete state.v[k]; clearMark(k); const li=document.getElementById('i-'+k);
      if(it.t==='text') li.querySelector('input').value=''; else { li.querySelector('.blank').textContent=''; li.querySelectorAll('.opts button').forEach(b=>b.setAttribute('aria-checked','false')); }
    }
  }));
  U.ex.forEach((e,ei)=>{ $('#sc'+ei).textContent=''; });
  lastResult=null; $('#result').hidden=true; updateCount();
  const first=document.querySelector('li.item:not(.ok)'); if(first) first.scrollIntoView({behavior:'smooth',block:'center'}); else window.scrollTo({top:0,behavior:'smooth'});
}
chapter();
