/* ============================================================
   widgets.js ── 体験コーナー
   WIDGETS[名前] = function(容器要素, 章データ)
   ============================================================ */
const WIDGETS = {};
(function(){
"use strict";
const h = (tag, attrs={}, ...kids)=>{ const el=document.createElement(tag); for(const k in attrs){ if(k==="class") el.className=attrs[k]; else if(k==="html") el.innerHTML=attrs[k]; else if(k.startsWith("on")) el.addEventListener(k.slice(2), attrs[k]); else el.setAttribute(k, attrs[k]); } kids.flat().forEach(c=>{ if(c!=null) el.append(c); }); return el; };
const shuffle = a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const fmt = n=>n.toLocaleString("ja-JP");
const sleep = ms=>new Promise(r=>setTimeout(r,ms));

/* ---------- 汎用：マッチングゲーム ---------- */
function matching(el, pairs, labels){
  const left = shuffle(pairs.map((p,i)=>({t:p[0], i}))), right = shuffle(pairs.map((p,i)=>({t:p[1], i})));
  let selL=null, selR=null, done=0;
  const status = h("div",{class:"status"});
  const mk = (list, side)=> h("div",{class:"col"}, ...list.map(o=>h("button",{class:"mbtn", "data-i":o.i, onclick:(e)=>pick(side, e.currentTarget)}, o.t)));
  const L = mk(left,"L"), R = mk(right,"R");
  function pick(side, btn){
    if(btn.classList.contains("done")) return;
    if(side==="L"){ L.querySelectorAll(".mbtn").forEach(b=>b.classList.remove("on")); btn.classList.add("on"); selL=btn; }
    else { R.querySelectorAll(".mbtn").forEach(b=>b.classList.remove("on")); btn.classList.add("on"); selR=btn; }
    if(selL && selR){
      if(selL.dataset.i===selR.dataset.i){ selL.classList.add("done"); selR.classList.add("done"); selL.classList.remove("on"); selR.classList.remove("on"); done++; status.textContent = done===pairs.length ? "🎉 全部そろいました！" : `✓ 正解（${done}/${pairs.length}）`; status.className="status ok"; }
      else { selL.classList.add("shake"); selR.classList.add("shake"); setTimeout(()=>{selL.classList.remove("shake","on"); selR.classList.remove("shake","on");},350); status.textContent="✗ ちがう組み合わせです"; status.className="status ng"; }
      selL=selR=null;
    }
  }
  el.append(h("p",{class:"small muted"}, labels||"左と右から1つずつ選んで、正しい組み合わせを作ろう。"), h("div",{class:"matchgrid"}, L, R), status);
}

WIDGETS._matching = matching;

/* ============================================================ 1-1 五大装置 */
WIDGETS.fiveUnits = function(el){
  const svg = el.closest(".card").querySelector("#fig5"); if(!svg) return;
  const dot = svg.querySelector("#dot");
  const units = ["u-in","u-mem","u-ctrl","u-alu","u-out","u-aux"];
  const P = { in:[90,205], inR:[160,205], memL:[218,205], memT1:[300,178], aluB1:[300,134], ctrl:[300,90], aluB2:[340,134], memT2:[340,178], memR:[422,205], out:[478,205], outC:[550,205] };
  const steps = [
    {t:"① キーボードから「3＋5」と入力する。入力装置は、これを主記憶装置に送る。", hl:["u-in","u-mem"], move:[P.in,P.memL], label:"3+5"},
    {t:"② 制御装置が、主記憶からプログラムの命令「3 と 5 を足せ」を取り出して解読する（フェッチ・デコード）。", hl:["u-ctrl","u-mem"], move:[[262,178],[262,70]], label:"命令", lp:"left"},
    {t:"③ 制御装置の指示で、演算装置が 3＋5 を計算する。", hl:["u-alu","u-ctrl"], move:[[262,96],[262,114]], label:"3+5=8", lp:"left"},
    {t:"④ 計算結果 8 を主記憶装置に書き戻す。", hl:["u-alu","u-mem"], move:[P.aluB2,P.memT2], label:"8"},
    {t:"⑤ 制御装置の指示で、主記憶の結果をディスプレイ（出力装置）に表示する。", hl:["u-out","u-mem","u-ctrl"], move:[P.memR,P.outC], label:"8"},
  ];
  let i=-1, playing=false;
  const msg = h("div",{class:"point", html:"<b>▶ を押すと、「3＋5」の計算がどう流れるかを1ステップずつ見られます。</b>"});
  const label = document.createElementNS("http://www.w3.org/2000/svg","text"); label.setAttribute("font-size","13"); label.setAttribute("fill","#1c2333"); label.setAttribute("text-anchor","middle"); label.setAttribute("font-weight","700"); svg.append(label);
  function hl(ids){ units.forEach(u=>{ const r=svg.querySelector("#"+u+" rect"); r.style.strokeWidth = ids.includes(u)?"4":"2"; r.style.filter = ids.includes(u)?"drop-shadow(0 0 6px rgba(59,123,233,.6))":""; }); }
  async function moveDot(a,b,text,lp){
    dot.setAttribute("opacity","1"); label.textContent=text; label.setAttribute("text-anchor", lp==="left"?"end":"middle"); const t0=performance.now(), dur=900;
    await new Promise(res=>{ (function f(now){ const k=Math.min(1,(now-t0)/dur), e=k<.5?2*k*k:-1+(4-2*k)*k; const x=a[0]+(b[0]-a[0])*e, y=a[1]+(b[1]-a[1])*e; dot.setAttribute("cx",x); dot.setAttribute("cy",y); label.setAttribute("x", lp==="left"?x-13:x); label.setAttribute("y", lp==="left"?y+5:y-14); if(k<1) requestAnimationFrame(f); else res(); })(t0); });
  }
  async function step(){
    if(playing) return; playing=true;
    i=(i+1)%steps.length; const s=steps[i];
    hl(s.hl); msg.innerHTML=`<b>ステップ ${i+1} / ${steps.length}</b><span>${s.t}</span>`;
    await moveDot(s.move[0], s.move[1], s.label, s.lp);
    playing=false; if(i===steps.length-1){ msg.innerHTML+=`<span class="small muted">ここまでが「入力→記憶→演算→記憶→出力」の1サイクル。制御装置（赤い点線）が全体に指示を出していることに注目。</span>`; }
  }
  async function auto(){ if(playing) return; for(let k=0;k<steps.length;k++){ await step(); await sleep(700); } }
  el.append(h("div",{class:"row"}, h("button",{class:"btn primary", onclick:step},"▶ 次のステップ"), h("button",{class:"btn", onclick:auto},"⏩ 自動で最後まで"), h("button",{class:"btn sm", onclick:()=>{i=-1; hl([]); dot.setAttribute("opacity","0"); label.textContent=""; msg.innerHTML="<b>▶ を押すと、「3＋5」の計算がどう流れるかを1ステップずつ見られます。</b>";}},"リセット")), msg);
};

/* ============================================================ 1-2 クロック */
WIDGETS.clock = function(el){
  const range = h("input",{type:"range", min:"1", max:"5", step:"0.5", value:"3"});
  const led = h("span",{style:"display:inline-block;width:22px;height:22px;border-radius:50%;background:#dde3ef;transition:background .05s;vertical-align:middle;margin-right:8px"});
  const info = h("div",{class:"readout"});
  const bars = [ {name:"CPU A（2 GHz）", ghz:2}, {name:"CPU B", ghz:3} ];
  const race = h("div",{class:"cmp"});
  const raceBtn = h("button",{class:"btn primary", onclick:startRace},"🏁 100 個の命令を同時に処理させる");
  const note = h("p",{class:"small muted"}, "※ 同じ設計の CPU で、1 クロックに 1 命令ずつ処理すると仮定した「イメージ」です。実際の CPU は設計によって 1 クロックあたりの仕事量が異なります。");
  function upd(){ const g=+range.value; bars[1].ghz=g; info.innerHTML=`クロック周波数 <b>${g} GHz</b> ＝ 1 秒間に <b>${fmt(g*1e9)}</b> 回<br>1 クロックの長さ ＝ 1 ÷ (${g}×10<span class="hl">⁹</span>) 秒 ≒ <b>${(1000/g).toFixed(0)} ピコ秒</b>（${(1/g).toFixed(2)} ナノ秒）`; renderRace(0,0); }
  function renderRace(pa,pb){ race.innerHTML=""; bars.forEach((b,k)=>{ const p=k===0?pa:pb; race.append(h("div",{class:"bar"}, h("span",{}, k===0?b.name:`CPU B（${b.ghz} GHz）`), h("span",{style:"background:var(--bg2);border-radius:6px;overflow:hidden"}, h("i",{style:`transform:scaleX(${p});background:${k===0?"#9fb0c8":"var(--accent)"}`})), h("span",{class:"num"}, `${Math.round(p*100)} 命令`))); }); }
  let raf=null;
  function startRace(){ if(raf) cancelAnimationFrame(raf); const t0=performance.now(); const base=3000; // 2GHz が 3 秒で完了
    (function f(now){ const s=(now-t0)/base; const pa=Math.min(1,s*bars[0].ghz/2), pb=Math.min(1,s*bars[1].ghz/2); renderRace(pa,pb); if(pa<1||pb<1) raf=requestAnimationFrame(f); else raf=null; })(t0); }
  // LED の点滅（見やすいよう周波数は 1/10億に落としてある）
  let on=false; (function blink(){ if(!el.isConnected) return; on=!on; led.style.background = on ? "var(--accent)" : "#dde3ef"; setTimeout(blink, 500/(+range.value)); })();
  range.addEventListener("input", upd); upd();
  el.append(h("div",{class:"row"}, led, h("span",{class:"small muted"},"クロック信号のイメージ（実際の 10 億分の 1 の速さ）")), h("label",{}, "CPU B のクロック周波数：", range), info, raceBtn, race, note);
};

/* ============================================================ 1-3 記憶階層 */
WIDGETS.memHier = function(el){
  const items = [ {n:"レジスタ", t:0.3e-9, note:"CPU の中。ほぼ 1 クロック"}, {n:"キャッシュ（SRAM）", t:3e-9, note:"CPU のすぐそば"}, {n:"主記憶（DRAM）", t:80e-9, note:"メインメモリ"}, {n:"SSD", t:100e-6, note:"フラッシュメモリ"}, {n:"HDD", t:10e-3, note:"ヘッド移動＋回転待ち"} ];
  const mode = h("div",{class:"seg"});
  const box = h("div",{class:"cmp"});
  const note = h("p",{class:"small muted"},"※ 値はおよその目安（機種によって大きく異なります）。桁のちがいを感じるための図です。");
  function human(sec){ if(sec<60) return `${sec.toFixed(sec<10?1:0)} 秒`; if(sec<3600) return `${(sec/60).toFixed(0)} 分`; if(sec<86400) return `${(sec/3600).toFixed(0)} 時間`; if(sec<86400*365) return `${(sec/86400).toFixed(0)} 日`; return `${(sec/86400/365).toFixed(1)} 年`; }
  function show(m){
    box.innerHTML=""; const max=Math.log10(items[4].t/items[0].t);
    items.forEach((it,k)=>{ const ratio=it.t/items[0].t; const w=Math.max(.02, Math.log10(ratio)/max); const label = m==="real" ? (it.t>=1e-3?`${(it.t*1e3).toFixed(0)} ms`: it.t>=1e-6?`${(it.t*1e6).toFixed(0)} μs`:`${(it.t*1e9).toFixed(1)} ns`) : human(ratio);
      box.append(h("div",{class:"bar"}, h("span",{}, it.n), h("span",{style:"background:var(--bg2);border-radius:6px;overflow:hidden"}, h("i",{style:`transform:scaleX(0);background:hsl(${215-k*40} 70% 55%)`})), h("span",{class:"num"}, label))); });
    requestAnimationFrame(()=>requestAnimationFrame(()=>box.querySelectorAll("i").forEach((i,k)=>{ const ratio=items[k].t/items[0].t; i.style.transform=`scaleX(${Math.max(.02, Math.log10(ratio)/max)})`; })));
  }
  const b1=h("button",{class:"on", onclick:()=>{sel(b1); show("real");}},"実際の時間"), b2=h("button",{onclick:()=>{sel(b2); show("human");}},"レジスタを「1秒」とすると");
  function sel(b){ [b1,b2].forEach(x=>x.classList.toggle("on",x===b)); }
  mode.append(b1,b2); show("real");
  el.append(mode, box, h("p",{class:"small"},"棒の長さは対数目盛（1 目盛で 10 倍）。「レジスタを 1 秒とすると」に切りかえると、HDD から読むのが<b>約 1 年</b>に相当することが分かります。だからキャッシュや主記憶で「よく使うデータを近くに置く」工夫が必要なのです。"), note);
};

/* ============================================================ 1-5 仕分け */
WIDGETS.sorter = function(el){
  const bins = [["in","入力装置"],["out","出力装置"],["mem","記憶装置"],["cpu","演算・制御"]];
  const items = shuffle([ ["キーボード","in"],["マウス","in"],["スキャナ","in"],["マイク","in"],["Web カメラ","in"],["タッチパネル","in","指の位置を読み取るセンサなので入力装置。表示部分（ディスプレイ）は出力装置"],["ディスプレイ","out"],["プリンタ","out"],["スピーカ","out"],["プロジェクタ","out"],["SSD","mem"],["HDD","mem"],["メインメモリ（DRAM）","mem","主記憶装置。記憶装置の仲間"],["USB メモリ","mem"],["CPU","cpu","演算装置と制御装置を合わせたもの"] ]);
  let i=0, ok=0; const card=h("div",{class:"item"}), status=h("div",{class:"status"}), score=h("div",{class:"scoreline"});
  const binBox=h("div",{class:"bins"}, ...bins.map(b=>h("button",{class:"btn", onclick:()=>answer(b[0])}, b[1])));
  function show(){ if(i>=items.length){ card.textContent=`おわり！ ${ok} / ${items.length} 問正解`; binBox.style.display="none"; el.append(h("button",{class:"btn primary", onclick:()=>{ i=0; ok=0; binBox.style.display=""; el.lastChild.remove(); items.splice(0,items.length,...shuffle(items)); status.textContent=""; show(); }},"もう一度")); return; } card.textContent=items[i][0]; score.textContent=`${i+1} / ${items.length}　正解 ${ok}`; }
  function answer(b){ if(i>=items.length) return; const it=items[i]; const right=it[1]===b; if(right) ok++; status.className="status "+(right?"ok":"ng"); status.textContent=(right?"⭕ 正解":"❌ 正解は「"+bins.find(x=>x[0]===it[1])[1]+"」")+(it[2]?"：" + it[2]:""); i++; show(); }
  el.append(h("div",{class:"sorter"}, score, card, binBox, status)); show();
};

/* ============================================================ 2-1 ビットスイッチ */
WIDGETS.bits = function(el){
  let bits=[0,0,0,0,0,0,0,0], signed=false, target=null;
  const sw=h("div",{class:"switches"}), vals=h("div",{class:"bigval"}), msg=h("div",{class:"status"});
  const seg=h("div",{class:"seg"}); const bu=h("button",{class:"on", onclick:()=>{signed=false; sel(); render();}},"符号なし（0〜255）"), bs=h("button",{onclick:()=>{signed=true; sel(); render();}},"2の補数（−128〜127）"); seg.append(bu,bs);
  function sel(){ bu.classList.toggle("on",!signed); bs.classList.toggle("on",signed); }
  function value(){ let v=0; bits.forEach((b,k)=>v+=b*(1<<(7-k))); if(signed && bits[0]===1) v-=256; return v; }
  function render(){
    sw.innerHTML=""; bits.forEach((b,k)=>{ const w=1<<(7-k); sw.append(h("div",{class:"sw"}, h("span",{class:"w"}, signed&&k===0?"−128":String(w)), h("button",{class:b?"on":"", onclick:()=>{bits[k]=1-bits[k]; render();}}, String(b)))); });
    const v=value(); const u=bits.reduce((a,b)=>a*2+b,0);
    vals.innerHTML=`<div><div class="l">2進数</div><div class="v">${bits.join("")}</div></div><div><div class="l">10進数</div><div class="v">${v}</div></div><div><div class="l">16進数</div><div class="v">${u.toString(16).toUpperCase().padStart(2,"0")}</div></div>`;
    const on=bits.map((b,k)=>b?(signed&&k===0?"(−128)":String(1<<(7-k))):null).filter(Boolean);
    msg.className="status"; msg.innerHTML = `計算：${on.length? on.join(" + ") + " = " + v : "すべて 0 なので 0"}${target!=null ? (v===target?`　🎉 <span style="color:var(--ok)">目標 ${target} を作れました！</span>`:`　目標：<b>${target}</b>`):""}`;
  }
  function newTarget(){ target = signed ? Math.floor(Math.random()*256)-128 : Math.floor(Math.random()*256); render(); }
  el.append(seg, sw, vals, msg, h("div",{class:"row"}, h("button",{class:"btn primary", onclick:newTarget},"🎯 目標の数を出す"), h("button",{class:"btn sm", onclick:()=>{bits=[0,0,0,0,0,0,0,0]; target=null; render();}},"全部 0 にする")), h("p",{class:"small muted"},"スイッチを押して 0/1 を切りかえよう。8 個のスイッチで 2⁸＝256 通り。「2の補数」に切りかえると、いちばん左のスイッチの重みが −128 になり、同じビット列が負の数として読めます。"));
  render();
};

/* ============================================================ 2-2 基数変換 */
WIDGETS.radix = function(el){
  const inp=h("input",{type:"number", min:"0", max:"4095", value:"45", style:"width:120px"});
  const steps=h("div",{class:"steps"}), res=h("div",{class:"readout"});
  async function go(){
    let n=Math.max(0, Math.min(4095, Math.floor(+inp.value||0))); inp.value=n; steps.innerHTML=""; res.innerHTML="";
    if(n===0){ res.innerHTML="0 は 2進数でも 0、16進数でも 0"; return; }
    const rem=[]; let q=n, k=0;
    while(q>0){ const r=q%2, nq=Math.floor(q/2); const d=h("div",{style:`animation-delay:${k*.25}s`, html:`${q} ÷ 2 ＝ ${nq} … 余り <b style="color:var(--accent)">${r}</b>`}); steps.append(d); rem.push(r); q=nq; k++; }
    await sleep(k*250+200);
    const bin=rem.slice().reverse().join(""); const pad=bin.padStart(Math.ceil(bin.length/4)*4,"0"); const groups=pad.match(/.{4}/g); const hex=groups.map(g=>parseInt(g,2).toString(16).toUpperCase());
    res.innerHTML=`余りを<b>下から順に</b>読む → 2進数 <b>${bin}</b><br>検算：${rem.map((r,i)=>r?String(1<<i):null).filter(Boolean).reverse().join(" + ")} ＝ ${n} ✓<br>4 けたずつ区切る：${groups.map((g,i)=>`<span class="hl">${g}</span>`).join(" ")} → ${groups.map((g,i)=>`<span class="hl">${hex[i]}</span>`).join(" ")} → 16進数 <b>${hex.join("")}</b>`;
  }
  el.append(h("div",{class:"row"}, h("label",{},"10進数："), inp, h("button",{class:"btn primary", onclick:go},"変換する")), steps, res); go();
};

/* ============================================================ 2-3 単位 */
WIDGETS.units = function(el){
  const val=h("input",{type:"number", value:"32", min:"0", style:"width:120px"}); const unit=h("select",{}, ...["B","kB","MB","GB","TB"].map(u=>h("option",{value:u, ...(u==="GB"?{selected:""}:{})},u)));
  const out=h("div",{class:"readout"});
  const ex=h("div",{class:"row"});
  function go(){ const m={B:1,kB:1e3,MB:1e6,GB:1e9,TB:1e12}; const bytes=(+val.value||0)*m[unit.value]; const si=["B","kB","MB","GB","TB"].map((u,i)=>`${u}: <b>${fmt(+(bytes/Math.pow(1000,i)).toPrecision(6))}</b>`).join("　"); const bi=["B","KiB","MiB","GiB","TiB"].map((u,i)=>`${u}: <b>${fmt(+(bytes/Math.pow(1024,i)).toPrecision(6))}</b>`).join("　");
    out.innerHTML=`${fmt(bytes)} バイト<br><span class="hl">1000 倍ずつ（SI）</span>　${si}<br><span class="hl">1024 倍ずつ（2進接頭辞）</span>　${bi}<br>これは… 写真（3 MB）なら約 <b>${fmt(Math.floor(bytes/3e6))}</b> 枚、音楽（5 MB）なら約 <b>${fmt(Math.floor(bytes/5e6))}</b> 曲、映画（4 GB）なら約 <b>${fmt(Math.floor(bytes/4e9))}</b> 本、ビット数にすると <b>${fmt(bytes*8)}</b> ビット`; }
  [["USB メモリ 32 GB",32,"GB"],["写真 1 枚 3 MB",3,"MB"],["CD 700 MB",700,"MB"],["HDD 2 TB",2,"TB"],["メモリ 16 GB",16,"GB"]].forEach(e=>ex.append(h("button",{class:"chip", onclick:()=>{val.value=e[1]; unit.value=e[2]; go();}}, e[0])));
  val.addEventListener("input",go); unit.addEventListener("change",go); go();
  el.append(h("div",{class:"row"}, val, unit, h("span",{class:"small muted"},"を換算する")), ex, out);
};

/* ============================================================ 2-5 文字コード */
WIDGETS.charcode = function(el){
  const inp=h("input",{type:"text", value:"A あ 😀", style:"width:min(100%,320px)"}); const out=h("div",{class:"stack"});
  const enc=new TextEncoder();
  function go(){ out.innerHTML=""; const s=[...inp.value].slice(0,12); let total=0;
    s.forEach(ch=>{ const cp=ch.codePointAt(0); const bytes=[...enc.encode(ch)]; total+=bytes.length; const kind= cp<128?"ASCII（1 バイト）": cp<0x800?"2 バイト": cp<0x10000?"3 バイト（日本語はここ）":"4 バイト（絵文字など）";
      out.append(h("div",{class:"tokenline"}, h("span",{style:"font-size:26px;width:44px;text-align:center"}, ch===" "?"␣":ch), h("span",{class:"byte"},`U+${cp.toString(16).toUpperCase().padStart(4,"0")}`), h("span",{class:"small muted"},`（10進 ${cp}）→ UTF-8：`), ...bytes.map(b=>h("span",{class:"byte u"}, b.toString(16).toUpperCase().padStart(2,"0"))), h("span",{class:"pill"}, kind))); });
    out.append(h("div",{class:"readout"},`合計 ${total} バイト（${s.length} 文字）。同じ「1 文字」でも、英字は 1 バイト、日本語は 3 バイト（UTF-8 の場合）。`)); }
  inp.addEventListener("input",go); go();
  el.append(h("div",{class:"row"}, h("label",{},"文字を入力："), inp), h("div",{class:"row"}, ...["Hello","こんにちは","A","😀","漢字"].map(t=>h("button",{class:"chip", onclick:()=>{inp.value=t; go();}},t))), out, h("p",{class:"small muted"},"U+ の後ろの数が Unicode の番号（コードポイント）、紫のバイトがファイルに実際に保存される UTF-8 のバイト列（16進数）。ASCII の「A」は 65＝16進 41。"));
};

/* ============================================================ 2-6 画像 */
WIDGETS.image = function(el){
  const r=h("input",{type:"range",min:0,max:255,value:230}), g=h("input",{type:"range",min:0,max:255,value:120}), b=h("input",{type:"range",min:0,max:255,value:40});
  const box=h("div",{class:"rgbbox"});
  function col(){ const R=+r.value,G=+g.value,B=+b.value; box.style.background=`rgb(${R},${G},${B})`; box.innerHTML=`RGB(${R}, ${G}, ${B})<br>#${[R,G,B].map(x=>x.toString(16).toUpperCase().padStart(2,"0")).join("")}<br><span style="font-size:12px">2進：${[R,G,B].map(x=>x.toString(2).padStart(8,"0")).join(" ")}</span>`; }
  [r,g,b].forEach(x=>x.addEventListener("input",col)); col();
  // 解像度・色深度
  const res=h("input",{type:"range",min:2,max:6,value:4}); const depth=h("select",{}, h("option",{value:"1"},"1 ビット（2 色）"), h("option",{value:"3"},"3 ビット（8 色）"), h("option",{value:"8"},"8 ビット（256 色・グレー）"), h("option",{value:"24",selected:""},"24 ビット（約 1677 万色）"));
  const cv=h("canvas",{class:"pxcanvas"}); const info=h("div",{class:"readout"});
  const src=document.createElement("canvas"); src.width=src.height=64; const sc=src.getContext("2d");
  (function drawSrc(){ const grd=sc.createLinearGradient(0,0,64,64); grd.addColorStop(0,"#7ec8ff"); grd.addColorStop(1,"#f9d976"); sc.fillStyle=grd; sc.fillRect(0,0,64,64); sc.fillStyle="#ffd23f"; sc.beginPath(); sc.arc(32,32,22,0,Math.PI*2); sc.fill(); sc.fillStyle="#1c2333"; sc.beginPath(); sc.arc(24,26,3.5,0,Math.PI*2); sc.arc(40,26,3.5,0,Math.PI*2); sc.fill(); sc.strokeStyle="#c8102e"; sc.lineWidth=3; sc.beginPath(); sc.arc(32,34,11,Math.PI*.15,Math.PI*.85); sc.stroke(); sc.fillStyle="#e5567a"; sc.beginPath(); sc.arc(16,36,4,0,Math.PI*2); sc.arc(48,36,4,0,Math.PI*2); sc.fill(); })();
  function draw(){ const n=1<<+res.value, d=+depth.value; cv.width=cv.height=n; const c=cv.getContext("2d"); const tmp=document.createElement("canvas"); tmp.width=tmp.height=n; const tc=tmp.getContext("2d"); tc.drawImage(src,0,0,n,n); const img=tc.getImageData(0,0,n,n), p=img.data;
    for(let i=0;i<p.length;i+=4){ let R=p[i],G=p[i+1],B=p[i+2]; if(d===1){ const y=(R*.299+G*.587+B*.114)>140?255:0; R=G=B=y; } else if(d===3){ R=R>127?255:0; G=G>127?255:0; B=B>127?255:0; } else if(d===8){ const y=Math.round(R*.299+G*.587+B*.114); R=G=B=y; } p[i]=R;p[i+1]=G;p[i+2]=B; }
    c.putImageData(img,0,0); const bits=n*n*d; info.innerHTML=`解像度 <b>${n}×${n}</b> ＝ ${fmt(n*n)} 画素 × 色深度 <b>${d} ビット</b> ＝ <b>${fmt(bits)} ビット</b> ＝ ${fmt(bits/8)} バイト<br><span class="hl">参考：</span>1920×1080 × 24 ビット ＝ 49,766,400 ビット ≒ 6.2 MB（無圧縮）`; }
  res.addEventListener("input",draw); depth.addEventListener("change",draw); draw();
  el.append(h("div",{class:"two"}, h("div",{class:"stack"}, h("b",{},"① 光の三原色を混ぜる（加法混色）"), h("label",{},"R 赤 ",r), h("label",{},"G 緑 ",g), h("label",{},"B 青 ",b), box, h("p",{class:"small muted"},"全部 255 で白、全部 0 で黒。各色 8 ビット × 3 ＝ 24 ビットで 1 画素の色を表す。")), h("div",{class:"stack"}, h("b",{},"② 解像度と色深度を変える"), h("label",{},"解像度（画素数）",res), h("label",{},"色深度 ",depth), cv, info)));
};

/* ============================================================ 2-7 音 */
WIDGETS.sound = function(el){
  const FS=[2000,4000,8000,11025,22050,44100], BITS=[1,2,3,4,8,16];
  const fs=h("input",{type:"range",min:0,max:5,value:2}), bt=h("input",{type:"range",min:0,max:5,value:1});
  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg"); svg.setAttribute("viewBox","0 0 640 220"); svg.setAttribute("class","wave");
  const info=h("div",{class:"readout"}); const lab1=h("span",{class:"num"}), lab2=h("span",{class:"num"});
  const f0=440; // 元の音（ラ）
  function draw(){ const F=FS[+fs.value], B=BITS[+bt.value], L=1<<B; const W=640,H=220, per=2, ms=per/f0; // 2 周期分
    let s=`<rect width="${W}" height="${H}" fill="#fff" rx="12"/>`;
    for(let l=0;l<L && L<=16;l++){ const y=20+ (H-40)*(1-l/(L-1)); s+=`<line x1="0" x2="${W}" y1="${y}" y2="${y}" stroke="#eef1f8"/>`; }
    let path=""; for(let x=0;x<=W;x+=2){ const t=x/W*ms; const y=H/2-(H/2-20)*Math.sin(2*Math.PI*f0*t); path+=(x?"L":"M")+x+" "+y.toFixed(1); }
    s+=`<path d="${path}" stroke="#c4cde0" stroke-width="2" fill="none"/>`;
    const N=Math.round(F*ms); let stair="", pts="", bitsStr=[]; let prevY=null;
    for(let k=0;k<=N;k++){ const t=k/F; if(t>ms) break; const x=t/ms*W; const v=Math.sin(2*Math.PI*f0*t); const q=Math.round((v+1)/2*(L-1)); const y=20+(H-40)*(1-q/(L-1)); if(k<6) bitsStr.push(q.toString(2).padStart(B,"0"));
      pts+=`<circle cx="${x.toFixed(1)}" cy="${(H/2-(H/2-20)*v).toFixed(1)}" r="3.5" fill="#8b5cf6"/>`; if(prevY!==null) stair+=`L${x.toFixed(1)} ${prevY} L${x.toFixed(1)} ${y}`; else stair+=`M${x.toFixed(1)} ${y}`; prevY=y; }
    stair+=`L${W} ${prevY}`; s+=`<path d="${stair}" stroke="#3b7be9" stroke-width="2.5" fill="none"/>`+pts;
    svg.innerHTML=s; lab1.textContent=`${fmt(F)} Hz（1 秒に ${fmt(F)} 回）`; lab2.textContent=`${B} ビット（${fmt(L)} 段階）`;
    const bps=F*B; info.innerHTML=`灰色：元のアナログ波（440 Hz）　紫の点：<b>標本化</b>した点　青の階段：<b>量子化</b>した結果<br>符号化：最初の数点 → ${bitsStr.map(x=>`<span class="hl">${x}</span>`).join(" ")} …<br>データ量（モノラル 1 秒）＝ ${fmt(F)} × ${B} ＝ <b>${fmt(bps)} ビット</b> ＝ ${fmt(Math.round(bps/8))} バイト　${F===44100&&B===16?"← CD 音質（ステレオならこの 2 倍）":""}`; }
  let ctx=null;
  function play(){ try{ ctx=ctx||new (window.AudioContext||window.webkitAudioContext)(); const F=FS[+fs.value], B=BITS[+bt.value], L=1<<B; const sr=ctx.sampleRate, dur=1.2; const buf=ctx.createBuffer(1, sr*dur, sr); const d=buf.getChannelData(0); let hold=0;
      for(let i=0;i<d.length;i++){ const t=i/sr; const k=Math.floor(t*F); const ts=k/F; if(i===0||Math.floor((i-1)/sr*F)!==k){ const v=Math.sin(2*Math.PI*f0*ts)*Math.exp(-ts*1.2); hold=(Math.round((v+1)/2*(L-1))/(L-1))*2-1; } d[i]=hold*.3; }
      const srcN=ctx.createBufferSource(); srcN.buffer=buf; srcN.connect(ctx.destination); srcN.start(); }catch(e){} }
  fs.addEventListener("input",draw); bt.addEventListener("input",draw); draw();
  el.append(h("label",{},"サンプリング周波数：",lab1,fs), h("label",{},"量子化ビット数：",lab2,bt), svg, info, h("div",{class:"row"}, h("button",{class:"btn primary", onclick:play},"🔊 この設定の音を聞く（440 Hz）"), h("span",{class:"small muted"},"粗い設定ほどザラザラした音になります")));
};
})();

