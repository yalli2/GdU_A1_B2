/* Main page — Gramática de uso A1–B2 */
const PKEY = 'gdu-a1b2-progress', NKEY = 'gdu-name';
const $ = s => document.querySelector(s);
const store = {
  get(k){ try{ return JSON.parse(localStorage.getItem(k)); }catch(e){ return null; } },
  set(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
};
const fmt = n => (Math.round(n*10)/10).toString();
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
let query = '', only = 'all';

function render(){
  const pr = store.get(PKEY) || {}; const name = store.get(NKEY) || '';
  const done = UNITS.filter(u=>pr['u'+u.id]).length;
  const sc = UNITS.reduce((a,u)=>a+(pr['u'+u.id]?pr['u'+u.id].score:0),0);
  const tt = UNITS.reduce((a,u)=>a+(pr['u'+u.id]?pr['u'+u.id].total:0),0);
  const totalQ = UNITS.reduce((a,u)=>a+u.n,0);
  const avg = tt? Math.round(sc/tt*100):0;
  $('#app').innerHTML = `
  <header class="wrap hero">
    <div class="eyebrow">Gramática de uso del español · A1–B2 · Unidades 1–${UNITS.length}</div>
    <h1>Gramática <em>en Clase</em></h1>
    <p>교재 1과부터 마지막 과(126과)까지 핵심 문법을 정리하고, 과마다 연습문제를 풀어 바로 점수와 정답을 확인하는 스페인어 학습 사이트입니다. 국제학교 스페인어 수업용.</p>
    <div class="who">
      <label for="stu">이름</label><input id="stu" type="text" placeholder="이름을 입력하세요" value="${esc(name)}" autocomplete="off">
      <div class="overall"><span>학습 진도 ${done} / ${UNITS.length}</span><div class="bar"><i style="width:${done/UNITS.length*100}%"></i></div></div>
    </div>
    <div class="stat"><div><b>${UNITS.length}</b><span>Unidades</span></div><div><b>${totalQ}</b><span>연습문제</span></div><div><b>${done?avg+'%':'–'}</b><span>내 평균 정답률</span></div></div>
  </header>
  <main class="wrap">
    <ol class="steps"><li><b>문법 정리</b>를 읽고 예문을 눌러 발음을 들어요.</li><li><b>연습문제</b>를 풀어요. 악센트 입력 버튼이 있어요.</li><li><b>채점하기</b>로 점수와 정답, 해설을 확인하고 틀린 문제만 다시 풀어요.</li></ol>
    <div class="tools">
      <input type="search" id="q" placeholder="단원 검색 (예: ser, 과거, 접속법, 12)" value="${esc(query)}" aria-label="단원 검색">
      <button type="button" data-f="all" aria-pressed="${only==='all'}">전체</button>
      <button type="button" data-f="todo" aria-pressed="${only==='todo'}">아직 안 푼 단원</button>
      <button type="button" data-f="done" aria-pressed="${only==='done'}">푼 단원</button>
    </div>
    <div id="list"></div>
    <footer class="site">교재: Gramática de uso del español. Teoría y práctica, Nivel A1–B2 (L. Aragonés, R. Palencia, SM). 단원 구성은 교재의 목차를 따르며, 문법 정리와 연습문제는 수업용으로 새로 구성했습니다.</footer>
  </main>`;
  $('#stu').addEventListener('input',e=>store.set(NKEY,e.target.value));
  $('#q').addEventListener('input',e=>{ query=e.target.value; list(); });
  document.querySelectorAll('.tools button').forEach(b=>b.addEventListener('click',()=>{
    only=b.dataset.f; document.querySelectorAll('.tools button').forEach(x=>x.setAttribute('aria-pressed',x===b)); list();
  }));
  list();
}
function list(){
  const pr = store.get(PKEY) || {};
  const q = query.trim().toLowerCase();
  let html = '', shown = 0;
  GROUPS.forEach(g=>{
    const us = UNITS.filter(u=>u.id>=g.from && u.id<=g.to).filter(u=>{
      const p = pr['u'+u.id];
      if(only==='todo' && p) return false;
      if(only==='done' && !p) return false;
      if(!q) return true;
      return (u.id+' '+u.es+' '+u.ko+' '+u.desc+' '+g.name).toLowerCase().includes(q) || String(u.id)===q;
    });
    if(!us.length) return;
    shown += us.length;
    html += `<div class="grp"><h2>${g.name}</h2><span>Unidad ${g.from}–${g.to}</span></div><div class="grid g2">${us.map(u=>{
      const p = pr['u'+u.id];
      return `<a class="card${p?' done':''}" href="Unidad${u.id}/">
        <div class="no">${u.id}</div>
        <h2>${esc(u.es)}</h2>
        <div class="ko">${esc(u.ko)}</div>
        <div class="desc">${esc(u.desc)}</div>
        <div class="bar"><i style="width:${p?p.score/p.total*100:0}%"></i></div>
        <div class="meta"><span>${u.n}문제</span><span>${p?`최고 ${fmt(p.score)} / ${p.total}점`:'아직 풀지 않음'}</span></div>
        <span class="go">학습하기 →</span>
      </a>`;}).join('')}</div>`;
  });
  $('#list').innerHTML = html || '<p class="tip" style="padding:24px 0">조건에 맞는 단원이 없습니다.</p>';
}
render();
