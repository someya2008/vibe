/* ============================================================
   app.js  ── 画面の切り替え・進捗の保存・クイズエンジン
   ============================================================ */
(function(){
"use strict";
const $ = (s, el=document) => el.querySelector(s);
const app = $("#app");
const KEY = "gairon1review.v1";

/* ---------- 進捗（localStorage） ---------- */
const P = load();
function load(){
  try{ const j = JSON.parse(localStorage.getItem(KEY)||"{}"); return Object.assign({visited:{}, best:{}, finalBest:null, finals:0}, j); }
  catch(e){ return {visited:{}, best:{}, finalBest:null, finals:0}; }
}
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(P)); }catch(e){} updateTopProgress(); }
function visitedSet(ch){ return new Set(P.visited[ch]||[]); }
function markVisited(ch, i){ const s = visitedSet(ch); s.add(i); P.visited[ch]=[...s]; save(); }
function unmarkVisited(ch, i){ const s = visitedSet(ch); s.delete(i); P.visited[ch]=[...s]; save(); }
function chapterProgress(ch){
  const c = CHAPTERS.find(x=>x.id===ch); const n = c.sections.length;
  const v = visitedSet(ch).size; const quizDone = P.best[ch]!=null;
  return {pct: Math.round(100*(v + (quizDone?1:0))/(n+1)), read:v, total:n, quizDone, best:P.best[ch]};
}
function totalProgress(){
  let sum=0; CHAPTERS.forEach(c=>sum+=chapterProgress(c.id).pct);
  return Math.round(sum/CHAPTERS.length);
}
function updateTopProgress(){
  const t = totalProgress();
  $("#pprog").style.width = t+"%"; $("#pprog-label").textContent = t+"%";
}

/* ---------- バッジ ---------- */
const BADGES = [
  {id:"first", e:"🔰", name:"はじめの一歩", desc:"どれか1つのセクションを読んだ", test:()=>CHAPTERS.some(c=>visitedSet(c.id).size>0)},
  {id:"quiz1", e:"✅", name:"確認クイズ合格", desc:"章の確認クイズで80%以上", test:()=>CHAPTERS.some(c=>P.best[c.id]!=null && P.best[c.id].pct>=80)},
  {id:"perfect", e:"💯", name:"パーフェクト", desc:"章の確認クイズで全問正解", test:()=>CHAPTERS.some(c=>P.best[c.id]!=null && P.best[c.id].pct===100)},
  {id:"half", e:"🏃", name:"折り返し", desc:"全体の進みぐあい50%", test:()=>totalProgress()>=50},
  {id:"allread", e:"📚", name:"全章読破", desc:"6章すべてのセクションを読んだ", test:()=>CHAPTERS.every(c=>visitedSet(c.id).size>=c.sections.length)},
  {id:"final", e:"🎓", name:"総合テスト合格", desc:"総合テストで80%以上", test:()=>P.finalBest!=null && P.finalBest.pct>=80},
  {id:"master", e:"👑", name:"概論Ⅰマスター", desc:"進みぐあい100%かつ総合テスト90%以上", test:()=>totalProgress()===100 && P.finalBest!=null && P.finalBest.pct>=90},
];

/* ---------- ルーティング ---------- */
function setAccent(c){
  document.documentElement.style.setProperty("--accent", c ? `var(--c${c.no})` : "var(--c1)");
  document.documentElement.style.setProperty("--accent-soft", c ? `var(--c${c.no}s)` : "var(--c1s)");
}
function route(){
  const h = (location.hash||"#home").slice(1);
  const [name, arg] = h.split("/");
  window.scrollTo({top:0, behavior:"instant"});
  if(name==="ch"){ const c = CHAPTERS.find(x=>x.id===arg); if(c) return renderChapter(c); }
  if(name==="quiz"){ const c = CHAPTERS.find(x=>x.id===arg); if(c) return renderQuiz(c); }
  if(name==="final") return renderFinal();
  renderHome();
}
window.addEventListener("hashchange", route);

