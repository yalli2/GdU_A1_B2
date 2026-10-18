/* Language selector (top-right) + Google Translate engine. Spanish text is protected from translation. */
(function(){
  var KEY='gdu-lang', SRC='ko';
  var COMMON=[['ko','한국어 (원문)'],['en','English'],['ja','日本語'],['zh-CN','中文(简体)'],['zh-TW','中文(繁體)'],['es','Español'],['fr','Français'],['de','Deutsch'],['ru','Русский'],['pt','Português'],['it','Italiano'],['ar','العربية'],['hi','हिन्दी'],['vi','Tiếng Việt'],['th','ไทย'],['id','Bahasa Indonesia'],['mn','Монгол'],['tr','Türkçe']];
  var MORE=[['af','Afrikaans'],['sq','Shqip'],['am','አማርኛ'],['hy','Հայերեն'],['az','Azərbaycan'],['eu','Euskara'],['be','Беларуская'],['bn','বাংলা'],['bs','Bosanski'],['bg','Български'],['ca','Català'],['ceb','Cebuano'],['ny','Chichewa'],['co','Corsu'],['hr','Hrvatski'],['cs','Čeština'],['da','Dansk'],['nl','Nederlands'],['eo','Esperanto'],['et','Eesti'],['tl','Filipino'],['fi','Suomi'],['fy','Frysk'],['gl','Galego'],['ka','ქართული'],['el','Ελληνικά'],['gu','ગુજરાતી'],['ht','Kreyòl ayisyen'],['ha','Hausa'],['haw','ʻŌlelo Hawaiʻi'],['he','עברית'],['hmn','Hmong'],['hu','Magyar'],['is','Íslenska'],['ig','Igbo'],['ga','Gaeilge'],['jv','Basa Jawa'],['kn','ಕನ್ನಡ'],['kk','Қазақша'],['km','ខ្មែរ'],['rw','Kinyarwanda'],['ku','Kurdî'],['ky','Кыргызча'],['lo','ລາວ'],['la','Latina'],['lv','Latviešu'],['lt','Lietuvių'],['lb','Lëtzebuergesch'],['mk','Македонски'],['mg','Malagasy'],['ms','Bahasa Melayu'],['ml','മലയാളം'],['mt','Malti'],['mi','Māori'],['mr','मराठी'],['my','မြန်မာ'],['ne','नेपाली'],['no','Norsk'],['or','ଓଡ଼ିଆ'],['ps','پښتو'],['fa','فارسی'],['pl','Polski'],['pa','ਪੰਜਾਬੀ'],['ro','Română'],['sm','Gagana Samoa'],['gd','Gàidhlig'],['sr','Српски'],['st','Sesotho'],['sn','Shona'],['sd','سنڌي'],['si','සිංහල'],['sk','Slovenčina'],['sl','Slovenščina'],['so','Soomaali'],['su','Basa Sunda'],['sw','Kiswahili'],['sv','Svenska'],['tg','Тоҷикӣ'],['ta','தமிழ்'],['tt','Татарча'],['te','తెలుగు'],['tk','Türkmen'],['uk','Українська'],['ur','اردو'],['ug','ئۇيغۇرچە'],['uz','Oʻzbek'],['cy','Cymraeg'],['xh','isiXhosa'],['yi','ייִדיש'],['yo','Yorùbá'],['zu','isiZulu']];
  var all={}; COMMON.concat(MORE).forEach(function(x){all[x[0]]=1});

  function get(){try{return localStorage.getItem(KEY)||SRC}catch(e){return SRC}}
  function put(v){try{localStorage.setItem(KEY,v)}catch(e){}}
  function setCookie(v){
    var val=v===SRC?'':'/'+SRC+'/'+v, h=location.hostname;
    var exp=v===SRC?';expires=Thu, 01 Jan 1970 00:00:00 GMT':'';
    document.cookie='googtrans='+val+';path=/'+exp;
    if(h.indexOf('.')>0) document.cookie='googtrans='+val+';path=/;domain='+h+exp;
  }

  /* ---- CSS ---- */
  var st=document.createElement('style');
  st.textContent=
   '.langsel{display:inline-flex;align-items:center;gap:6px;font-size:.88rem;margin-left:auto}'+
   '.langsel select{font:inherit;font-weight:600;max-width:150px;padding:6px 8px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--ink);cursor:pointer}'+
   '.langsel.float{position:absolute;top:10px;right:16px;z-index:25}'+
   '.sb-row .langsel{margin-left:0}'+
   '#google_translate_element{position:absolute;left:-9999px;top:0;height:0;overflow:hidden}'+
   '.skiptranslate iframe,.goog-te-banner-frame{display:none!important}'+
   'body{top:0!important}.goog-tooltip,.goog-tooltip:hover{display:none!important}'+
   '.goog-text-highlight{background:none!important;box-shadow:none!important}'+
   '@media(max-width:560px){.langsel select{max-width:110px}.langsel .lg{display:none}}';
  document.head.appendChild(st);

  /* ---- selector UI ---- */
  var box=document.createElement('div'); box.className='langsel notranslate'; box.setAttribute('translate','no');
  var sel=document.createElement('select'); sel.setAttribute('aria-label','Language / 언어 선택'); sel.id='langSelect';
  function grp(label,list){var g=document.createElement('optgroup');g.label=label;list.forEach(function(x){var o=document.createElement('option');o.value=x[0];o.textContent=x[1];g.appendChild(o)});sel.appendChild(g)}
  grp('Popular',COMMON); grp('All languages',MORE);
  box.innerHTML='<span class="lg" aria-hidden="true">🌐</span>'; box.appendChild(sel);
  var cur=get(); if(!all[cur]) cur=SRC; sel.value=cur;

  function place(){
    var row=document.querySelector('.sb-row');
    if(row){ if(box.parentNode!==row){box.classList.remove('float');row.appendChild(box)} return; }
    if(box.parentNode!==document.body||!box.classList.contains('float')){
      box.classList.add('float'); document.body.style.position='relative'; document.body.appendChild(box);
    }
  }

  /* ---- Google Translate ---- */
  var loaded=false;
  function loadGT(){
    if(loaded) return; loaded=true;
    var d=document.createElement('div'); d.id='google_translate_element'; document.body.appendChild(d);
    window.gtInit=function(){
      new google.translate.TranslateElement({pageLanguage:SRC,autoDisplay:false,layout:google.translate.TranslateElement.InlineLayout.SIMPLE},'google_translate_element');
    };
    var s=document.createElement('script'); s.src='https://translate.google.com/translate_a/element.js?cb=gtInit'; s.async=true;
    s.onerror=function(){loaded=false}; document.head.appendChild(s);
  }
  function applyCombo(v,tries){
    var c=document.querySelector('select.goog-te-combo');
    if(!c){ if(tries<60) setTimeout(function(){applyCombo(v,tries+1)},250); return; }
    c.value=v; c.dispatchEvent(new Event('change'));
  }
  sel.addEventListener('change',function(){
    var v=sel.value, prev=get(); put(v); setCookie(v);
    if(v===SRC){ if(prev!==SRC) location.reload(); return; }
    loadGT(); applyCombo(v,0);
  });

  /* ---- keep Spanish/Latin text untranslated ---- */
  var LAT=/[A-Za-zÀ-ɏ]/;
  function skip(n){
    for(var p=n.parentNode;p&&p!==document.body;p=p.parentNode){
      var t=p.nodeName;
      if(t==='FONT'||t==='SCRIPT'||t==='STYLE'||t==='TEXTAREA'||t==='OPTION'||t==='SELECT'||t==='CODE') return true;
      if(p.getAttribute&&(p.getAttribute('translate')==='no'||(p.classList&&p.classList.contains('notranslate')))) return true;
    }
    return false;
  }
  function protect(root){
    var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null), list=[], n;
    while((n=w.nextNode())){ if(LAT.test(n.nodeValue)&&!skip(n)) list.push(n); }
    list.forEach(function(t){
      var parts=t.nodeValue.split(/([가-힣ㄱ-ㅎ]+)/), hasLat=false, frag=document.createDocumentFragment();
      parts.forEach(function(p,i){
        if(!p) return;
        if(i%2===1||!LAT.test(p)){ frag.appendChild(document.createTextNode(p)); }
        else{ var s=document.createElement('span'); s.setAttribute('translate','no'); s.className='notranslate'; s.textContent=p; frag.appendChild(s); hasLat=true; }
      });
      if(hasLat&&t.parentNode) t.parentNode.replaceChild(frag,t);
    });
  }
  var timer=null;
  function tick(){ place(); protect(document.body); }
  new MutationObserver(function(){ clearTimeout(timer); timer=setTimeout(tick,120); })
    .observe(document.body,{childList:true,subtree:true});

  tick();
  if(cur!==SRC){ setCookie(cur); loadGT(); }
})();
