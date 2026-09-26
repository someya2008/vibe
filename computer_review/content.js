/* ============================================================
   content.js ── 各章の本文・図・体験コーナーの指定
   （クイズは quiz.js、体験コーナーの動きは widgets.js）
   ============================================================ */
const FINAL_N = 18;   // 総合テストの出題数（6章×3問）

const ICONS = {
  chip:`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="12" width="24" height="24" rx="4"/><rect x="19" y="19" width="10" height="10" rx="2"/><path d="M18 4v8M24 4v8M30 4v8M18 36v8M24 36v8M30 36v8M4 18h8M4 24h8M4 30h8M36 18h8M36 24h8M36 30h8"/></svg>`,
  binary:`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="8" width="10" height="14" rx="5"/><path d="M27 8v14M23 10l4-2"/><rect x="32" y="26" width="10" height="14" rx="5"/><path d="M11 26v14M7 28l4-2"/><rect x="19" y="26" width="10" height="14" rx="5" opacity=".45"/><path d="M40 8v14M36 10l4-2" opacity=".45"/></svg>`,
  folder:`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 14a4 4 0 0 1 4-4h9l4 4h15a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z"/><path d="M6 20h36"/><path d="M15 30h8M15 34h5" opacity=".6"/></svg>`,
  layers:`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M24 6 42 15 24 24 6 15z"/><path d="M6 24l18 9 18-9"/><path d="M6 33l18 9 18-9"/></svg>`,
  grid:`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="8" width="36" height="32" rx="3"/><path d="M6 18h36M6 28h36M18 8v32M30 8v32"/><path d="M21 33l3 3 5-6" stroke-width="3"/></svg>`,
  db:`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="24" cy="12" rx="16" ry="6"/><path d="M8 12v24c0 3.3 7.2 6 16 6s16-2.7 16-6V12"/><path d="M8 24c0 3.3 7.2 6 16 6s16-2.7 16-6"/></svg>`,
  hero:`<svg viewBox="0 0 360 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="hg1" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#3b7be9"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs>
    <ellipse cx="180" cy="270" rx="150" ry="16" fill="#e2e7f4"/>
    <rect x="50" y="40" width="260" height="170" rx="18" fill="#1c2333"/>
    <rect x="62" y="52" width="236" height="146" rx="10" fill="url(#hg1)"/>
    <rect x="150" y="212" width="60" height="22" fill="#c9d2e6"/><rect x="110" y="232" width="140" height="12" rx="6" fill="#aeb9d3"/>
    <g fill="#fff">
      <circle cx="140" cy="115" r="12"><animate attributeName="ry" dur="4s" repeatCount="indefinite" values="12;12;1;12;12" keyTimes="0;.45;.5;.55;1"/></circle>
      <circle cx="220" cy="115" r="12"><animate attributeName="ry" dur="4s" repeatCount="indefinite" values="12;12;1;12;12" keyTimes="0;.45;.5;.55;1"/></circle>
      <path d="M150 150 Q180 175 210 150" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none"/>
    </g>
    <g font-family="JetBrains Mono, monospace" font-weight="700" font-size="16" fill="#fff" opacity=".85">
      <text x="76" y="76">0110</text><text x="250" y="76">1001</text><text x="76" y="188">1010</text><text x="240" y="188">0011</text>
      <animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur="3s" repeatCount="indefinite"/>
    </g>
    <g transform="translate(20 120)"><rect width="46" height="30" rx="6" fill="#f0a020"/><rect x="6" y="6" width="20" height="4" rx="2" fill="#fff"/><animateTransform attributeName="transform" type="translate" values="20 120;20 110;20 120" dur="2.6s" repeatCount="indefinite"/></g>
    <g transform="translate(300 90)"><ellipse cx="22" cy="10" rx="22" ry="8" fill="#e5567a"/><path d="M0 10v26c0 4.4 9.8 8 22 8s22-3.6 22-8V10" fill="#e5567a"/><path d="M0 22c0 4.4 9.8 8 22 8s22-3.6 22-8" stroke="#fff" stroke-width="3" fill="none"/><animateTransform attributeName="transform" type="translate" values="300 90;300 82;300 90" dur="3.2s" repeatCount="indefinite"/></g>
  </svg>`
};

/* 図：五大装置 */
const FIG_FIVE = `<svg class="fig" viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" font-family="Zen Kaku Gothic New, Noto Sans JP, sans-serif" font-weight="700" font-size="15" id="fig5">
  <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5 0 10z" fill="#5b6579"/></marker>
  <marker id="arrc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5 0 10z" fill="#e5567a"/></marker></defs>
  <rect x="220" y="20" width="200" height="120" rx="14" fill="#e5efff" stroke="#3b7be9" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="320" y="42" text-anchor="middle" fill="#3b7be9" font-size="13">CPU（中央処理装置）</text>
  <g id="u-ctrl"><rect x="235" y="52" width="170" height="36" rx="8" fill="#fff" stroke="#e5567a" stroke-width="2"/><text x="320" y="76" text-anchor="middle" fill="#1c2333">制御装置</text></g>
  <g id="u-alu"><rect x="235" y="96" width="170" height="36" rx="8" fill="#fff" stroke="#3b7be9" stroke-width="2"/><text x="320" y="120" text-anchor="middle" fill="#1c2333">演算装置</text></g>
  <g id="u-mem"><rect x="220" y="180" width="200" height="50" rx="10" fill="#fff" stroke="#22a36b" stroke-width="2"/><text x="320" y="204" text-anchor="middle">主記憶装置</text><text x="320" y="222" text-anchor="middle" font-size="11" fill="#5b6579" font-weight="400">メモリ（プログラムとデータ）</text></g>
  <g id="u-in"><rect x="20" y="180" width="140" height="50" rx="10" fill="#fff" stroke="#f0a020" stroke-width="2"/><text x="90" y="204" text-anchor="middle">入力装置</text><text x="90" y="222" text-anchor="middle" font-size="11" fill="#5b6579" font-weight="400">キーボード・マウス</text></g>
  <g id="u-out"><rect x="480" y="180" width="140" height="50" rx="10" fill="#fff" stroke="#8b5cf6" stroke-width="2"/><text x="550" y="204" text-anchor="middle">出力装置</text><text x="550" y="222" text-anchor="middle" font-size="11" fill="#5b6579" font-weight="400">ディスプレイ・プリンタ</text></g>
  <g id="u-aux"><rect x="200" y="250" width="240" height="40" rx="10" fill="#fff" stroke="#22a36b" stroke-width="2" stroke-dasharray="5 3"/><text x="320" y="275" text-anchor="middle">補助記憶装置（SSD・HDD）</text></g>
  <g stroke="#5b6579" stroke-width="2.2" fill="none" marker-end="url(#arr)">
    <path id="p-in" d="M160 205 H218"/><path id="p-out" d="M422 205 H478"/>
    <path id="p-m2a" d="M300 178 V134"/><path id="p-a2m" d="M340 134 V178"/>
    <path d="M300 250 V232" /><path d="M340 232 V250"/>
  </g>
  <g stroke="#e5567a" stroke-width="1.8" fill="none" stroke-dasharray="4 3" marker-end="url(#arrc)" id="ctrl-lines">
    <path d="M235 70 H200 V170 H90 V178"/><path d="M405 70 H440 V170 H550 V178"/><path d="M320 88 V96"/><path d="M215 70 V205 H218" opacity="0"/><path d="M235 62 H190 V205 H215" opacity="0"/><path d="M320 140 V178" transform="translate(-60 0)" opacity="0"/><path d="M260 132 V178"/>
  </g>
  <text x="30" y="30" font-size="12" fill="#5b6579" font-weight="400">── データの流れ　<tspan fill="#e5567a">- - 制御の流れ</tspan></text>
  <circle id="dot" r="8" fill="#f0a020" stroke="#fff" stroke-width="2" opacity="0"/>
</svg>`;