/* ---------- ホーム ---------- */
function renderHome(){
  setAccent(null);
  document.title = "コンピュータ概論Ⅰ ふりかえりラボ";
  const cards = CHAPTERS.map(c=>{
    const pr = chapterProgress(c.id);
    const badge = pr.quizDone && pr.best.pct===100 ? "💯" : pr.quizDone && pr.best.pct>=80 ? "✅" : "";
    return `<button class="chcard" style="--accent:var(--c${c.no});--accent-soft:var(--c${c.no}s)" data-go="#ch/${c.id}">
      <span class="badge">${badge}</span>
      <span class="icon">${ICONS[c.icon]}</span>
      <span class="no">CHAPTER ${c.no}</span>
      <h3>${c.title}</h3>
      <span class="muted small">${c.lead}</span>
      <span class="pbar"><i style="width:${pr.pct}%"></i></span>
      <span class="meta"><span>読んだ ${pr.read}/${pr.total}</span><span>${pr.quizDone ? "クイズ最高 "+pr.best.pct+"%" : "クイズ 未挑戦"}</span></span>
    </button>`;
  }).join("");
  const badges = BADGES.map(b=>`<div class="bdg ${b.test()?"":"locked"}" title="${b.desc}"><span class="e">${b.e}</span><span>${b.name}<br><span class="small muted" style="font-weight:400">${b.desc}</span></span></div>`).join("");
  const fb = P.finalBest;
  app.innerHTML = `<div class="view">
    <section class="hero">
      <div class="stack">
        <span class="eyebrow">コンピュータ概論Ⅱ 第1回</span>
        <h1>前期のまとめ<br>コンピュータ概論Ⅰ ふりかえりラボ</h1>
        <p class="lead">前期に学んだ6つの分野を、<b>アニメーションと体験コーナー</b>で思い出し、<b>クイズ</b>で自分の理解を確かめましょう。順番は自由です。気になる章から始めてください。</p>
        <div class="row">
          <a class="btn primary lg" href="#ch/hw">CHAPTER 1 から始める</a>
          <a class="btn lg" href="#final">いきなり総合テスト</a>
        </div>
        <p class="small muted">進みぐあいと最高得点は、このブラウザに自動保存されます。<button class="reset" id="resetAll">記録をすべて消す</button></p>
      </div>
      <div class="art">${ICONS.hero}</div>
    </section>
    <h2 style="margin-bottom:14px">6つの分野</h2>
    <div class="chapters">${cards}</div>
    <section class="final-cta">
      <div class="stack">
        <h2>🎓 総合テスト</h2>
        <p>6分野からランダムに ${FINAL_N} 問。前期のまとめとして、自分の弱いところを見つけましょう。${fb ? `<br>これまでの最高：<b style="color:#fff">${fb.pct}%</b>（${fb.score}/${fb.n} 問）・挑戦 ${P.finals} 回` : ""}</p>
      </div>
      <a class="btn lg" href="#final" style="background:#fff;color:#1d2b64;border-color:transparent">テストを始める</a>
    </section>
    <h2 style="margin-top:30px">実績</h2>
    <div class="badges">${badges}</div>
  </div>`;
  app.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click", ()=>location.hash=b.dataset.go));
  $("#resetAll").addEventListener("click", ()=>{
    if(confirm("学習の記録（読んだ印・最高得点・実績）をすべて消します。よろしいですか？")){
      P.visited={}; P.best={}; P.finalBest=null; P.finals=0; save(); renderHome();
    }
  });
  updateTopProgress();
}

/* ---------- 章 ---------- */
function renderChapter(c){
  setAccent(c);
  document.title = `${c.no}. ${c.title} ── 概論Ⅰ ふりかえりラボ`;
  const v = visitedSet(c.id);
  const nav = c.sections.map((s,i)=>`<a href="#s${i+1}" data-i="${i}" class="${v.has(i)?"done":""}">${c.no}-${i+1} ${s.short||s.title}</a>`).join("");
  const secs = c.sections.map((s,i)=>`<section class="sec" id="s${i+1}">
    <div class="card">
      <h2><span class="n">${c.no}-${i+1}</span>${s.title}</h2>
      ${s.html}
      ${s.widget ? `<div class="lab" data-widget="${s.widget}"><div class="lab-title">${s.labTitle||"体験してみよう"}</div><div class="lab-body"></div></div>` : ""}
      <div class="secfoot"><label class="check"><input type="checkbox" data-sec="${i}" ${v.has(i)?"checked":""}> 読んだ・理解した</label></div>
    </div>
  </section>`).join("");
  const pr = chapterProgress(c.id);
  const prev = CHAPTERS[c.no-2], next = CHAPTERS[c.no];
  app.innerHTML = `<div class="view">
    <a class="btn ghost sm" href="#home">← ホームへ</a>
    <div class="chhead" style="margin-top:10px">
      <span class="icon">${ICONS[c.icon]}</span>
      <div><span class="eyebrow">CHAPTER ${c.no}</span><h1>${c.title}</h1></div>
    </div>
    <p class="muted" style="max-width:46em">${c.intro}</p>
    <nav class="chnav" aria-label="この章の目次">${nav}</nav>
    ${secs}
    <div class="chend card">
      <span class="eyebrow">CHECK</span>
      <h2>確認クイズ（${c.quiz.length}問）</h2>
      <p class="muted">この章の内容から出題します。${pr.quizDone ? `これまでの最高：<b>${pr.best.pct}%</b>` : "まだ挑戦していません。"}</p>
      <a class="btn primary lg" href="#quiz/${c.id}">クイズに挑戦する</a>
      <div class="row" style="margin-top:8px">
        ${prev ? `<a class="btn sm" href="#ch/${prev.id}">← ${prev.no}. ${prev.title}</a>` : ""}
        ${next ? `<a class="btn sm" href="#ch/${next.id}">${next.no}. ${next.title} →</a>` : `<a class="btn sm" href="#final">総合テストへ →</a>`}
      </div>
    </div>
  </div>`;
  // 目次リンク：ハッシュを変えずにスクロール
  app.querySelectorAll(".chnav a").forEach(a=>a.addEventListener("click", e=>{
    e.preventDefault(); const t = $(a.getAttribute("href")); if(t) t.scrollIntoView({behavior:"smooth", block:"start"});
  }));
  // 読んだチェック
  app.querySelectorAll("input[data-sec]").forEach(cb=>cb.addEventListener("change", ()=>{
    const i = +cb.dataset.sec; if(cb.checked) markVisited(c.id,i); else unmarkVisited(c.id,i);
    const a = app.querySelector(`.chnav a[data-i="${i}"]`); a.classList.toggle("done", cb.checked);
  }));
  // 体験コーナーを初期化
  app.querySelectorAll("[data-widget]").forEach(el=>{
    const fn = WIDGETS[el.dataset.widget];
    if(fn){ try{ fn(el.querySelector(".lab-body"), c); }catch(err){ console.error(err); el.querySelector(".lab-body").innerHTML = `<p class="small muted">この体験コーナーを表示できませんでした。</p>`; } }
  });
  updateTopProgress();
}