/* ============================================================ 3章・4章 */
(function(){
"use strict";
const h = (tag, attrs={}, ...kids)=>{ const el=document.createElement(tag); for(const k in attrs){ if(k==="class") el.className=attrs[k]; else if(k==="html") el.innerHTML=attrs[k]; else if(k.startsWith("on")) el.addEventListener(k.slice(2), attrs[k]); else el.setAttribute(k, attrs[k]); } kids.flat().forEach(c=>{ if(c!=null) el.append(c); }); return el; };
const shuffle = a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const sleep = ms=>new Promise(r=>setTimeout(r,ms));

/* ---------- 3-2 パス ---------- */
WIDGETS.path = function(el){
  const TREE = {name:"/", kids:[
    {name:"home", kids:[ {name:"taro", kids:[{name:"report.txt"},{name:"photo", kids:[{name:"cat.jpg"},{name:"dog.jpg"}]}]}, {name:"hanako", kids:[{name:"memo.txt"},{name:"music", kids:[{name:"song.mp3"}]}]} ]},
    {name:"etc", kids:[{name:"hosts"}]},
    {name:"usr", kids:[{name:"bin", kids:[{name:"python"}]},{name:"lib", kids:[]}]},
  ]};
  const dirs=[], files=[];
  (function walk(n, path){ const p = path==="/" ? "/"+n.name : path+"/"+n.name; const full = n.name==="/" ? "/" : p; if(n.kids){ dirs.push(full); n.kids.forEach(k=>walk(k, full)); } else files.push(full); })(TREE,"");
  let cur="/home/taro", target="/home/hanako/memo.txt", mode="rel";
  const treeEl=h("div",{class:"tree"}), q=h("div",{class:"point"}), inp=h("input",{type:"text", placeholder:"パスを入力", style:"width:min(100%,320px);font-family:var(--mono)"}), status=h("div",{class:"status"});
  function relPath(from, to){ const a=from.split("/").filter(Boolean), b=to.split("/").filter(Boolean); let i=0; while(i<a.length&&i<b.length&&a[i]===b[i]) i++; const up=a.length-i; const parts=[...Array(up).fill(".."), ...b.slice(i)]; return parts.length?parts.join("/"):"."; }
  function norm(p){ p=p.trim().replace(/\\/g,"/").replace(/\/+/g,"/"); if(p.length>1) p=p.replace(/\/$/,""); return p; }
  function resolve(base, p){ if(p.startsWith("/")) return norm(p); const parts=base.split("/").filter(Boolean); for(const s of p.split("/")){ if(s===""||s===".") continue; if(s==="..") parts.pop(); else parts.push(s); } return "/"+parts.join("/"); }
  function render(){
    treeEl.innerHTML="";
    (function walk(n, path, depth){ const full = n.name==="/" ? "/" : (path==="/"?"":path)+"/"+n.name; const isDir=!!n.kids; const node=h("div",{class:"node"+(isDir&&full===cur?" cur":"")+(full===target?" target":""), style:`margin-left:${depth*22}px`, onclick:()=>{ if(isDir){ cur=full; render(); status.textContent=""; } }}, (isDir?"📁 ":"📄 ")+n.name+(isDir&&full===cur?"　← カレント":"")+(full===target?"　← このファイル":"")); treeEl.append(node); if(n.kids) n.kids.forEach(k=>walk(k, full, depth+1)); })(TREE,"",0);
    q.innerHTML=`<b>問題</b><span>カレントディレクトリは <code>${cur}</code>。赤いファイル <code>${target.split("/").pop()}</code> を <b>${mode==="rel"?"相対パス":"絶対パス"}</b> で書くと？</span><span class="small muted">📁 をクリックするとカレントディレクトリを移動できます。</span>`;
  }
  function check(){ const v=norm(inp.value); if(!v){ return; } if(mode==="abs"){ const ok = v===target && v.startsWith("/"); status.className="status "+(ok?"ok":"ng"); status.innerHTML = ok?"⭕ 正解！ ルートから順にたどった絶対パスです。":(v.startsWith("/")?`❌ 指しているのは <code>${v}</code>。木をもう一度たどってみよう。`:"❌ 絶対パスは「/」から始めます。"); }
    else { const ok = !v.startsWith("/") && resolve(cur, v)===target; const canon=relPath(cur,target); status.className="status "+(ok?"ok":"ng"); status.innerHTML = ok? (v.replace(/^\.\//,"")===canon?"⭕ 正解！":"⭕ 正解（同じ場所を指しています）。いちばん短い書き方は <code>"+canon+"</code>。") : (v.startsWith("/")?"❌ 相対パスは「/」で始めません（それは絶対パス）。":`❌ <code>${v}</code> は <code>${resolve(cur,v)}</code> を指します。「..」で親に上がれます。`); } }
  function show(){ const ans = mode==="abs"?target:relPath(cur,target); status.className="status"; status.innerHTML=`答え：<code>${ans}</code>`; }
  function next(){ target=files[Math.floor(Math.random()*files.length)]; do{ cur=dirs[Math.floor(Math.random()*dirs.length)]; }while(cur===target); mode=Math.random()<.6?"rel":"abs"; inp.value=""; status.textContent=""; render(); }
  el.append(treeEl, q, h("div",{class:"row"}, inp, h("button",{class:"btn primary", onclick:check},"答え合わせ"), h("button",{class:"btn sm", onclick:show},"答えを見る"), h("button",{class:"btn sm", onclick:next},"次の問題")), status);
  inp.addEventListener("keydown", e=>{ if(e.key==="Enter") check(); });
  render();
};

/* ---------- 3-3 拡張子 ---------- */
WIDGETS.ext = function(el){
  WIDGETS._matching(el, shuffle([[".csv","カンマ区切りの表データ"],[".pdf","配布用の文書（レイアウトが崩れない）"],[".png","可逆圧縮の画像・透明あり"],[".jpg","写真向きの非可逆圧縮画像"],[".zip","複数ファイルをまとめて圧縮"],[".xlsx","表計算（Excel）"],[".mp4","動画"],[".html","Web ページ"]]).slice(0,6));
};

/* ---------- 4-1 層の積み木 ---------- */
WIDGETS.layers = function(el){
  const order=["ハードウェア","OS（基本ソフトウェア）","ミドルウェア","応用ソフトウェア（アプリ）","利用者（ユーザ）"];
  const stack=h("div",{class:"layers"}), pool=h("div",{class:"row", style:"justify-content:center"}), status=h("div",{class:"status"});
  let next=0;
  function build(){ stack.innerHTML=""; for(let i=order.length-1;i>=0;i--){ stack.append(h("div",{class:"layer "+(i<next?"placed":"slot"), style:i<next?`background:hsl(${150-i*12} 55% ${92-i*8}%);border-color:var(--accent)`:""}, i<next?order[i]:`${i===0?"いちばん下":"その上"}に来るのは？`)); }
    pool.innerHTML=""; shuffle(order.slice(next)).forEach(n=>pool.append(h("button",{class:"btn", onclick:(e)=>pick(n,e.currentTarget)}, n)));
    if(next===order.length){ status.className="status ok"; status.textContent="🎉 完成！ ハードウェアの上に OS、その上にミドルウェア、アプリ、そして利用者。"; } }
  function pick(n,btn){ if(n===order[next]){ next++; status.className="status ok"; status.textContent=next<order.length?"⭕ 正解。次は？":""; build(); } else { btn.classList.add("shake"); setTimeout(()=>btn.classList.remove("shake"),350); status.className="status ng"; status.textContent=`❌ 「${n}」はここではありません。${next===0?"土台になるのは物理的な機械です。":"下の層が上の層を支えます。"}`; } }
  el.append(h("p",{class:"small muted"},"下から順に、正しい層を選んで積みましょう。"), stack, pool, status, h("button",{class:"btn sm", onclick:()=>{next=0; status.textContent=""; build();}},"やり直す")); build();
};

/* ---------- 4-2 マルチタスク ---------- */
WIDGETS.multitask = function(el){
  const tasks=[{n:"🌐 ブラウザ",c:"#3b7be9",need:12},{n:"🎵 音楽",c:"#8b5cf6",need:8},{n:"📝 文書",c:"#22a36b",need:10}];
  let cores=1, slice=400, running=false, timer=null;
  const tl=h("div",{class:"tl"}), status=h("div",{class:"status"}), seg=h("div",{class:"seg"});
  const b1=h("button",{class:"on", onclick:()=>{cores=1; sel();}},"1 コア"), b2=h("button",{onclick:()=>{cores=2; sel();}},"2 コア"); seg.append(b1,b2);
  function sel(){ b1.classList.toggle("on",cores===1); b2.classList.toggle("on",cores===2); }
  const sp=h("input",{type:"range",min:100,max:800,step:100,value:400}); sp.addEventListener("input",()=>slice=+sp.value);
  let state; function reset(){ clearInterval(timer); running=false; state=tasks.map(t=>({done:0, blocks:[]})); draw(); status.textContent=""; }
  function draw(){ tl.innerHTML=""; const total=30; tasks.forEach((t,i)=>{ const track=h("div",{class:"track"}); state[i].blocks.forEach(b=>track.append(h("i",{style:`left:${b/total*100}%;width:${100/total}%;background:${t.c}`}))); tl.append(h("div",{class:"lane"}, h("span",{}, t.n), track), h("div",{class:"lane"}, h("span",{class:"small muted"},"進み"), h("span",{style:"height:6px;background:var(--bg2);border-radius:4px;overflow:hidden;display:block"}, h("i",{style:`display:block;height:100%;width:${Math.min(100,100*state[i].done/t.need)}%;background:${t.c}`})))); }); }
  function start(){ if(running) return; reset(); running=true; let tick=0, rr=0;
    timer=setInterval(()=>{ let assigned=0, tries=0; while(assigned<cores && tries<tasks.length){ const i=(rr+tries)%tasks.length; if(state[i].done<tasks[i].need){ state[i].done++; state[i].blocks.push(tick); assigned++; } tries++; }
      rr=(rr+1)%tasks.length; tick++; draw();
      const fin=state.every((s,i)=>s.done>=tasks[i].need);
      status.className="status"; status.innerHTML=`時間 ${tick} スライス目　CPU は <b>${cores} コア</b>で、${cores===1?"1 つずつ順番に":"2 つ同時に"}実行中。${fin?"　✅ すべて終了":""}`;
      if(fin||tick>=30){ clearInterval(timer); running=false; } }, slice); }
  reset();
  el.append(h("div",{class:"row"}, seg, h("label",{style:"flex:1;min-width:200px"},"タイムスライスの長さ（表示のゆっくりさ）",sp)), tl, h("div",{class:"row"}, h("button",{class:"btn primary", onclick:start},"▶ 3 つのアプリを同時に動かす"), h("button",{class:"btn sm", onclick:reset},"リセット")), status, h("p",{class:"small muted"},"色のついたブロックが「その時間に CPU を使っていたアプリ」。1 コアではどの瞬間も 1 つのアプリしか動いていないのに、切りかえが速いので同時に動いているように見えます。実際のタイムスライスは数ミリ秒です。"));
};

/* ---------- 4-3 OS マッチング ---------- */
WIDGETS.osmatch = function(el){
  WIDGETS._matching(el, [["Windows","Microsoft 社のパソコン用 OS。最も普及"],["macOS","Apple 社の Mac 用 OS。UNIX 系"],["Linux","オープンソースの UNIX 系 OS。サーバに強い"],["iOS","Apple 社のスマートフォン用 OS"],["Android","Linux をもとにしたスマートフォン用 OSS"],["CUI","文字のコマンドで操作するインタフェース"]], "OS・用語（左）と説明（右）を結ぼう。");
};
})();

/* ============================================================ 5章：ミニ表計算エンジン */
(function(){
"use strict";
const h = (tag, attrs={}, ...kids)=>{ const el=document.createElement(tag); for(const k in attrs){ if(k==="class") el.className=attrs[k]; else if(k==="html") el.innerHTML=attrs[k]; else if(k.startsWith("on")) el.addEventListener(k.slice(2), attrs[k]); else el.setAttribute(k, attrs[k]); } kids.flat().forEach(c=>{ if(c!=null) el.append(c); }); return el; };
const colName = i=>String.fromCharCode(65+i), colIdx = s=>s.charCodeAt(0)-65;
const REF = /^(\$?)([A-Z])(\$?)(\d+)$/;

/* 数式の字句解析・構文解析・評価 */
function tokenize(src){
  const t=[]; let i=0;
  while(i<src.length){ const c=src[i];
    if(/\s/.test(c)){ i++; continue; }
    if(c==='"'){ let j=i+1, s=""; while(j<src.length && src[j]!=='"'){ s+=src[j]; j++; } t.push({k:"str", v:s}); i=j+1; continue; }
    if(/[0-9.]/.test(c)){ let j=i; while(j<src.length && /[0-9.]/.test(src[j])) j++; t.push({k:"num", v:parseFloat(src.slice(i,j))}); i=j; continue; }
    if(/[A-Za-z$]/.test(c)){ let j=i; while(j<src.length && /[A-Za-z0-9$_]/.test(src[j])) j++; const w=src.slice(i,j).toUpperCase(); if(src[j]==="(") t.push({k:"fn", v:w}); else t.push({k:"id", v:w}); i=j; continue; }
    if(src.startsWith("<=",i)||src.startsWith(">=",i)||src.startsWith("<>",i)){ t.push({k:"op", v:src.substr(i,2)}); i+=2; continue; }
    if("+-*/^(),:=<>&".includes(c)){ t.push({k:"op", v:c}); i++; continue; }
    throw new Error("記号");
  } return t;
}
function parse(tokens){
  let p=0; const peek=()=>tokens[p], eat=(v)=>{ const t=tokens[p]; if(v!==undefined && (!t||t.v!==v)) throw new Error("構文"); p++; return t; };
  function cmp(){ let l=cat(); while(peek()&&peek().k==="op"&&["=","<",">","<=",">=","<>"].includes(peek().v)){ const o=eat().v; l={t:"bin",o,l,r:cat()}; } return l; }
  function cat(){ let l=add(); while(peek()&&peek().v==="&"){ eat(); l={t:"bin",o:"&",l,r:add()}; } return l; }
  function add(){ let l=mul(); while(peek()&&peek().k==="op"&&(peek().v==="+"||peek().v==="-")){ const o=eat().v; l={t:"bin",o,l,r:mul()}; } return l; }
  function mul(){ let l=pow(); while(peek()&&peek().k==="op"&&(peek().v==="*"||peek().v==="/")){ const o=eat().v; l={t:"bin",o,l,r:pow()}; } return l; }
  function pow(){ let l=un(); while(peek()&&peek().v==="^"){ eat(); l={t:"bin",o:"^",l,r:un()}; } return l; }
  function un(){ if(peek()&&peek().v==="-"){ eat(); return {t:"neg", v:un()}; } if(peek()&&peek().v==="+"){ eat(); return un(); } return prim(); }
  function prim(){ const t=eat(); if(!t) throw new Error("構文");
    if(t.k==="num") return {t:"num", v:t.v}; if(t.k==="str") return {t:"str", v:t.v};
    if(t.k==="fn"){ eat("("); const args=[]; if(peek()&&peek().v!==")"){ args.push(cmp()); while(peek()&&peek().v===","){ eat(); args.push(cmp()); } } eat(")"); return {t:"fn", n:t.v, args}; }
    if(t.k==="id"){ if(!REF.test(t.v)) throw new Error("名前"); if(peek()&&peek().v===":"){ eat(); const r=eat(); if(!r||!REF.test(r.v)) throw new Error("範囲"); return {t:"range", a:t.v, b:r.v}; } return {t:"ref", a:t.v}; }
    if(t.v==="("){ const e=cmp(); eat(")"); return e; }
    throw new Error("構文"); }
  const e=cmp(); if(p<tokens.length) throw new Error("構文"); return e;
}
function refsOf(node, out=[]){ if(!node) return out; if(node.t==="ref") out.push(node.a.replace(/\$/g,"")); else if(node.t==="range"){ const [c1,r1]=addr(node.a),[c2,r2]=addr(node.b); for(let c=Math.min(c1,c2);c<=Math.max(c1,c2);c++) for(let r=Math.min(r1,r2);r<=Math.max(r1,r2);r++) out.push(colName(c)+r); } else if(node.t==="bin"){ refsOf(node.l,out); refsOf(node.r,out); } else if(node.t==="neg") refsOf(node.v,out); else if(node.t==="fn") node.args.forEach(a=>refsOf(a,out)); return out; }
function addr(a){ const m=REF.exec(a); return [colIdx(m[2]), +m[4]]; }
function shiftFormula(f, dc, dr){ // 相対参照だけをずらす
  return f.replace(/"[^"]*"|(\$?)([A-Z])(\$?)(\d+)/g, (m, dc$, col, dr$, row)=>{ if(m.startsWith('"')) return m; const c = dc$ ? col : colName(colIdx(col)+dc); const r = dr$ ? row : String(+row+dr); if(colIdx(c)<0||colIdx(c)>25||+r<1) return "#REF!"; return dc$+c+dr$+r; });
}

function makeSheet(root, opts){
  const cols=opts.cols||5, rows=opts.rows||7; const cells={}; Object.assign(cells, opts.data||{});
  let sel="A1", showF=false; const cache={};
  const fbar=h("div",{class:"fbar"}), addrEl=h("span",{class:"addr"},"A1"), finp=h("input",{type:"text", placeholder:"= で始めると数式", spellcheck:"false"});
  fbar.append(addrEl, finp);
  const tbl=h("table"), wrap=h("div",{class:"sheet"}, tbl), status=h("div",{class:"status"});
  const api={ get:a=>value(a), formula:a=>cells[a]||"", set:(a,v)=>{ cells[a]=v; recalc(); }, copy:(from,to)=>{ const f=cells[from]||""; const [c1,r1]=addr(from),[c2,r2]=addr(to); cells[to]= f.startsWith("=") ? shiftFormula(f, c2-c1, r2-r1) : f; recalc(); }, showFormulas:(b)=>{ showF=b; render(); }, cells, select:(a)=>{ sel=a; render(); }, status };
  function value(a, stack=new Set()){ if(a in cache) return cache[a]; const raw=cells[a]; let v;
    if(raw==null||raw==="") v=""; else if(typeof raw==="string" && raw.startsWith("=")){ if(stack.has(a)) return {err:"循環"}; stack.add(a); try{ v=evalNode(parse(tokenize(raw.slice(1))), stack); }catch(e){ v={err:e.message==="名前"?"名前":"式"}; } stack.delete(a); }
    else if(typeof raw==="string" && raw.trim()!=="" && !isNaN(+raw)) v=+raw; else v=raw;
    cache[a]=v; return v; }
  function evalNode(n, stack){
    switch(n.t){
      case "num": return n.v; case "str": return n.v;
      case "ref": return value(n.a.replace(/\$/g,""), stack);
      case "range": return refsOf(n).map(a=>value(a, stack));
      case "neg": { const v=num(evalNode(n.v,stack)); return isErr(v)?v:-v; }
      case "bin": { const l=evalNode(n.l,stack), r=evalNode(n.r,stack); if(isErr(l)) return l; if(isErr(r)) return r;
        if(n.o==="&") return String(disp(l))+String(disp(r));
        if(["=","<",">","<=",">=","<>"].includes(n.o)){ const a=l===""?0:l, b=r===""?0:r; switch(n.o){ case "=": return a==b; case "<>": return a!=b; case "<": return a<b; case ">": return a>b; case "<=": return a<=b; case ">=": return a>=b; } }
        const a=num(l), b=num(r); if(isErr(a)) return a; if(isErr(b)) return b;
        switch(n.o){ case "+": return a+b; case "-": return a-b; case "*": return a*b; case "/": return b===0?{err:"DIV/0"}:a/b; case "^": return Math.pow(a,b); } }
      case "fn": { const args=n.args.map(a=>evalNode(a,stack)); const flat=args.flat(); const nums=flat.filter(x=>typeof x==="number"); const bad=flat.find(isErr); if(bad && n.n!=="IF") return bad;
        switch(n.n){
          case "SUM": return nums.reduce((s,x)=>s+x,0);
          case "AVERAGE": return nums.length?nums.reduce((s,x)=>s+x,0)/nums.length:{err:"DIV/0"};
          case "MAX": return nums.length?Math.max(...nums):0; case "MIN": return nums.length?Math.min(...nums):0;
          case "COUNT": return nums.length;
          case "IF": { const c=args[0]; if(isErr(c)) return c; return (c===true||(typeof c==="number"&&c!==0)) ? (args.length>1?args[1]:true) : (args.length>2?args[2]:false); }
          case "ROUND": { const v=num(args[0]), d=args.length>1?num(args[1]):0; if(isErr(v)) return v; const m=Math.pow(10,d); return Math.round(v*m+1e-9)/m; }
          case "INT": { const v=num(args[0]); return isErr(v)?v:Math.floor(v); }
          case "MOD": { const a=num(args[0]), b=num(args[1]); if(isErr(a)) return a; if(isErr(b)) return b; return b===0?{err:"DIV/0"}:a-b*Math.floor(a/b); }
          case "ABS": { const v=num(args[0]); return isErr(v)?v:Math.abs(v); }
          case "AND": return flat.every(x=>x===true||(typeof x==="number"&&x!==0)); case "OR": return flat.some(x=>x===true||(typeof x==="number"&&x!==0));
          default: return {err:"関数名"};
        } }
    } }
  const isErr=v=>v&&typeof v==="object"&&"err" in v;
  const num=v=>{ if(isErr(v)) return v; if(v===""||v==null) return 0; if(typeof v==="boolean") return v?1:0; if(typeof v==="number") return v; if(!isNaN(+v)) return +v; return {err:"値"}; };
  const disp=v=>{ if(isErr(v)) return "#"+v.err; if(typeof v==="number") return Number.isInteger(v)?String(v):String(+v.toFixed(4)); if(typeof v==="boolean") return v?"TRUE":"FALSE"; return v==null?"":String(v); };
  function recalc(){ for(const k in cache) delete cache[k]; render(); if(opts.onChange) opts.onChange(api); }
  function render(){
    let refs=[]; const f=cells[sel]||""; if(f.startsWith("=")){ try{ refs=refsOf(parse(tokenize(f.slice(1)))); }catch(e){} }
    tbl.innerHTML=""; const head=h("tr",{}, h("th",{},"")); for(let c=0;c<cols;c++) head.append(h("th",{}, colName(c))); tbl.append(head);
    for(let r=1;r<=rows;r++){ const tr=h("tr",{}, h("th",{}, String(r))); for(let c=0;c<cols;c++){ const a=colName(c)+r; const v=value(a); const raw=cells[a]||""; const td=h("td",{class:(a===sel?"sel ":"")+(refs.includes(a)?"ref ":"")+(isErr(v)?"err ":"")+(typeof v==="number"?"num":"")});
        const inp=h("input",{type:"text", value: showF ? raw : disp(v), spellcheck:"false", "data-a":a}); inp.addEventListener("focus",()=>{ if(sel!==a){ sel=a; render(); const el2=tbl.querySelector(`input[data-a="${a}"]`); if(el2) el2.focus(); } inp.value=raw; });
        inp.addEventListener("blur",()=>{ if(inp.value!==raw){ cells[a]=inp.value; recalc(); } else inp.value= showF?raw:disp(value(a)); });
        inp.addEventListener("keydown",e=>{ if(e.key==="Enter"){ e.preventDefault(); inp.blur(); const nx=tbl.querySelector(`input[data-a="${colName(c)+(r+1)}"]`); if(nx) nx.focus(); } });
        td.append(inp); tr.append(td); } tbl.append(tr); }
    addrEl.textContent=sel; finp.value=cells[sel]||"";
  }
  finp.addEventListener("keydown",e=>{ if(e.key==="Enter"){ cells[sel]=finp.value; recalc(); } });
  finp.addEventListener("blur",()=>{ if((cells[sel]||"")!==finp.value){ cells[sel]=finp.value; recalc(); } });
  root.append(fbar, wrap, status); recalc(); return api;
}
WIDGETS._makeSheet = makeSheet;

/* ---------- 5-2 関数 ---------- */
WIDGETS.sheet = function(el){
  const data={A1:"商品",B1:"単価",C1:"数量",D1:"金額", A2:"りんご",B2:"120",C2:"3", A3:"みかん",B3:"80",C3:"10", A4:"ぶどう",B4:"450",C4:"2", A5:"もも",B5:"300",C5:"4", A6:"合計",A7:"平均"};
  const tasks=[
    {d:"D2 に「単価×数量」の数式を入れる（=B2*C2）", ok:s=>{ const f=(s.formula("D2")||"").toUpperCase().replace(/\s/g,""); return f.startsWith("=") && /B2/.test(f) && /C2/.test(f) && s.get("D2")===360; }},
    {d:"D3〜D5 にも同じ考え方で金額を入れる（下の「D2 を下にコピー」でも OK）", ok:s=>s.get("D3")===800&&s.get("D4")===900&&s.get("D5")===1200},
    {d:"D6 に SUM で合計を出す（=SUM(D2:D5)）", ok:s=>{ const f=(s.formula("D6")||"").toUpperCase(); return /SUM/.test(f) && s.get("D6")===3260; }},
    {d:"D7 に AVERAGE で平均を出す", ok:s=>{ const f=(s.formula("D7")||"").toUpperCase(); return /AVERAGE/.test(f) && s.get("D7")===815; }},
    {d:"E1 に「判定」、E2 に =IF(D2>=800,\"多い\",\"少ない\") を入れる", ok:s=>{ const f=(s.formula("E2")||"").toUpperCase(); return /IF/.test(f) && s.get("E2")==="少ない"; }},
  ];
  const list=h("div",{class:"stack"});
  function check(s){ list.innerHTML=""; let n=0; tasks.forEach((t,i)=>{ const ok=t.ok(s); if(ok) n++; list.append(h("div",{class:"pill "+(ok?"ok":""), style:"display:block;white-space:normal"}, `${ok?"✅":"⬜"} 課題 ${i+1}：${t.d}`)); }); if(n===tasks.length) list.append(h("div",{class:"status ok"},"🎉 全課題クリア！")); }
  const s=makeSheet(el, {cols:5, rows:7, data, onChange:check});
  el.append(h("div",{class:"row"}, h("button",{class:"btn sm", onclick:()=>{ ["D3","D4","D5"].forEach(a=>s.copy("D2",a)); }},"D2 を D3〜D5 に下にコピー"), h("label",{class:"check"}, h("input",{type:"checkbox", onchange:e=>s.showFormulas(e.target.checked)}), "数式を表示")), h("p",{class:"small muted"},"セルをクリックして入力し、Enter で確定。数式は = で始めます（例：=B2*C2、=SUM(D2:D5)）。選んだセルが参照しているセルは黄色で表示されます。"), h("b",{},"課題"), list); check(s);
};

/* ---------- 5-3 相対参照と絶対参照 ---------- */
WIDGETS.refcopy = function(el){
  const data={A1:"税率",B1:"0.1", A3:"商品",B3:"税抜価格",C3:"税込価格", A4:"ノート",B4:"200", A5:"ペン",B5:"150", A6:"消しゴム",B6:"100", A7:"定規",B7:"300"};
  const msg=h("div",{class:"point", html:"<b>やってみよう</b><span>① C4 に <code>=B4*(1+B1)</code> と入れて Enter。② 「C4 を下にコピー」を押す。C5〜C7 はどうなる？　③ 次に C4 を <code>=B4*(1+$B$1)</code> に直して、もう一度コピー。</span>"});
  const log=h("div",{class:"readout"});
  const s=makeSheet(el, {cols:4, rows:7, data, onChange:report});
  function report(s){ const rows=["C4","C5","C6","C7"].map(a=>{ const f=s.formula(a); const v=s.get(a); const d = typeof v==="object"&&v ? "#"+v.err : (v===""?"" : typeof v==="number" ? String(+v.toFixed(4)) : v); return `${a}: <b>${f||"（空）"}</b> → ${d}`; }).join("<br>");
    const f4=(s.formula("C4")||"").toUpperCase().replace(/\s/g,""); let verdict="";
    if(f4 && /B1/.test(f4) && !/\$B\$1|B\$1/.test(f4)) verdict=`<span class="hl">B1 が相対参照なので、下にコピーすると B2、B3… とずれてしまいます（税率の入っていないセルを参照 → 結果が税抜のまま）。</span>`;
    else if(/\$B\$1|B\$1/.test(f4)) verdict=`<span style="color:#7fe3bb">$ で行を固定したので、コピーしても税率 B1 を参照し続けます。これが絶対参照。</span>`;
    log.innerHTML=rows+"<br>"+verdict; }
  el.append(msg, h("div",{class:"row"}, h("button",{class:"btn primary", onclick:()=>{ ["C5","C6","C7"].forEach(a=>s.copy("C4",a)); }},"C4 を C5〜C7 に下にコピー"), h("button",{class:"btn sm", onclick:()=>{ s.set("C4","=B4*(1+B1)"); }},"C4 に相対参照の式を入れる"), h("button",{class:"btn sm", onclick:()=>{ s.set("C4","=B4*(1+$B$1)"); }},"C4 に絶対参照の式を入れる"), h("label",{class:"check"}, h("input",{type:"checkbox", onchange:e=>s.showFormulas(e.target.checked)}),"数式を表示")), log); report(s);
};

/* ---------- 5-4 グラフ ---------- */
WIDGETS.charts = function(el){
  const SC=[ {q:"商品ごとの売上を比べたい", best:"bar", labels:["りんご","みかん","ぶどう","もも"], v:[120,80,150,60]},
    {q:"1 年間の月ごとの平均気温の変化を見たい", best:"line", labels:["1","2","3","4","5","6","7","8","9","10","11","12"], v:[5,6,9,14,19,22,26,28,24,18,12,7]},
    {q:"クラスの通学手段の割合を見たい", best:"pie", labels:["徒歩","自転車","バス","電車"], v:[40,30,20,10]},
    {q:"勉強時間と点数に関係があるか知りたい", best:"scatter", xy:[[1,45],[2,50],[2.5,62],[3,58],[4,72],[4.5,70],[5,85],[6,88],[7,92]]} ];
  const TYPES=[["bar","棒グラフ"],["line","折れ線グラフ"],["pie","円グラフ"],["scatter","散布図"]];
  let si=0; const q=h("div",{class:"point"}), area=h("div"), status=h("div",{class:"status"}), sel=h("div",{class:"chart-sel"});
  const colors=["#3b7be9","#8b5cf6","#f0a020","#22a36b","#0e9fb0","#e5567a","#5a93ee","#a78bfa","#ffd166","#7fe3bb","#9fe0ff","#ff8fa3"];
  function draw(type){ const s=SC[si]; const W=520,H=240, L=40,B=30; let g=`<svg viewBox="0 0 ${W} ${H}" class="fig" style="max-width:520px;background:#fff;border:1px solid var(--line);border-radius:12px">`;
    const vals = s.v || s.xy.map(p=>p[1]); const labels = s.labels || s.xy.map(p=>String(p[0])); const max=Math.max(...vals)*1.15;
    const px=(i,n)=>L+(W-L-10)*(i+.5)/n, py=v=>H-B-(H-B-15)*v/max;
    if(type==="bar"){ const n=vals.length, bw=(W-L-10)/n*.6; vals.forEach((v,i)=>{ g+=`<rect x="${px(i,n)-bw/2}" y="${py(v)}" width="${bw}" height="${H-B-py(v)}" fill="${colors[i%colors.length]}" rx="4"><animate attributeName="height" from="0" to="${H-B-py(v)}" dur=".5s"/><animate attributeName="y" from="${H-B}" to="${py(v)}" dur=".5s"/></rect><text x="${px(i,n)}" y="${H-10}" text-anchor="middle" font-size="11">${labels[i]}</text>`; }); }
    else if(type==="line"){ const n=vals.length; const pts=vals.map((v,i)=>`${px(i,n)},${py(v)}`).join(" "); g+=`<polyline points="${pts}" fill="none" stroke="#3b7be9" stroke-width="3" stroke-linejoin="round"/>`; vals.forEach((v,i)=>{ g+=`<circle cx="${px(i,n)}" cy="${py(v)}" r="4" fill="#3b7be9"/><text x="${px(i,n)}" y="${H-10}" text-anchor="middle" font-size="11">${labels[i]}</text>`; }); }
    else if(type==="pie"){ const tot=vals.reduce((a,b)=>a+b,0); let a0=-Math.PI/2; const cx=W/2-60, cy=H/2, r=95; vals.forEach((v,i)=>{ const a1=a0+2*Math.PI*v/tot; const x0=cx+r*Math.cos(a0),y0=cy+r*Math.sin(a0),x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1); g+=`<path d="M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${a1-a0>Math.PI?1:0} 1 ${x1} ${y1}Z" fill="${colors[i%colors.length]}" stroke="#fff" stroke-width="2"/>`; g+=`<rect x="${W-150}" y="${30+i*18}" width="12" height="12" fill="${colors[i%colors.length]}"/><text x="${W-132}" y="${41+i*18}" font-size="12">${labels[i]} ${Math.round(100*v/tot)}%</text>`; a0=a1; }); }
    else { const xs=s.xy?s.xy.map(p=>p[0]):vals.map((v,i)=>i+1); const ys=vals; const mx=Math.max(...xs)*1.1, my=Math.max(...ys)*1.15; xs.forEach((x,i)=>{ g+=`<circle cx="${L+(W-L-10)*x/mx}" cy="${H-B-(H-B-15)*ys[i]/my}" r="5" fill="#e5567a" opacity=".8"/>`; }); g+=`<text x="${W/2}" y="${H-8}" text-anchor="middle" font-size="11">${s.xy?"勉強時間（時間）":"項目の番号"}</text>`; }
    g+=`<line x1="${L}" y1="10" x2="${L}" y2="${H-B}" stroke="#c4cde0"/><line x1="${L}" y1="${H-B}" x2="${W-5}" y2="${H-B}" stroke="#c4cde0"/></svg>`; area.innerHTML=g; }
  function show(){ const s=SC[si]; q.innerHTML=`<b>目的 ${si+1}/${SC.length}</b><span>${s.q}。どのグラフにする？</span>`; area.innerHTML=""; status.textContent=""; sel.querySelectorAll(".chip").forEach(c=>c.classList.remove("ok","ng","on")); }
  TYPES.forEach(([t,n])=>sel.append(h("button",{class:"chip", onclick:(e)=>{ draw(t); const s=SC[si]; sel.querySelectorAll(".chip").forEach(c=>c.classList.remove("ok","ng","on")); const ok=t===s.best; e.currentTarget.classList.add(ok?"ok":"ng"); status.className="status "+(ok?"ok":"ng"); const why={bar:"棒グラフは項目どうしの量を比べるのに向いています。",line:"折れ線グラフは時間による変化（推移）を見るのに向いています。",pie:"円グラフは全体に対する割合（構成比）を見るのに向いています。",scatter:"散布図は 2 つの量の関係（相関）を見るのに向いています。"}; status.innerHTML=(ok?"⭕ 適切！ ":"❌ この目的には「"+TYPES.find(x=>x[0]===s.best)[1]+"」が向いています。 ")+why[s.best]; }}, n)));
  el.append(q, sel, area, status, h("div",{class:"row"}, h("button",{class:"btn sm", onclick:()=>{ si=(si+1)%SC.length; show(); }},"次の目的 →"))); show();
};
})();

/* ============================================================ 6章：データベース */
(function(){
"use strict";
const h = (tag, attrs={}, ...kids)=>{ const el=document.createElement(tag); for(const k in attrs){ if(k==="class") el.className=attrs[k]; else if(k==="html") el.innerHTML=attrs[k]; else if(k.startsWith("on")) el.addEventListener(k.slice(2), attrs[k]); else el.setAttribute(k, attrs[k]); } kids.flat().forEach(c=>{ if(c!=null) el.append(c); }); return el; };
const sleep = ms=>new Promise(r=>setTimeout(r,ms));
function table(caption, cols, rows, opt={}){ const t=h("table"); if(caption) t.append(h("caption",{},caption)); t.append(h("tr",{}, ...cols.map(c=>h("th",{class:(opt.pk&&opt.pk.includes(c)?"pk ":"")+(opt.fk&&opt.fk.includes(c)?"fk ":"")+(opt.dimCols&&opt.dimCols.includes(c)?"dim":""), onclick:opt.onHead?()=>opt.onHead(c):null, style:opt.onHead?"cursor:pointer":""}, c)))); rows.forEach((r,i)=>t.append(h("tr",{class:opt.hit&&opt.hit(r,i)?"hit":""}, ...cols.map(c=>h("td",{class:(opt.dimCols&&opt.dimCols.includes(c)?"dim":"")+(opt.mark&&opt.mark(r,c)?" ":"") , style:opt.mark&&opt.mark(r,c)?"background:#fdecec;color:#9b2c31;font-weight:700":""}, r[c]==null||r[c]===""?"（空）":String(r[c])))))); return h("div",{class:"dbtbl"}, t); }

/* ---------- 6-2 主キー ---------- */
WIDGETS.keys = function(el){
  const cols=["学生番号","氏名","学科","生年月日","メールアドレス"];
  const rows=[ {学生番号:"S001",氏名:"佐藤 太郎",学科:"情報",生年月日:"2006-04-12",メールアドレス:"s001@example.ac.jp"}, {学生番号:"S002",氏名:"鈴木 花子",学科:"経営",生年月日:"2006-11-03",メールアドレス:"s002@example.ac.jp"}, {学生番号:"S003",氏名:"佐藤 太郎",学科:"情報",生年月日:"2005-08-21",メールアドレス:""}, {学生番号:"S004",氏名:"高橋 健",学科:"経営",生年月日:"2006-11-03",メールアドレス:"s004@example.ac.jp"} ];
  const status=h("div",{class:"status"}); let box;
  const verdict={ 学生番号:["ok","⭕ 主キーにできます。すべて異なり、空もありません。"], 氏名:["ng","❌ 「佐藤 太郎」が 2 人います（重複）。1 行に特定できません。"], 学科:["ng","❌ 同じ学科の学生が何人もいるので、重複します。"], 生年月日:["ng","❌ 同じ誕生日の学生（S002 と S004）がいて重複します。"], メールアドレス:["ng","❌ 値は重複していませんが、S003 が空（NULL）です。主キーは NULL を許しません。"] };
  function render(c){ if(box) box.remove(); box=table("学生表（列名をクリック）", cols, rows, {onHead:pick, dimCols:c?cols.filter(x=>x!==c):[], mark:(r,col)=>c===col && ((c==="氏名"&&r.氏名==="佐藤 太郎")||(c==="生年月日"&&r.生年月日==="2006-11-03")||(c==="メールアドレス"&&!r.メールアドレス))}); el.prepend(box); }
  function pick(c){ render(c); const v=verdict[c]; status.className="status "+v[0]; status.textContent=v[1]; }
  el.append(status, h("p",{class:"small muted"},"どの列なら「1 行をただ 1 つに特定」できるかを考えて、列名をクリックしてください。赤くなるのは、その列が主キーになれない理由の行です。")); render(null);
};

/* ---------- 6-3 正規化 ---------- */
WIDGETS.normalize = function(el){
  const base=[ {学生番号:"S001",氏名:"佐藤 太郎",科目コード:"C01",科目名:"情報リテラシー",担当:"田中"}, {学生番号:"S001",氏名:"佐藤 太郎",科目コード:"C02",科目名:"統計入門",担当:"山本"}, {学生番号:"S002",氏名:"鈴木 花子",科目コード:"C01",科目名:"情報リテラシー",担当:"田中"}, {学生番号:"S002",氏名:"鈴木 花子",科目コード:"C03",科目名:"英語Ⅰ",担当:"Smith"}, {学生番号:"S003",氏名:"高橋 健",科目コード:"C02",科目名:"統計入門",担当:"山本"} ];
  let flat=JSON.parse(JSON.stringify(base)); let students=[{学生番号:"S001",氏名:"佐藤 太郎"},{学生番号:"S002",氏名:"鈴木 花子"},{学生番号:"S003",氏名:"高橋 健"}]; const subjects=[{科目コード:"C01",科目名:"情報リテラシー",担当:"田中"},{科目コード:"C02",科目名:"統計入門",担当:"山本"},{科目コード:"C03",科目名:"英語Ⅰ",担当:"Smith"}]; const enroll=base.map(r=>({学生番号:r.学生番号,科目コード:r.科目コード}));
  const left=h("div",{class:"stack"}), right=h("div",{class:"stack"}), status=h("div",{class:"status"});
  function render(){ left.innerHTML=""; right.innerHTML="";
    const incons = flat.some(r=>flat.some(s=>s.学生番号===r.学生番号 && s.氏名!==r.氏名));
    left.append(h("b",{},"❌ 正規化していない 1 つの表（氏名が何度も出てくる）"), table("履修表（1 つの表）", ["学生番号","氏名","科目コード","科目名","担当"], flat, {mark:(r,c)=>c==="氏名"&&flat.some(s=>s.学生番号===r.学生番号&&s.氏名!==r.氏名)}));
    right.append(h("b",{},"⭕ 正規化した 3 つの表（氏名は学生表に 1 か所だけ）"), table("学生表",["学生番号","氏名"],students,{pk:["学生番号"]}), table("科目表",["科目コード","科目名","担当"],subjects,{pk:["科目コード"]}), table("履修表（学生番号＋科目コードが主キー）",["学生番号","科目コード"],enroll,{pk:["学生番号","科目コード"],fk:["学生番号","科目コード"]}));
    const joined=enroll.map(e=>({学生番号:e.学生番号, 氏名:students.find(s=>s.学生番号===e.学生番号).氏名, 科目名:subjects.find(s=>s.科目コード===e.科目コード).科目名}));
    right.append(table("結合して見たとき（矛盾なし）",["学生番号","氏名","科目名"],joined));
    status.className="status "+(incons?"ng":""); status.innerHTML = incons ? "⚠ 左の表では S001 の氏名が行によって食いちがっています（更新異常）。どちらが正しいか、表からは分かりません。" : ""; }
  const name=h("input",{type:"text", value:"佐藤 一郎", style:"width:160px"});
  el.append(h("p",{class:"small muted"},"S001 の学生が改名したとします。新しい氏名を入れて、それぞれの表で「直して」みましょう。"), h("div",{class:"row"}, h("label",{},"S001 の新しい氏名：",name), h("button",{class:"btn", onclick:()=>{ flat[0].氏名=name.value; render(); }},"左の表：1 行目だけ直す（直し忘れ）"), h("button",{class:"btn", onclick:()=>{ flat.forEach(r=>{ if(r.学生番号==="S001") r.氏名=name.value; }); render(); }},"左の表：全部の行を直す"), h("button",{class:"btn primary", onclick:()=>{ students[0].氏名=name.value; render(); }},"右の表：学生表の 1 か所を直す"), h("button",{class:"btn sm", onclick:()=>{ flat=JSON.parse(JSON.stringify(base)); students[0].氏名="佐藤 太郎"; render(); }},"リセット")), h("div",{class:"two"}, left, right), status); render();
};

/* ---------- 6-4 SQL ---------- */
WIDGETS.sql = function(el){
  const 学生=[ {学生番号:"S001",氏名:"佐藤 太郎",学年:1,学科コード:"D1",点数:82}, {学生番号:"S002",氏名:"鈴木 花子",学年:2,学科コード:"D2",点数:91}, {学生番号:"S003",氏名:"高橋 健",学年:2,学科コード:"D1",点数:58}, {学生番号:"S004",氏名:"田中 美咲",学年:1,学科コード:"D3",点数:74}, {学生番号:"S005",氏名:"伊藤 翔",学年:3,学科コード:"D2",点数:66}, {学生番号:"S006",氏名:"渡辺 結衣",学年:2,学科コード:"D3",点数:95} ];
  const 学科=[ {学科コード:"D1",学科名:"情報",校舎:"A棟"}, {学科コード:"D2",学科名:"経営",校舎:"B棟"}, {学科コード:"D3",学科名:"デザイン",校舎:"C棟"} ];
  const TABLES={学生,学科};
  const ta=h("textarea",{rows:"3", style:"width:100%", spellcheck:"false"}); ta.value="SELECT 氏名, 点数 FROM 学生 WHERE 学年 = 2";
  const out=h("div"), status=h("div",{class:"status"}), ops=h("div",{class:"row"});
  function run(){
    try{ const r=exec(ta.value); out.innerHTML=""; out.append(table(`結果：${r.rows.length} 行`, r.cols, r.rows)); status.className="status ok"; status.textContent=`✓ ${r.rows.length} 行が取り出されました`;
      ops.innerHTML=""; [["選択（行をしぼる）",r.where],["射影（列をしぼる）",r.proj],["結合（表をつなぐ）",r.join],["並べ替え",r.order]].forEach(([n,on])=>ops.append(h("span",{class:"pill "+(on?"ok":"")}, (on?"● ":"○ ")+n))); }
    catch(e){ status.className="status ng"; status.textContent="エラー："+e.message; out.innerHTML=""; ops.innerHTML=""; }
  }
  function exec(sql){
    sql=sql.trim().replace(/;$/,"").replace(/\s+/g," ");
    const m=/^SELECT\s+(.+?)\s+FROM\s+(\S+)(?:\s+JOIN\s+(\S+)\s+ON\s+(\S+)\s*=\s*(\S+))?(?:\s+WHERE\s+(.+?))?(?:\s+ORDER\s+BY\s+(\S+)(?:\s+(ASC|DESC))?)?$/i.exec(sql);
    if(!m) throw new Error("SELECT 列 FROM 表 [JOIN 表 ON 列=列] [WHERE 条件] [ORDER BY 列 [DESC]] の形で書いてください");
    const [,colsS,t1,t2,j1,j2,whereS,ordCol,ordDir]=m;
    if(!TABLES[t1]) throw new Error(`表「${t1}」はありません（学生・学科）`);
    let rows=TABLES[t1].map(r=>{ const o={}; for(const k in r){ o[k]=r[k]; o[t1+"."+k]=r[k]; } return o; });
    if(t2){ if(!TABLES[t2]) throw new Error(`表「${t2}」はありません`); const res=[]; rows.forEach(a=>TABLES[t2].forEach(b=>{ const o=Object.assign({},a); for(const k in b){ if(!(k in o)) o[k]=b[k]; o[t2+"."+k]=b[k]; } if(get(o,j1)==get(o,j2)) res.push(o); })); rows=res; }
    function get(o,name){ if(name in o) return o[name]; throw new Error(`列「${name}」はありません`); }
    function cond(o, s){ // AND / OR（左から順に、AND 優先）
      const ors=s.split(/\s+OR\s+/i); return ors.some(part=>part.split(/\s+AND\s+/i).every(c=>{ const cm=/^(\S+)\s*(<>|!=|>=|<=|=|<|>)\s*(.+)$/.exec(c.trim()); if(!cm) throw new Error(`条件「${c}」が読めません`); let [,col,op,val]=cm; val=val.trim().replace(/^['"](.*)['"]$/,"$1"); const a=get(o,col); const b=isNaN(+val)||val===""?val:+val; switch(op){ case "=":return a==b; case "<>": case "!=":return a!=b; case ">":return a>b; case "<":return a<b; case ">=":return a>=b; case "<=":return a<=b; } })); }
    if(whereS) rows=rows.filter(o=>cond(o,whereS));
    if(ordCol){ rows=rows.slice().sort((x,y)=>{ const a=get(x,ordCol), b=get(y,ordCol); return (a>b?1:a<b?-1:0)*(/DESC/i.test(ordDir||"")?-1:1); }); }
    let cols; const base1=Object.keys(TABLES[t1][0]), base2=t2?Object.keys(TABLES[t2][0]).filter(k=>!base1.includes(k)):[];
    if(colsS.trim()==="*") cols=base1.concat(base2); else { cols=colsS.split(",").map(s=>s.trim()); cols.forEach(c=>{ if(rows.length && !(c in rows[0])) { if(!(c in (TABLES[t1][0]))&&!(t2&&c in TABLES[t2][0])) throw new Error(`列「${c}」はありません`); } }); }
    return {cols, rows:rows.map(o=>{ const r={}; cols.forEach(c=>r[c]=o[c]); return r; }), where:!!whereS, proj:colsS.trim()!=="*", join:!!t2, order:!!ordCol};
  }
  const ex=[["全部","SELECT * FROM 学生"],["2年生の氏名（選択＋射影）","SELECT 氏名, 点数 FROM 学生 WHERE 学年 = 2"],["80点以上を高い順","SELECT 氏名, 点数 FROM 学生 WHERE 点数 >= 80 ORDER BY 点数 DESC"],["AND","SELECT 氏名 FROM 学生 WHERE 学年 = 2 AND 点数 >= 60"],["結合","SELECT 氏名, 学科名, 校舎 FROM 学生 JOIN 学科 ON 学生.学科コード = 学科.学科コード"]];
  el.append(h("div",{class:"two"}, table("学生表",["学生番号","氏名","学年","学科コード","点数"],学生,{pk:["学生番号"],fk:["学科コード"]}), table("学科表",["学科コード","学科名","校舎"],学科,{pk:["学科コード"]})), h("div",{class:"row"}, ...ex.map(e=>h("button",{class:"chip", onclick:()=>{ta.value=e[1]; run();}}, e[0]))), ta, h("div",{class:"row"}, h("button",{class:"btn primary", onclick:run},"▶ 実行"), ops), status, out, h("p",{class:"small muted"},"この教材の SQL は SELECT・FROM・JOIN ON・WHERE（AND / OR）・ORDER BY に対応した簡易版です。文字は '情報' のように引用符で囲みます。")); run();
};

/* ---------- 6-5 排他制御 ---------- */
WIDGETS.lock = function(el){
  let lock=true, running=false; const seg=h("div",{class:"seg"}); const b1=h("button",{class:"on", onclick:()=>{lock=true; sel();}},"ロックあり"), b2=h("button",{onclick:()=>{lock=false; sel();}},"ロックなし"); seg.append(b1,b2);
  function sel(){ b1.classList.toggle("on",lock); b2.classList.toggle("on",!lock); }
  const seat=h("div",{class:"bigval"}), logA=h("div",{class:"steps"}), logB=h("div",{class:"steps"}), status=h("div",{class:"status"});
  let seats=1, resv=0;
  function show(){ seat.innerHTML=`<div><div class="l">残席</div><div class="v">${seats}</div></div><div><div class="l">予約件数</div><div class="v">${resv}</div></div><div><div class="l">ロック</div><div class="v" style="font-size:18px">${lockedBy||"なし"}</div></div>`; }
  let lockedBy="";
  function add(log, t, cls){ log.append(h("div",{class:cls||"", html:t})); }
  async function run(){ if(running) return; running=true; seats=1; resv=0; lockedBy=""; logA.innerHTML=""; logB.innerHTML=""; status.textContent=""; show();
    if(!lock){
      add(logA,"👩 A：残席を読む → <b>1</b>（空いている！）"); await sleep(700); add(logB,"👨 B：残席を読む → <b>1</b>（空いている！）"); await sleep(700);
      add(logA,"👩 A：残席を 0 に更新して予約確定"); seats=0; resv++; show(); await sleep(700);
      add(logB,"👨 B：残席を 0 に更新して予約確定"); seats=0; resv++; show(); await sleep(500);
      status.className="status ng"; status.innerHTML="❌ 残席 1 なのに予約が 2 件 ── <b>ダブルブッキング</b>。B が読んだ「1」は、A の更新前の古い値でした。";
    } else {
      add(logA,"👩 A：残席データに<b>ロック</b>をかける 🔒"); lockedBy="A"; show(); await sleep(600); add(logA,"👩 A：残席を読む → <b>1</b>"); await sleep(600);
      add(logB,"👨 B：ロックをかけようとする → <span style='color:var(--warn)'>A が使用中。待つ… ⏳</span>"); await sleep(900);
      add(logA,"👩 A：残席を 0 に更新 → コミット → ロック解除 🔓"); seats=0; resv++; lockedBy=""; show(); await sleep(700);
      add(logB,"👨 B：ロックをかける 🔒 → 残席を読む → <b>0</b>"); lockedBy="B"; show(); await sleep(700);
      add(logB,"👨 B：満席なので予約できない → ロールバック → ロック解除 🔓"); lockedBy=""; show(); await sleep(400);
      status.className="status ok"; status.innerHTML="⭕ 予約は 1 件だけ。B は A の処理が終わるまで<b>待たされ</b>、最新の値（0）を読めたので矛盾が起きません。";
    } running=false; }
  show();
  el.append(h("div",{class:"row"}, seg, h("button",{class:"btn primary", onclick:run},"▶ A と B が同時に「最後の 1 席」を予約する")), seat, h("div",{class:"two"}, h("div",{}, h("b",{},"👩 A さんの処理"), logA), h("div",{}, h("b",{},"👨 B さんの処理"), logB)), status);
};
})();