/* 図：記憶階層ピラミッド */
const FIG_PYRAMID = `<svg class="fig" viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg" font-family="Zen Kaku Gothic New, Noto Sans JP, sans-serif" font-weight="700" font-size="15">
  <g id="pyr">
    <polygon points="320,20 380,70 260,70" fill="#3b7be9"/><text x="320" y="55" text-anchor="middle" fill="#fff" font-size="13">レジスタ</text>
    <polygon points="255,78 385,78 420,128 220,128" fill="#5a93ee"/><text x="320" y="108" text-anchor="middle" fill="#fff">キャッシュメモリ</text>
    <polygon points="214,136 426,136 464,186 176,186" fill="#8fb6f3"/><text x="320" y="166" text-anchor="middle" fill="#1c2333">主記憶（メインメモリ）</text>
    <polygon points="170,194 470,194 510,244 130,244" fill="#c9dcf8"/><text x="320" y="224" text-anchor="middle" fill="#1c2333">補助記憶（SSD・HDD）</text>
  </g>
  <g font-size="13" fill="#5b6579" font-weight="400">
    <text x="30" y="40">↑ 速い</text><text x="30" y="60">↑ 高価（容量あたり）</text><text x="30" y="80">↑ 容量が小さい</text>
    <text x="30" y="200">↓ 遅い</text><text x="30" y="220">↓ 安価（容量あたり）</text><text x="30" y="240">↓ 容量が大きい</text>
    <text x="530" y="60">CPU の中</text><text x="530" y="160">電源を切ると</text><text x="530" y="178">消える（揮発性）</text><text x="530" y="222">電源を切っても</text><text x="530" y="240">残る（不揮発性）</text>
  </g>
</svg>`;

/* 図：ディレクトリの木 */
const FIG_TREE = `<svg class="fig" viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg" font-family="JetBrains Mono, monospace" font-weight="700" font-size="14">
  <g stroke="#c4cde0" stroke-width="2" fill="none"><path d="M320 52 V80 H160 V108 M320 80 V108 M320 80 H480 V108 M160 140 V170 H100 V196 M160 170 H220 V196 M480 140 V170 H420 V196 M480 170 H540 V196"/></g>
  <g>
    <rect x="270" y="20" width="100" height="32" rx="8" fill="#f0a020"/><text x="320" y="42" text-anchor="middle" fill="#fff">/（ルート）</text>
    <rect x="110" y="108" width="100" height="32" rx="8" fill="#fff3dc" stroke="#f0a020" stroke-width="2"/><text x="160" y="130" text-anchor="middle">home</text>
    <rect x="270" y="108" width="100" height="32" rx="8" fill="#fff3dc" stroke="#f0a020" stroke-width="2"/><text x="320" y="130" text-anchor="middle">etc</text>
    <rect x="430" y="108" width="100" height="32" rx="8" fill="#fff3dc" stroke="#f0a020" stroke-width="2"/><text x="480" y="130" text-anchor="middle">usr</text>
    <rect x="50" y="196" width="100" height="32" rx="8" fill="#fff3dc" stroke="#f0a020" stroke-width="2"/><text x="100" y="218" text-anchor="middle">taro</text>
    <rect x="170" y="196" width="100" height="32" rx="8" fill="#fff3dc" stroke="#f0a020" stroke-width="2"/><text x="220" y="218" text-anchor="middle">hanako</text>
    <rect x="370" y="196" width="100" height="32" rx="8" fill="#fff" stroke="#8b5cf6" stroke-width="2"/><text x="420" y="218" text-anchor="middle" fill="#8b5cf6">bin</text>
    <rect x="490" y="196" width="100" height="32" rx="8" fill="#fff" stroke="#8b5cf6" stroke-width="2"/><text x="540" y="218" text-anchor="middle" fill="#8b5cf6">lib</text>
  </g>
  <text x="20" y="240" font-family="Noto Sans JP, sans-serif" font-size="12" fill="#5b6579" font-weight="400">上ほど「親」、下ほど「子」。木を逆さにした形なので「木構造（ツリー構造）」とよぶ</text>
</svg>`;

/* 図：ソフトウェアの層 */
const FIG_LAYERS = `<svg class="fig" viewBox="0 0 640 230" xmlns="http://www.w3.org/2000/svg" font-family="Zen Kaku Gothic New, Noto Sans JP, sans-serif" font-weight="700" font-size="15">
  <g>
    <rect x="120" y="14" width="400" height="40" rx="10" fill="#fff" stroke="#22a36b" stroke-width="2"/><text x="320" y="40" text-anchor="middle">👤 利用者（ユーザ）</text>
    <rect x="120" y="62" width="400" height="40" rx="10" fill="#e2f7ec" stroke="#22a36b" stroke-width="2"/><text x="320" y="88" text-anchor="middle">応用ソフトウェア（アプリ）</text>
    <rect x="120" y="110" width="400" height="34" rx="10" fill="#f0fbf5" stroke="#22a36b" stroke-width="2" stroke-dasharray="5 3"/><text x="320" y="133" text-anchor="middle" font-size="14">ミドルウェア（DBMS・Webサーバなど）</text>
    <rect x="120" y="152" width="400" height="40" rx="10" fill="#22a36b"/><text x="320" y="178" text-anchor="middle" fill="#fff">基本ソフトウェア（OS）</text>
    <rect x="120" y="200" width="400" height="26" rx="8" fill="#1c2333"/><text x="320" y="218" text-anchor="middle" fill="#fff" font-size="13">ハードウェア（CPU・メモリ・ディスク・周辺機器）</text>
  </g>
  <g font-size="12" fill="#5b6579" font-weight="400"><text x="530" y="90">ワープロ・表計算・</text><text x="530" y="106">ブラウザ・ゲーム</text><text x="530" y="176">Windows・macOS・</text><text x="530" y="192">Linux・iOS・Android</text><text x="20" y="176">ハードを管理し</text><text x="20" y="192">アプリに共通機能を提供</text></g>
</svg>`;

