# STATE: ci-works mobile rendering
updated: 2026-09-10T01:31:22+09:00

## 目的
`/works/ci-works`で、スマホのSlack内蔵ブラウザ／iPhone相当viewportでも画像・本文を表示し、PDFと画像の公開状態を検証する。

## 現在の判定
- **リンク切れとPDFは解消済み。モバイル表示は未解決。**
- 修正前の症状（固定navと背景だけが残る）はiOS Simulator Safariの実画面でも再現した。
- `2df03d2`、`f8eece1`、`75e00bf`、`74d1284`、`4e511bd`の公開版を順に実画面確認したが、`/works/ci-works`はblankのままだった。
- `4e511bd`ではoverlayのopacity/transformをJSX inline styleで強制し、本文変換fallbackも追加したが、iOS実画面ではまだblankだった。
- 最新commit `f8c807d072fb55bd32daccb6a728cc826c36221c` は親`main`のWorks routeをinline `opacity:1`にする修正を含むが、Vercel statusは現在`pending`であり、公開版の最終確認は未実施。
- よって、現時点で「スマホ表示が解決した」とは断定しない。

## 確定した原因
- Figma由来の画像URLはFigma S3保護URLで、公開取得時にHTTP 403となりリンク切れになっていた。
- WordPress側のPDFは表紙1枚・1ページだけで、全ポスターを含む正本ではなかった。
- WordPress本文・タイトル・メディア、Figmaファイルは変更していない。

## 実施済みの資産修正
- Figma Desktop GUIから実ポスター8枚をPNG/JPEGとして取得し、`public/images/works/ci-works/`で管理した。
- 実画像8枚から`public/works/ci-works.pdf`を生成した。確認値は8ページ、3,557,935 bytes。
- Figma一時URLを本番参照から除去し、管理下画像とPDFをWorks manifestから参照するようにした。
- `/works` alias、selectedWorkの静的props、carousel寸法、mobileのnested `backdrop-filter`無効化、sessionStorage guardを実装した。

## モバイル調査・修正履歴
- `pages/works/[slug].tsx`でstatic `selectedWork`をclient route hydrationから分離した。
- `lib/useMatchMedia.ts`を`addEventListener`優先・旧API fallback・未実装guardへ変更したが、最新公開版のiOS実画面ではblankが継続した。
- `pages/_app.tsx`で`/`を含むWorks routeをglobal loading layerから除外し、現在はWorks routeの`main`へinline opacityを設定した。
- `components/widget/Works_view.jsx`でoverlay opacity/transformをinline指定し、本文変換失敗時にraw HTMLへfallbackするようにした。
- Safari/WebKit向けの回帰テストを維持している。

## 検証結果
- `bun run test`: 20 passed。
- `bun run lint`: 既存React Hook warningのみ。新規errorなし。
- `bun run build`: success。
- `git diff --check`: success。
- `origin/main`: `f8c807d072fb55bd32daccb6a728cc826c36221c`。
- working tree: clean（Vercel status確認後にreadbackする）。
- iOS Simulator UDID: `00514918-1431-474B-9B65-26B6B6C62EF2`。
- SafariDriverは`The file “open” couldn’t be opened.`で失敗。
- `ios_webkit_debug_proxy`は起動できるが、SimulatorのWeb Inspector endpointをlistenせずDOM/console取得には未接続。

## 決定事項
- Works detailの正本データは`getStaticProps`で確定した`selectedWork`とする。
- 実画像8枚と同一素材から生成した8ページPDFを共通正本とする。
- 公開判定はHTTP 200やSSRだけでなく、iOS Simulator Safariの実画面で確認する。
- WordPress、Figmaファイル、PR作成は行わない。
- `public/sitemap-0.xml`のbuild生成差分は変更に含めない。

## 次の一手
1. `f8c807d`のVercel statusがsuccessになるまで待つ。
2. freshなiOS Simulator Safariで`/works/ci-works`を12〜30秒後に再撮影する。
3. overlay、ポスター、タイトル、本文、PDFリンク、固定navを実画面で判定する。
4. なおblankなら、親mainではなくrender/paintの実DOM原因を確定するまで「解決済み」と報告しない。