/* ---------- クイズ ---------- */
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function renderQuiz(c){ setAccent(c); document.title = `確認クイズ：${c.title}`; runQuiz({title:`${c.no}. ${c.title} 確認クイズ`, qs: shuffle(c.quiz), back:`#ch/${c.id}`, backLabel:"章にもどる", onDone:(score,n)=>{
  const pct = Math.round(100*score/n); const b = P.best[c.id];
  if(!b || pct>b.pct) P.best[c.id] = {pct, score, n}; save();
}}); }
function renderFinal(){
  setAccent(null); document.title = "総合テスト ── 概論Ⅰ ふりかえりラボ";
  // 各章から均等に出題
  const per = Math.floor(FINAL_N/CHAPTERS.length); let qs=[];
  CHAPTERS.forEach(c=>{ qs = qs.concat(shuffle(c.quiz).slice(0,per).map(q=>Object.assign({ch:c}, q))); });
  const rest = FINAL_N - qs.length;
  if(rest>0){ const pool = shuffle(CHAPTERS.flatMap(c=>c.quiz.map(q=>Object.assign({ch:c},q)))).filter(q=>!qs.includes(q)); qs = qs.concat(pool.slice(0,rest)); }
  runQuiz({title:"総合テスト", qs: shuffle(qs), back:"#home", backLabel:"ホームへ", showChapter:true, onDone:(score,n)=>{
    const pct = Math.round(100*score/n); P.finals++;
    if(!P.finalBest || pct>P.finalBest.pct) P.finalBest = {pct, score, n}; save();
  }});
}
function runQuiz(o){
  const qs = o.qs; let i=0, score=0; const log=[];
  const shell = document.createElement("div"); shell.className="view quiz"; app.innerHTML=""; app.appendChild(shell);
  function showQ(){
    const q = qs[i];
    const opts = shuffle(q.a.map((t,k)=>({t, ok:k===0})));
    const chAccent = o.showChapter && q.ch ? `style="--accent:var(--c${q.ch.no});--accent-soft:var(--c${q.ch.no}s)"` : "";
    shell.innerHTML = `<div class="qhead"><a class="btn ghost sm" href="${o.back}">✕ やめる</a><span class="bar"><i style="width:${100*i/qs.length}%"></i></span><span class="num">${i+1} / ${qs.length}</span></div>
      <div class="card qcard" ${chAccent}>
        <div class="row"><span class="tag">${o.showChapter && q.ch ? "CH."+q.ch.no+" "+q.ch.title : o.title}</span>${q.tag?`<span class="pill">${q.tag}</span>`:""}</div>
        <p class="qtext">${q.q}</p>
        <div class="opts">${opts.map((op,k)=>`<button class="opt" data-ok="${op.ok?1:0}"><span class="k">${"ABCD"[k]}</span><span>${op.t}</span></button>`).join("")}</div>
        <div id="expl"></div>
        <p class="small muted">キーボード：<kbd>A</kbd>〜<kbd>D</kbd> または <kbd>1</kbd>〜<kbd>4</kbd> で回答、<kbd>Enter</kbd> で次へ</p>
      </div>`;
    const btns = [...shell.querySelectorAll(".opt")];
    btns.forEach(b=>b.addEventListener("click", ()=>answer(b)));
    function answer(b){
      if(btns[0].disabled) return;
      const ok = b.dataset.ok==="1"; if(ok) score++;
      btns.forEach(x=>{ x.disabled=true; if(x.dataset.ok==="1") x.classList.add("correct"); });
      if(!ok) b.classList.add("wrong");
      log.push({q, ok, chosen:b.querySelector("span:last-child").textContent});
      $("#expl", shell).innerHTML = `<div class="expl ${ok?"ok":"ng"}"><div class="verdict">${ok?"⭕ 正解！":"❌ ざんねん"}</div><div>${!ok?`<b>正解：</b>${q.a[0]}<br>`:""}${q.e}</div>
        <div class="row"><button class="btn primary" id="next">${i+1<qs.length?"次の問題 →":"結果を見る"}</button></div></div>`;
      $("#next", shell).addEventListener("click", next); $("#next", shell).focus();
    }
    shell._key = (e)=>{
      if(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA") return;
      const k = e.key.toUpperCase();
      if(!btns[0].disabled){ const idx = "ABCD".indexOf(k)>=0 ? "ABCD".indexOf(k) : "1234".indexOf(k); if(idx>=0 && btns[idx]) answer(btns[idx]); }
      else if(e.key==="Enter"){ e.preventDefault(); next(); }
    };
  }
  function next(){ i++; if(i<qs.length) showQ(); else finish(); }
  function finish(){
    const n = qs.length, pct = Math.round(100*score/n);
    o.onDone(score,n);
    const msg = pct===100 ? "完璧です！前期の内容をしっかり覚えていますね。" : pct>=80 ? "よくできました。まちがえた問題の解説をもう一度読んでおきましょう。" : pct>=60 ? "あと少し。まちがえた分野の章を読み直してから、もう一度挑戦しましょう。" : "まずは各章の体験コーナーで、しくみを動かして理解するところから始めましょう。";
    const r = 62, circ = 2*Math.PI*r;
    shell.innerHTML = `<div class="card result">
      <span class="eyebrow">RESULT</span>
      <svg class="ring" viewBox="0 0 150 150"><circle cx="75" cy="75" r="${r}" fill="none" stroke="var(--bg2)" stroke-width="14"/><circle cx="75" cy="75" r="${r}" fill="none" stroke="var(--accent)" stroke-width="14" stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${circ}" transform="rotate(-90 75 75)" style="transition:stroke-dashoffset 1s ease .2s" id="ring"/><text x="75" y="84" text-anchor="middle" font-family="var(--display)" font-weight="900" font-size="30" fill="var(--accent)">${pct}%</text></svg>
      <div class="score">${score}<small> / ${n} 問</small></div>
      <p>${msg}</p>
      <div class="row"><button class="btn primary" id="again">もう一度</button><a class="btn" href="${o.back}">${o.backLabel}</a></div>
      <h3 style="margin-top:10px">ふりかえり</h3>
      <div class="review">${log.map((l,k)=>`<div class="item ${l.ok?"ok":"ng"}"><div><b>${l.ok?"⭕":"❌"} Q${k+1}.</b> ${l.q.q}</div><div class="small"><b>正解：</b>${l.q.a[0]}${!l.ok?` ／ <span class="muted">あなたの答え：${l.chosen}</span>`:""}</div><div class="small muted">${l.q.e}</div>${o.showChapter&&l.q.ch?`<div><a class="small" href="#ch/${l.q.ch.id}">→ CH.${l.q.ch.no} ${l.q.ch.title} を読み直す</a></div>`:""}</div>`).join("")}</div>
    </div>`;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{ $("#ring",shell).style.strokeDashoffset = circ*(1-pct/100); }));
    $("#again", shell).addEventListener("click", ()=>route());
    shell._key = null;
    if(pct>=80) confetti();
    updateTopProgress();
  }
  document.onkeydown = (e)=>{ if(shell.isConnected && shell._key) shell._key(e); };
  showQ();
}
function confetti(){
  const box = document.createElement("div"); box.className="confetti";
  const cols = ["#3b7be9","#8b5cf6","#f0a020","#22a36b","#0e9fb0","#e5567a"];
  for(let k=0;k<90;k++){ const i=document.createElement("i"); i.style.left=Math.random()*100+"vw"; i.style.background=cols[k%cols.length]; i.style.animationDelay=(Math.random()*.8)+"s"; i.style.transform=`rotate(${Math.random()*360}deg)`; box.appendChild(i); }
  document.body.appendChild(box); setTimeout(()=>box.remove(), 3600);
}

route();
})();