const CHAPTERS = [
/* ============================================================ 1. ハードウェア */
{ id:"hw", no:1, icon:"chip", title:"コンピュータ（ハードウェア）", lead:"五大装置・CPU・メモリ・記憶装置・入出力",
  intro:"コンピュータは「入力 → 記憶 → 演算 → 出力」を制御装置が指揮して動く機械です。まず全体の構造を思い出し、CPU と記憶装置のしくみ、周辺機器の役割を確認します。",
  sections:[
  { title:"コンピュータの五大装置", short:"五大装置", widget:"fiveUnits", labTitle:"データの流れを動かしてみよう",
    html:`<div class="prose">
      <p>コンピュータのハードウェアは、はたらきによって <b>5つの装置</b> に分けられます。これを <b>五大装置</b> といいます。</p>
      <table><tr><th>装置</th><th>役割</th><th>例</th></tr>
      <tr><td><b>入力装置</b></td><td>外からデータや指示を受け取る</td><td>キーボード、マウス、タッチパネル、スキャナ、マイク</td></tr>
      <tr><td><b>記憶装置</b></td><td>プログラムとデータをたくわえる（主記憶と補助記憶）</td><td>メモリ（RAM）、SSD、HDD</td></tr>
      <tr><td><b>演算装置</b></td><td>四則演算や比較（大小・等しい）を行う</td><td rowspan="2">CPU（中央処理装置）</td></tr>
      <tr><td><b>制御装置</b></td><td>プログラムの命令を解読し、他の装置に指示を出す</td></tr>
      <tr><td><b>出力装置</b></td><td>処理の結果を外に出す</td><td>ディスプレイ、プリンタ、スピーカ</td></tr></table>
      <div class="point"><b>ポイント</b><span>演算装置と制御装置をまとめて <b>CPU</b> とよびます。プログラムもデータも、いったん<b>主記憶装置</b>に置いてから CPU が処理します（プログラム内蔵方式）。</span></div>
      <details class="why"><summary>なぜ「主記憶」と「補助記憶」に分かれているの？</summary><p>CPU はとても高速なので、それに近い速さで読み書きできるメモリ（主記憶）が必要です。しかし高速なメモリは高価で、しかも電源を切ると内容が消えます（揮発性）。そこで、電源を切っても残り（不揮発性）、安く大容量にできる SSD や HDD を「補助記憶」として組み合わせています。</p></details>
    </div>${FIG_FIVE}` },
  { title:"CPU（中央処理装置）の性能", short:"CPU", widget:"clock", labTitle:"クロック周波数を変えてみよう",
    html:`<div class="prose">
      <p>CPU は「コンピュータの頭脳」。<b>制御装置＋演算装置</b> のはたらきをする部品で、主記憶から命令を1つずつ取り出して（フェッチ）、解読し（デコード）、実行する、をくり返しています。</p>
      <ul>
        <li><b>クロック周波数</b>：CPU が動作のタイミングを合わせる信号（クロック）が1秒間に何回打たれるか。単位は <b>Hz（ヘルツ）</b>。3 GHz なら 1秒間に 30億回。<mark>同じ設計の CPU なら、クロック周波数が高いほど処理が速い</mark>。</li>
        <li><b>コア数</b>：CPU の中にある「処理を行う部分」の数。マルチコアなら複数の処理を同時に進められる。</li>
        <li><b>ビット数（32ビット／64ビット）</b>：CPU が一度に扱えるデータの幅。64ビット CPU は扱えるメモリの量も大きい。</li>
        <li><b>キャッシュメモリ</b>：CPU と主記憶の速度差を埋めるため、CPU の近くに置く小さくて速いメモリ。</li>
      </ul>
      <details class="why"><summary>クロック周波数が同じなら性能も同じ？</summary><p>いいえ。1クロックで進められる仕事の量は CPU の設計（アーキテクチャ）によって違います。またコア数やキャッシュの量も性能に大きく影響します。クロック周波数は「同じ設計どうしを比べるときの目安」と覚えておきましょう。</p></details>
    </div>` },
  { title:"記憶装置の階層（メモリの種類）", short:"記憶の階層", widget:"memHier", labTitle:"取り出す速さを比べてみよう",
    html:`<div class="prose">
      <p>記憶装置は「速いが高くて小さい」ものと「遅いが安くて大きい」ものを組み合わせて使います。これを <b>記憶階層</b> といいます。</p>
      ${FIG_PYRAMID}
      <table><tr><th>種類</th><th>主な用途</th><th>特徴</th></tr>
      <tr><td><b>RAM</b>（Random Access Memory）</td><td>主記憶</td><td>読み書き自由。<b>揮発性</b>（電源を切ると消える）</td></tr>
      <tr><td>　DRAM</td><td>主記憶（メインメモリ）</td><td>安価で大容量。定期的な再書き込み（リフレッシュ）が必要</td></tr>
      <tr><td>　SRAM</td><td>キャッシュメモリ</td><td>高速だが高価。リフレッシュ不要</td></tr>
      <tr><td><b>ROM</b>（Read Only Memory）</td><td>起動プログラム（ファームウェア）など</td><td>読み出し専用。<b>不揮発性</b></td></tr>
      <tr><td><b>フラッシュメモリ</b></td><td>SSD、USB メモリ、SD カード</td><td>書き換えできる不揮発性メモリ</td></tr></table>
      <div class="point"><b>覚え方</b><span>「揮発」はガソリンが蒸発するイメージ。<b>揮発性＝電源を切ると消える</b>。主記憶（RAM）は揮発性、だからファイルは補助記憶に「保存」する必要があります。</span></div>
    </div>` },
  { title:"補助記憶装置のいろいろ", short:"補助記憶",
    html:`<div class="prose">
      <table><tr><th>装置</th><th>しくみ</th><th>長所</th><th>短所</th></tr>
      <tr><td><b>HDD</b>（ハードディスク）</td><td>磁気ディスクを回転させ、磁気ヘッドで読み書き</td><td>大容量で安い</td><td>機械部品があるので遅く、衝撃に弱い、音がする</td></tr>
      <tr><td><b>SSD</b></td><td>フラッシュメモリに電気的に記録</td><td>高速、静か、衝撃に強い、省電力</td><td>容量あたりの価格は HDD より高い、書き換え回数に上限</td></tr>
      <tr><td><b>光ディスク</b>（CD／DVD／BD）</td><td>レーザ光でディスク表面を読む</td><td>安価で配布・保存に向く</td><td>容量が小さい（CD 約700MB、DVD 4.7GB、BD 25GB ※片面1層）、遅い</td></tr>
      <tr><td><b>USB メモリ・SD カード</b></td><td>フラッシュメモリ</td><td>小さくて持ち運びやすい</td><td>紛失・破損しやすい</td></tr></table>
      <details class="why"><summary>SSD が HDD より速い根拠は？</summary><p>HDD は「目的の場所までヘッドを動かし、ディスクが回ってくるのを待つ」という<b>機械的な動作</b>が必要で、これに数ミリ秒かかります。SSD は電気信号だけでデータの場所にアクセスできるので、待ち時間が桁ちがいに短くなります（およそ0.1ミリ秒以下）。</p></details>
    </div>` },
  { title:"入出力装置とインタフェース", short:"入出力", widget:"sorter", labTitle:"仕分けゲーム：この装置はどれ？",
    html:`<div class="prose">
      <p>コンピュータ本体の外側でデータの出し入れをする機器を <b>周辺機器</b> といいます。本体とつなぐ規格（接続の決まり）を <b>インタフェース</b> といいます。</p>
      <table><tr><th>インタフェース</th><th>用途・特徴</th></tr>
      <tr><td><b>USB</b></td><td>最も一般的な有線接続。キーボード、マウス、USB メモリ、プリンタなど。電源を入れたまま抜き差しできる（ホットプラグ）。給電もできる。</td></tr>
      <tr><td><b>HDMI</b></td><td>映像と音声をデジタルのまま1本で送る。ディスプレイ・プロジェクタ・テレビ。</td></tr>
      <tr><td><b>Bluetooth</b></td><td>近距離（約10m）の無線。イヤホン、マウス、キーボード。</td></tr>
      <tr><td><b>Wi-Fi（無線 LAN）</b></td><td>無線でネットワークにつなぐ。後期に詳しく学びます。</td></tr></table>
      <div class="point"><b>分類のコツ</b><span>「コンピュータ<b>に入れる</b>」なら入力装置、「コンピュータ<b>から出す</b>」なら出力装置。タッチパネルは、指の位置を入力するセンサと、表示する画面（出力）が組み合わさったものです。</span></div>
    </div>` },
  ]},

/* ============================================================ 2. デジタルデータ */
{ id:"data", no:2, icon:"binary", title:"デジタルデータの表し方", lead:"2進数・16進数・単位・文字・画像・音",
  intro:"コンピュータの中では、文字も画像も音も、すべて 0 と 1 の並びで表されています。「なぜ 0 と 1 なのか」「どうやって数・文字・画像・音を 0 と 1 にするのか」を、スイッチを動かしながら思い出しましょう。",
  sections:[
  { title:"アナログとデジタル、ビットとバイト", short:"ビットとバイト", widget:"bits", labTitle:"8個のスイッチで数を作ろう",
    html:`<div class="prose">
      <p><b>アナログ</b>は連続的に変化する量（時計の針、水銀の温度計）、<b>デジタル</b>は飛び飛びの値（数字）で表したものです。コンピュータは電気の ON／OFF で情報を扱うので、<b>2進数（0 と 1）</b> がもっとも都合がよいのです。</p>
      <ul>
        <li><b>1ビット（bit）</b>：0 か 1 の1けた。情報の最小単位。</li>
        <li><b>1バイト（byte）</b>＝ <b>8ビット</b>。2<sup>8</sup> ＝ <b>256</b> 通りを表せる（0〜255）。</li>
        <li>一般に n ビットで <b>2<sup>n</sup></b> 通り。ビットが1つ増えるごとに表せる数は2倍になる。</li>
      </ul>
      <div class="point"><b>2進数の各けたの重み</b><span>右から 1, 2, 4, 8, 16, 32, 64, 128 … と、けたが上がるごとに2倍。10進数の 1, 10, 100 … の「10」が「2」になっただけです。</span></div>
    </div>` },
  { title:"基数変換（2進数・10進数・16進数）", short:"基数変換", widget:"radix", labTitle:"10進数を入れると、変換の手順をアニメーションで表示",
    html:`<div class="prose">
      <ul>
        <li><b>2進数 → 10進数</b>：各けたに重みを掛けて足す。例：1011<sub>(2)</sub> ＝ 8＋0＋2＋1 ＝ 11。</li>
        <li><b>10進数 → 2進数</b>：2 で割った<b>余り</b>を、商が 0 になるまで書き出し、<b>下から順に</b>読む。</li>
        <li><b>16進数</b>：0〜9 のあとに A〜F（10〜15）を使う。2進数 <b>4けたが 16進数 1けた</b>にぴったり対応するので、長い 2進数を短く書くために使う（例：1111 1010<sub>(2)</sub> ＝ FA<sub>(16)</sub> ＝ 250）。</li>
      </ul>
      <table><tr><th>10進</th><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td></tr>
      <tr><th>2進</th><td>0000</td><td>0001</td><td>0010</td><td>0011</td><td>0100</td><td>0101</td><td>0110</td><td>0111</td><td>1000</td><td>1001</td><td>1010</td><td>1011</td><td>1100</td><td>1101</td><td>1110</td><td>1111</td></tr>
      <tr><th>16進</th><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>A</td><td>B</td><td>C</td><td>D</td><td>E</td><td>F</td></tr></table>
      <details class="why"><summary>なぜ「2で割った余り」で2進数になるの？</summary><p>10進数の 13 を 2 で割ると「6 余り 1」。この余り 1 は「2 でまとめられずに残った 1 のけた」、つまり 2進数の最下位のけたです。商の 6 をさらに 2 で割ると、次のけたが決まります。これをくり返すと、下のけたから順に決まっていくので「下から読む」のです。</p></details>
    </div>` },
  { title:"データ量の単位と補助単位", short:"単位", widget:"units", labTitle:"バイト数を入れると、単位を換算",
    html:`<div class="prose">
      <table><tr><th>記号</th><th>読み</th><th>大きさ</th><th>記号</th><th>読み</th><th>大きさ</th></tr>
      <tr><td>k</td><td>キロ</td><td>10<sup>3</sup>（千）</td><td>m</td><td>ミリ</td><td>10<sup>-3</sup></td></tr>
      <tr><td>M</td><td>メガ</td><td>10<sup>6</sup>（百万）</td><td>μ</td><td>マイクロ</td><td>10<sup>-6</sup></td></tr>
      <tr><td>G</td><td>ギガ</td><td>10<sup>9</sup>（十億）</td><td>n</td><td>ナノ</td><td>10<sup>-9</sup></td></tr>
      <tr><td>T</td><td>テラ</td><td>10<sup>12</sup>（一兆）</td><td>p</td><td>ピコ</td><td>10<sup>-12</sup></td></tr></table>
      <p>大きい単位はデータ量（バイト）や周波数（Hz）に、小さい単位は時間（秒）に使います。例：3 GHz ＝ 3×10<sup>9</sup> Hz、アクセス時間 10 ns ＝ 10×10<sup>-9</sup> 秒。</p>
      <div class="point"><b>1024 の話</b><span>コンピュータでは 2<sup>10</sup> ＝ 1024 を「キロ」として扱う場面もあります（メモリ容量など）。区別するときは <b>KiB（キビバイト）＝1024 バイト</b>、<b>kB＝1000 バイト</b> と書きます。試験では「1 kB ＝ 1000 バイト」「1 KiB ＝ 1024 バイト」のように問題文の指定に従いましょう。</span></div>
    </div>` },
  { title:"負の数の表し方（2の補数）", short:"補数",
    html:`<div class="prose">
      <p>コンピュータにはマイナス記号がありません。そこで <b>2の補数</b> という表し方で負の数を扱います。</p>
      <ol>
        <li>絶対値を2進数で書く：5 → 0000 0101</li>
        <li>0 と 1 を反転する：1111 1010</li>
        <li>1 を足す：<b>1111 1011</b> ＝ −5</li>
      </ol>
      <p>こうすると <b>引き算を足し算で計算できます</b>。3 − 5 は 3 ＋ (−5) ＝ 0000 0011 ＋ 1111 1011 ＝ 1111 1110 ＝ −2。8ビットの2の補数で表せる範囲は <b>−128〜127</b> です。<b>先頭のビットが 1 なら負の数</b>と分かります。</p>
      <div class="point"><b>体験</b><span>2-1 のスイッチのコーナーで「2の補数」モードに切りかえると、同じビット列が負の数として読める様子を確かめられます。</span></div>
    </div>` },
  { title:"文字の表し方（文字コード）", short:"文字コード", widget:"charcode", labTitle:"文字を入れると、コンピュータの中の数（バイト列）を表示",
    html:`<div class="prose">
      <p>文字も、1文字ずつ番号（<b>文字コード</b>）を決めて数で表します。どの番号がどの文字かを決めた表が「文字コード体系」です。</p>
      <table><tr><th>文字コード</th><th>特徴</th></tr>
      <tr><td><b>ASCII</b></td><td>7ビットで 128 文字。英数字と記号。「A」＝ 65（16進で 41）。世界中の文字コードの基礎。</td></tr>
      <tr><td><b>JIS／Shift_JIS／EUC-JP</b></td><td>日本語（ひらがな・カタカナ・漢字）を <b>2バイト</b>で表す、日本独自の体系。</td></tr>
      <tr><td><b>Unicode</b>（UTF-8、UTF-16）</td><td>世界中の文字を1つの表に集めたもの。<b>UTF-8</b> は Web の標準で、英数字は1バイト、日本語はふつう3バイト、絵文字は4バイト。</td></tr></table>
      <details class="why"><summary>「文字化け」はなぜ起こる？</summary><p>書いた側と読む側で<b>ちがう文字コード表</b>を使うと、同じ数がちがう文字に対応づけられてしまうからです。たとえば Shift_JIS で保存した「あ」（82 A0）を UTF-8 として読むと、対応する文字がなく意味不明な記号になります。</p></details>
    </div>` },
  { title:"画像の表し方", short:"画像", widget:"image", labTitle:"色と解像度を動かしてみよう",
    html:`<div class="prose">
      <p>画像は小さな点（<b>画素、ピクセル</b>）の集まりで、各画素の色を数で表します。</p>
      <ul>
        <li><b>解像度</b>：画素の数（例：1920×1080）。多いほど細かい表現ができるがデータ量も増える。</li>
        <li><b>色の表し方</b>：光の三原色 <b>R（赤）G（緑）B（青）</b> の強さを組み合わせる（<b>加法混色</b>。全部最大で白）。各色を 8ビット（0〜255）で表すと 8×3 ＝ <b>24ビット</b>、2<sup>24</sup> ＝ <b>約1677万色</b>（フルカラー）。</li>
        <li><b>データ量</b>＝ 画素数 × 1画素あたりのビット数。例：1920×1080 画素 × 24ビット ＝ 49,766,400 ビット ≒ <b>6.2 MB</b>（圧縮しない場合）。</li>
        <li><b>ファイル形式</b>：JPEG（写真向き・非可逆圧縮）、PNG（可逆圧縮・透明あり）、GIF（256色・アニメ）。</li>
      </ul>
      <div class="point"><b>色深度と色数</b><span>1ビット → 2色、8ビット → 256 色、24ビット → 16,777,216 色。ビットが1つ増えると色数は2倍です。</span></div>
    </div>` },
  { title:"音の表し方（標本化・量子化・符号化）", short:"音", widget:"sound", labTitle:"サンプリング周波数と量子化ビット数を動かしてみよう",
    html:`<div class="prose">
      <p>音（空気の振動）はアナログな波です。これをデジタルにするには、次の3ステップ（<b>PCM</b> 方式）を行います。</p>
      <ol>
        <li><b>標本化（サンプリング）</b>：一定の時間ごとに波の高さを測る。1秒間に測る回数が<b>サンプリング周波数</b>（CD は 44.1 kHz ＝ 1秒に 44,100 回）。</li>
        <li><b>量子化</b>：測った高さを、決められた段階（目盛り）のうち一番近い値に丸める。段階の細かさが<b>量子化ビット数</b>（CD は 16 ビット ＝ 65,536 段階）。</li>
        <li><b>符号化</b>：その値を 2進数で表す。</li>
      </ol>
      <p><b>データ量</b>＝ サンプリング周波数 × 量子化ビット数 × チャネル数 × 秒数。CD 音質（44.1 kHz、16 ビット、ステレオ 2ch）の1秒 ＝ 44,100×16×2 ＝ 1,411,200 ビット ≒ <b>176 kB</b>。</p>
      <details class="why"><summary>サンプリング周波数はなぜ 44.1 kHz？</summary><p>人が聞こえる音は最高で約 20 kHz。「元の波を再現するには、最高周波数の<b>2倍以上</b>の周波数で標本化する必要がある」という<b>標本化定理</b>から、20 kHz の 2 倍＝40 kHz より少し余裕をもたせて 44.1 kHz が選ばれました。</p></details>
    </div>` },
  ]},

/* ============================================================ 3. ファイルとディレクトリ */
{ id:"file", no:3, icon:"folder", title:"ファイルとディレクトリ", lead:"階層構造・パス・拡張子・圧縮とバックアップ",
  intro:"コンピュータはデータを「ファイル」という単位で保存し、「ディレクトリ（フォルダ）」で整理します。ファイルの場所を正確に指し示す「パス」の書き方を、木をたどりながら復習します。",
  sections:[
  { title:"ファイルとディレクトリの階層構造", short:"階層構造",
    html:`<div class="prose">
      <ul>
        <li><b>ファイル</b>：データやプログラムを保存する単位。名前がついている。</li>
        <li><b>ディレクトリ</b>（Windows では<b>フォルダ</b>）：ファイルやディレクトリを入れる「入れ物」。中にディレクトリを入れられるので、<b>階層構造（木構造）</b>になる。</li>
        <li><b>ルートディレクトリ</b>：いちばん上（根っこ）のディレクトリ。「/」（Windows では「C:\\」など）で表す。</li>
        <li><b>サブディレクトリ</b>：あるディレクトリの中にあるディレクトリ。</li>
        <li><b>カレントディレクトリ</b>：今、自分が作業している（いる）ディレクトリ。</li>
      </ul>
      ${FIG_TREE}
      <div class="point"><b>なぜ階層にするの？</b><span>ファイルが何千個もあると、平らに並べただけでは探せません。「学部 → 学科 → 学年」のように分類しておけば、同じ名前のファイルも別の場所なら共存できます。</span></div>
    </div>` },
  { title:"パス（絶対パスと相対パス）", short:"パス", widget:"path", labTitle:"木の中を移動して、パスを答えよう",
    html:`<div class="prose">
      <p><b>パス</b>はファイルやディレクトリの「住所」。ディレクトリ名を区切り文字（<b>/</b>、Windows は <b>\\</b>）でつないで書きます。</p>
      <table><tr><th></th><th>絶対パス</th><th>相対パス</th></tr>
      <tr><th>起点</th><td><b>ルート</b>から</td><td><b>カレントディレクトリ</b>から</td></tr>
      <tr><th>書き方</th><td>先頭が「/」で始まる<br><code>/home/taro/report.txt</code></td><td>先頭に「/」がない<br><code>taro/report.txt</code>（カレントが /home のとき）</td></tr>
      <tr><th>特徴</th><td>どこにいても同じ書き方で確実</td><td>短く書ける。カレントが変わると指す先も変わる</td></tr></table>
      <ul>
        <li><code>.</code>（ドット1つ）＝ カレントディレクトリ自身</li>
        <li><code>..</code>（ドット2つ）＝ 1つ上（親）のディレクトリ。<code>../hanako/memo.txt</code> は「1つ上に行って、hanako の中の memo.txt」</li>
      </ul>
      <div class="point"><b>見分け方</b><span>先頭が「/」なら絶対パス、そうでなければ相対パス。相対パスは「今いる場所」がわからないと解けないので、問題文のカレントディレクトリを必ず確認しましょう。</span></div>
    </div>` },
  { title:"拡張子とファイル形式", short:"拡張子", widget:"ext", labTitle:"拡張子マッチング",
    html:`<div class="prose">
      <p>ファイル名の末尾の「.」以降を <b>拡張子</b> といい、ファイルの種類（形式）を表します。OS は拡張子を見て、開くアプリを決めます。</p>
      <table><tr><th>種類</th><th>拡張子</th></tr>
      <tr><td>テキスト</td><td>.txt（文字だけ）、.csv（カンマ区切りの表データ）、.html（Web ページ）</td></tr>
      <tr><td>文書・表・発表</td><td>.docx（Word）、.xlsx（Excel）、.pptx（PowerPoint）、.pdf（配布用文書）</td></tr>
      <tr><td>画像</td><td>.jpg／.jpeg（写真）、.png（図・透明）、.gif（アニメ）、.svg（ベクタ画像）</td></tr>
      <tr><td>音声・動画</td><td>.mp3、.wav（音声）、.mp4（動画）</td></tr>
      <tr><td>圧縮</td><td>.zip（複数ファイルをまとめて圧縮）</td></tr>
      <tr><td>プログラム</td><td>.exe（Windows の実行ファイル）、.py、.js など（ソースコード）</td></tr></table>
      <p class="small muted">ワイルドカード：<code>*.jpg</code> のように「*」を使うと「拡張子が jpg のすべてのファイル」を表せます（「?」は任意の1文字）。</p>
    </div>` },
  { title:"圧縮・バックアップ・アクセス権", short:"圧縮と管理",
    html:`<div class="prose">
      <ul>
        <li><b>圧縮</b>：データ量を減らすこと。<b>可逆圧縮</b>（ZIP、PNG：完全に元に戻せる）と<b>非可逆圧縮</b>（JPEG、MP3：人が気づきにくい情報を捨てて大きく減らす。元には戻らない）がある。</li>
        <li><b>バックアップ</b>：故障・誤操作・ウイルスに備えて、データの複製を別の場所に保存すること。<b>フルバックアップ</b>（全部）、<b>差分</b>（前回のフルからの変化分）、<b>増分</b>（前回のバックアップからの変化分）。</li>
        <li><b>アクセス権</b>：ファイルごとに「誰が」「読む・書く・実行する」をできるかを決めるしくみ。共有のコンピュータで、他人のファイルを勝手に書き換えられないようにする。</li>
      </ul>
      <div class="point"><b>3-2-1 ルール</b><span>大切なデータは <b>3</b>つのコピーを、<b>2</b>種類以上の媒体に、うち<b>1</b>つは別の場所（クラウドなど）に。USB メモリ1本だけに保存するのは「バックアップ」とはいえません。</span></div>
    </div>` },
  ]},

/* ============================================================ 4. OS とアプリケーション */
{ id:"os", no:4, icon:"layers", title:"OSとアプリケーション", lead:"ソフトウェアの分類・OSの役割・UI・ライセンス",
  intro:"ハードウェアは、ソフトウェアがなければただの箱です。ソフトウェアを「基本ソフト（OS）」と「応用ソフト（アプリ）」に分け、OS が裏側で何をしているのかを、積み木とタイムラインで確かめます。",
  sections:[
  { title:"ソフトウェアの分類（層の構造）", short:"ソフトの分類", widget:"layers", labTitle:"積み木を正しい順に積もう",
    html:`<div class="prose">
      <p>ソフトウェアは、ハードウェアの上に<b>層（レイヤ）</b>のように積み重なっています。</p>
      ${FIG_LAYERS}
      <ul>
        <li><b>基本ソフトウェア（OS：オペレーティングシステム）</b>：ハードウェアを直接管理し、アプリに共通の機能を提供する。Windows、macOS、Linux、iOS、Android など。</li>
        <li><b>ミドルウェア</b>：OS とアプリの中間で、多くのアプリが共通に使う機能を提供する。DBMS（データベース管理システム）、Web サーバなど。</li>
        <li><b>応用ソフトウェア（アプリケーション）</b>：利用者の目的に直接役立つソフト。ワープロ、表計算、ブラウザ、ゲームなど。</li>
      </ul>
      <div class="point"><b>なぜ層に分けるの？</b><span>アプリを作る人が、キーボードの読み取りやディスクへの書き込みを毎回ゼロから作るのは大変です。OS がその部分を引き受け、<b>API</b>（アプリから OS の機能を呼び出す窓口）として提供することで、どのアプリも同じやり方でハードウェアを使えます。</span></div>
    </div>` },
  { title:"OS の役割", short:"OSの役割", widget:"multitask", labTitle:"マルチタスク：CPU はどう切りかえている？",
    html:`<div class="prose">
      <table><tr><th>役割</th><th>内容</th></tr>
      <tr><td><b>ハードウェアの管理</b></td><td>CPU・メモリ・入出力装置を管理する。周辺機器ごとの制御プログラムを <b>デバイスドライバ</b> という。</td></tr>
      <tr><td><b>タスク（プロセス）管理</b></td><td>複数のプログラムを同時に動かしているように見せる（<b>マルチタスク</b>）。CPU の時間を細かく区切って順番に割り当てる。</td></tr>
      <tr><td><b>メモリ管理</b></td><td>各プログラムに主記憶を割り当てる。主記憶が足りないとき、補助記憶の一部をメモリのように使う（<b>仮想記憶</b>）。</td></tr>
      <tr><td><b>ファイル管理</b></td><td>ディレクトリ構造、アクセス権、読み書き（第3章）。</td></tr>
      <tr><td><b>ユーザ管理</b></td><td>ユーザ名とパスワードによるログイン、権限の管理。</td></tr>
      <tr><td><b>ユーザインタフェースの提供</b></td><td>GUI や CUI（次のセクション）。</td></tr></table>
      <details class="why"><summary>マルチタスクの根拠：本当に「同時」に動いているの？</summary><p>1つのコアは、ある瞬間には1つの命令しか実行できません。OS は、たとえば数ミリ秒ごとにプログラムを切りかえます（<b>タイムスライス</b>）。切りかえが人間には速すぎるので、同時に動いているように見えるのです。マルチコア CPU なら、コアの数だけ本当に同時に実行できます。</p></details>
    </div>` },
  { title:"いろいろな OS とユーザインタフェース", short:"OSとUI", widget:"osmatch", labTitle:"OS の名前と説明を結ぼう",
    html:`<div class="prose">
      <table><tr><th>OS</th><th>特徴</th></tr>
      <tr><td><b>Windows</b></td><td>Microsoft 社。パソコン用として最も普及。</td></tr>
      <tr><td><b>macOS</b></td><td>Apple 社。Mac 用。UNIX 系。</td></tr>
      <tr><td><b>Linux</b></td><td>オープンソース（OSS）の UNIX 系 OS。サーバやスーパーコンピュータ、組込み機器で広く使われる。</td></tr>
      <tr><td><b>iOS ／ Android</b></td><td>スマートフォン・タブレット用。Android は Linux をもとにした OSS。</td></tr></table>
      <p><b>ユーザインタフェース（UI）</b>：人とコンピュータのやりとりの方法。</p>
      <ul>
        <li><b>GUI</b>（Graphical User Interface）：アイコンやウィンドウをマウスやタッチで操作。直感的。</li>
        <li><b>CUI</b>（Character User Interface）：キーボードから文字でコマンドを入力。自動化や遠隔操作に強い。</li>
      </ul>
    </div>` },
  { title:"アプリケーションとソフトウェアのライセンス", short:"ライセンス",
    html:`<div class="prose">
      <p>ソフトウェアは著作物です。買ったのは「使う権利（<b>使用許諾、ライセンス</b>）」であって、コピーして配る権利ではありません。</p>
      <table><tr><th>区分</th><th>内容</th></tr>
      <tr><td><b>OSS</b>（オープンソースソフトウェア）</td><td>ソースコード（プログラムの設計図）が公開され、ライセンスの条件のもとで自由に利用・改変・再配布できる。Linux、Firefox など。</td></tr>
      <tr><td><b>フリーウェア</b></td><td>無料で使えるが、ソースコードは公開されていないことが多い。</td></tr>
      <tr><td><b>シェアウェア</b></td><td>試用は無料、継続して使うなら料金を払う。</td></tr>
      <tr><td><b>パッケージ／サブスクリプション</b></td><td>買い切りで使う／月額・年額で使う権利を借りる（Microsoft 365 など）。</td></tr>
      <tr><td><b>サイトライセンス</b></td><td>学校や企業など、組織の中で人数を限定せず使える契約。</td></tr></table>
      <div class="point"><b>注意</b><span>「無料＝何をしてもよい」ではありません。OSS にもライセンス（GPL、MIT など）があり、改変して配るときの条件が決められています。</span></div>
    </div>` },
  ]},

/* ============================================================ 5. 表計算ソフト */
{ id:"sheet", no:5, icon:"grid", title:"表計算ソフト", lead:"セル・数式・関数・相対参照と絶対参照・グラフ",
  intro:"表計算ソフト（Excel など）は「セルに数式を書くと、参照先が変わったとき自動で計算し直してくれる」道具です。この章では、本物のように動くミニ表計算で、数式のコピーと参照のしくみを体験します。",
  sections:[
  { title:"セルと番地、数式の基本", short:"セルと数式",
    html:`<div class="prose">
      <ul>
        <li>表のマス目を <b>セル</b>、横の並びを <b>行</b>（1, 2, 3…）、縦の並びを <b>列</b>（A, B, C…）という。</li>
        <li>セルの位置は「列＋行」で <b>A1</b>、<b>C5</b> のように表す（<b>セル番地</b>）。範囲は <b>A1:C3</b> のように「:」でつなぐ。</li>
        <li>数式は <b>=（イコール）</b> で始める。<code>=A1+B1</code>、<code>=B2*C2</code>。演算子は + − * /、べき乗は ^。</li>
        <li>数式にセル番地を書くことを <b>参照</b> という。参照先の値が変わると、数式の結果も自動で変わる。</li>
      </ul>
      <div class="point"><b>値を直接書かず、参照を使う理由</b><span>「単価×数量」を <code>=120*3</code> と書くと、単価が変わるたびに数式を書き直すことになります。<code>=B2*C2</code> と書いておけば、B2 を直すだけで済み、ミスも減ります。</span></div>
    </div>` },
  { title:"よく使う関数", short:"関数", widget:"sheet", labTitle:"ミニ表計算：数式を入力してみよう（数式は = で始める）",
    html:`<div class="prose">
      <table><tr><th>関数</th><th>意味</th><th>例</th></tr>
      <tr><td><b>SUM</b></td><td>合計</td><td><code>=SUM(B2:B6)</code></td></tr>
      <tr><td><b>AVERAGE</b></td><td>平均</td><td><code>=AVERAGE(B2:B6)</code></td></tr>
      <tr><td><b>MAX ／ MIN</b></td><td>最大値／最小値</td><td><code>=MAX(B2:B6)</code></td></tr>
      <tr><td><b>COUNT</b></td><td>数値が入っているセルの個数</td><td><code>=COUNT(B2:B6)</code></td></tr>
      <tr><td><b>IF</b></td><td>条件によって値を変える</td><td><code>=IF(B2>=60,"合格","不合格")</code></td></tr>
      <tr><td><b>ROUND</b></td><td>四捨五入（けた数を指定）</td><td><code>=ROUND(B2/3,1)</code></td></tr>
      <tr><td><b>INT ／ MOD</b></td><td>整数部分／割り算の余り</td><td><code>=MOD(7,3)</code> → 1</td></tr></table>
      <p class="small muted">関数の書き方：<b>関数名(引数1, 引数2, …)</b>。引数にはセル番地・範囲・数値・文字列（"　"で囲む）を指定します。</p>
    </div>` },
  { title:"相対参照と絶対参照", short:"相対と絶対", widget:"refcopy", labTitle:"数式をコピーすると、参照はどう変わる？",
    html:`<div class="prose">
      <p>数式をほかのセルに<b>コピー</b>すると、セル番地は「コピー先との位置関係を保ったまま」自動的にずれます。これを <b>相対参照</b> といいます。</p>
      <p>ずれてほしくないセル（税率、単価表など）には <b>$</b> をつけて <b>絶対参照</b> にします。</p>
      <table><tr><th>書き方</th><th>意味</th><th>D2 から D3 にコピーすると</th></tr>
      <tr><td><code>A1</code></td><td>相対参照（列も行もずれる）</td><td><code>A2</code></td></tr>
      <tr><td><code>$A$1</code></td><td>絶対参照（列も行も固定）</td><td><code>$A$1</code></td></tr>
      <tr><td><code>A$1</code></td><td>行だけ固定（複合参照）</td><td><code>A$1</code></td></tr>
      <tr><td><code>$A1</code></td><td>列だけ固定（複合参照）</td><td><code>$A2</code></td></tr></table>
      <div class="point"><b>覚え方</b><span><b>$ は「くぎ」</b>。$ の直後にある列名や行番号がくぎで打ちつけられて動かなくなる、と考えます。<code>A$1</code> は「1 行目にくぎ」、<code>$A1</code> は「A 列にくぎ」。</span></div>
    </div>` },
  { title:"グラフの選び方", short:"グラフ", widget:"charts", labTitle:"目的に合うグラフを選ぼう",
    html:`<div class="prose">
      <table><tr><th>グラフ</th><th>向いている目的</th><th>例</th></tr>
      <tr><td><b>棒グラフ</b></td><td>項目どうしの<b>量の比較</b></td><td>商品ごとの売上</td></tr>
      <tr><td><b>折れ線グラフ</b></td><td>時間による<b>変化・推移</b></td><td>月ごとの気温</td></tr>
      <tr><td><b>円グラフ</b></td><td>全体に対する<b>割合</b>（構成比）</td><td>アンケートの回答割合</td></tr>
      <tr><td><b>散布図</b></td><td>2つの量の<b>関係（相関）</b></td><td>身長と体重</td></tr>
      <tr><td><b>レーダーチャート</b></td><td>複数項目の<b>バランス</b></td><td>教科ごとの成績</td></tr></table>
      <p class="small muted">そのほか：<b>並べ替え</b>（ソート：昇順・降順）、<b>フィルタ</b>（条件に合う行だけ表示）も表計算の基本機能です。</p>
    </div>` },
  ]},

/* ============================================================ 6. データベース */
{ id:"db", no:6, icon:"db", title:"データベース", lead:"DBMS・関係データベース・主キー・SQL・トランザクション",
  intro:"データベースは「たくさんのデータを、矛盾なく、みんなで安全に使う」ためのしくみです。表のつくり、主キーと外部キー、SQL による取り出し、同時更新を防ぐ排他制御まで、実際に動かして思い出しましょう。",
  sections:[
  { title:"データベースと DBMS", short:"DBMS",
    html:`<div class="prose">
      <ul>
        <li><b>データベース（DB）</b>：目的に合わせて整理し、共有して使えるようにしたデータの集まり。</li>
        <li><b>DBMS</b>（データベース管理システム）：データベースを管理するソフトウェア（ミドルウェア）。データの<b>一元管理</b>、<b>同時アクセス制御</b>、<b>アクセス権管理</b>、<b>障害からの回復</b>などを行う。</li>
        <li><b>関係データベース（リレーショナルデータベース、RDB）</b>：データを<b>表（テーブル）</b>の形で管理する方式。現在もっとも広く使われている。</li>
      </ul>
      <div class="point"><b>表計算ソフトと何がちがう？</b><span>表計算は1人が1つのファイルを扱うのが基本。DBMS は<b>多数の利用者が同時に</b>読み書きしても矛盾が起きないように制御し、データの重複や食いちがいを防ぐ設計（正規化）を前提にしています。</span></div>
    </div>` },
  { title:"表の構造：主キーと外部キー", short:"主キー", widget:"keys", labTitle:"主キーになれる列はどれ？",
    html:`<div class="prose">
      <ul>
        <li>表の横1行を <b>行（レコード）</b>、縦1列を <b>列（フィールド、項目）</b> という。</li>
        <li><b>主キー</b>：1行を<b>一意に</b>（ただ1つに）特定できる列。<b>重複がなく、空（NULL）でもいけない</b>。学生番号、商品コードなど。</li>
        <li><b>外部キー</b>：<b>他の表の主キー</b>を参照する列。表と表を関連づける（例：注文表の「学生番号」は学生表の主キーを指す）。</li>
        <li>2つ以上の列を組み合わせて主キーにすることもある（<b>複合キー</b>）。</li>
      </ul>
      <details class="why"><summary>なぜ「氏名」は主キーに向かないの？</summary><p>同姓同名の人がいると、1行に特定できないからです。また、改姓で値が変わる可能性もあります。主キーには「重複せず、変わらず、必ず値がある」列（またはそのために作った番号）を使います。</p></details>
    </div>` },
  { title:"正規化：重複をなくして矛盾を防ぐ", short:"正規化", widget:"normalize", labTitle:"1つの表 vs 分けた表：値を書きかえてみよう",
    html:`<div class="prose">
      <p><b>正規化</b>とは、データの<b>重複をなくす</b>ように表を分割し、更新のときに矛盾が起きないようにする設計の手順です。</p>
      <ul>
        <li>1つの表に「学生番号・氏名・科目名・担当教員」を全部入れると、同じ学生の氏名が何度も現れる（<b>冗長</b>）。</li>
        <li>その学生の氏名を直すとき、1か所でも直し忘れると<b>食いちがい（更新異常）</b>が起こる。</li>
        <li>「学生」「科目」「履修」のように表を分け、<b>主キーと外部キー</b>でつなげば、氏名は1か所にしかないので矛盾しない。</li>
      </ul>
      <p class="small muted">表と表の関係（1対多など）を図にしたものを <b>E-R 図</b>（実体関連図）といいます。</p>
    </div>` },
  { title:"データの取り出し：関係演算と SQL", short:"SQL", widget:"sql", labTitle:"SQL を書いて、表から取り出してみよう",
    html:`<div class="prose">
      <p>表からデータを取り出す基本の操作は3つ。これを<b>関係演算</b>といいます。</p>
      <table><tr><th>演算</th><th>意味</th><th>SQL では</th></tr>
      <tr><td><b>選択</b></td><td>条件に合う<b>行</b>を取り出す</td><td><code>WHERE</code></td></tr>
      <tr><td><b>射影</b></td><td>必要な<b>列</b>だけ取り出す</td><td><code>SELECT</code> の列指定</td></tr>
      <tr><td><b>結合</b></td><td>2つの表を共通の列でつなぐ</td><td><code>JOIN</code>（または WHERE で条件指定）</td></tr></table>
      <p><b>SQL</b> は DBMS に指示を出すための言語です。基本形：</p>
      <div class="readout"><b>SELECT</b> 列名, 列名 <b>FROM</b> 表名 <b>WHERE</b> 条件 <b>ORDER BY</b> 列名;</div>
      <ul>
        <li><code>SELECT * FROM 学生</code> → 学生表のすべての列・行</li>
        <li><code>SELECT 氏名 FROM 学生 WHERE 学年 = 2</code> → 2年生の氏名だけ（選択＋射影）</li>
        <li>条件は <code>AND</code>／<code>OR</code> でつなげる。並べ替えは <code>ORDER BY 列 DESC</code>（降順）。</li>
      </ul>
      <div class="point"><b>覚え方</b><span>選択は「行を選ぶ」、射影は「列に光を当てて影（プロジェクション）を映す」。<b>行なら選択、列なら射影</b>。</span></div>
    </div>` },
  { title:"トランザクションと排他制御", short:"排他制御", widget:"lock", labTitle:"最後の1席を2人が同時に予約したら？",
    html:`<div class="prose">
      <ul>
        <li><b>トランザクション</b>：「口座 A から引き落とし、口座 B に入金」のように、<b>まとめて全部成功するか、全部なかったことにするか</b>のどちらかでなければならない一連の処理。</li>
        <li><b>コミット</b>：処理を確定する。<b>ロールバック</b>：処理を取り消して、開始前の状態に戻す。</li>
        <li><b>排他制御（ロック）</b>：あるデータを誰かが更新している間、ほかの人が同時に更新できないようにする。同時更新による矛盾（ダブルブッキングなど）を防ぐ。</li>
        <li><b>ACID 特性</b>：原子性（Atomicity：全部か無か）、一貫性（Consistency）、独立性（Isolation：同時実行しても互いに影響しない）、耐久性（Durability：確定した結果は失われない）。</li>
        <li><b>障害回復</b>：更新の記録（<b>ログ、ジャーナル</b>）を使い、<b>ロールバック</b>（更新前の状態に戻す）や <b>ロールフォワード</b>（バックアップに更新後ログを反映して障害直前の状態に復元）を行う。</li>
      </ul>
      <details class="why"><summary>ロックがないと何が起こる？</summary><p>残席「1」を A さんと B さんが同時に読むと、2人とも「空いている」と判断し、それぞれ残席を 0 にして予約を確定してしまいます。結果は残席 0 なのに予約は 2 件、というダブルブッキングです。ロックをかければ、先に読んだ人の処理が終わるまで後の人は待たされ、待った後に残席 0 を読むので予約できません。</p></details>
    </div>` },
  ]},
];
