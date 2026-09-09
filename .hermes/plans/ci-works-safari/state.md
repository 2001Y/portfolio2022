# STATE: ci-works mobile rendering
updated: 2026-09-10T03:30:00+09:00

## 目的
`/works/ci-works`で、スマホのSafariでも画像・本文を表示し、リンクとPDFの公開状態を検証する。

## 現在の判定
- **リンク切れと8ページPDFは対応済み。モバイル表示は未解決。**
- 最新公開commit `ec85468` のVercel deployはsuccessだが、freshなiOS Simulator Safariで`/works/ci-works`と`/works`を確認しても、背景・固定navだけでWorks内容はblankだった。
- `/about`は同じiOS Simulator Safariで正常表示するため、Safari全体やviewportだけの障害ではなくWorks固有の問題である。
- したがって、現時点で「スマホ表示が解決した」とは断定しない。

## 確定した原因
- Figma由来の画像URLはFigma S3保護URLで、公開取得時にHTTP 403となりリンク切れになっていた。
- WordPress側のPDFは表紙1枚・1ページだけで、全ポスターを含む正本ではなかった。
- Vercel Image Optimizationはmobileが選ぶwidth（例`w=384`）でHTTP 402、`X-Vercel-Error: OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED`を返す。これは独立した画像配信不具合であり、`unoptimized`で回避したがblank自体は解消しなかった。
- Works CSSにはSafariで不安定なcalc乗算があり、flex/aspect-ratioと加算のみへ変更したがblankは継続した。これも独立した互換性修正として保持している。
- React hydrationがblankの根本原因だという仮説は未確定。local debug bannerをclientだけで追加した実験では、debug banner自身によるhydration mismatchが発生したため、アプリ本来の原因の証拠にはしていない。

## 実施済みの資産修正
- Figma Desktop GUIから実ポスター8枚をPNG/JPEGとして取得し、`public/images/works/ci-works/`で管理した。
- 実画像8枚から`public/works/ci-works.pdf`を生成した。確認値は8ページ、3,557,935 bytes。
- Figma一時URLを本番参照から除去し、管理下画像とPDFをWorks manifestから参照するようにした。
- Worksの`next/image`を`unoptimized`にしてVercel optimizer 402を回避した。
- Works一覧をflex/aspect-ratio、詳細Carouselをwidth/height:auto/aspect-ratioへ変更し、calc乗算依存を除去した。

## モバイル調査・修正履歴
- `pages/works/[slug].tsx`でstatic `selectedWork`をclient route hydrationから分離した。
- `lib/useMatchMedia.ts`を`addEventListener`優先・旧API fallback・未実装guardへ変更したが、iOS実画面ではblankが継続した。
- `pages/_app.tsx`で`/`を含むWorks routeをglobal loading layerから除外し、Works routeの`main`へinline opacityを設定した。
- `components/widget/Works_view.jsx`でoverlay opacity/transformをinline指定し、本文変換失敗時にraw HTMLへfallbackするようにした。
- fixed/overflow、opacity/transform/z-indexをmobileで強制するlocal A/Bは表示を回復しなかったため採用せず、未コミット差分を破棄した。
- Worksを`ssr:false`のclient-onlyにするlocal A/Bは初期SSRが空になるため判定不能で、採用せず破棄した。

## 検証結果
- `bun run test`: 24 passed。
- `bun run lint`: 既存React Hook warningのみ。新規errorなし。
- `bun run build`: success。
- `git diff --check`: success。
- `origin/main`: `ec85468`。
- Vercel status: `ec85468` success。公開版の実画面はblank継続。
- working tree: clean。
- iOS Simulator UDID: `00514918-1431-474B-9B65-26B6B6C62EF2`。
- SafariDriverは`The file “open” couldn’t be opened.`で失敗。
- `ios_webkit_debug_proxy`は起動できるが、SimulatorのWeb Inspector endpointをlistenせずDOM/console取得には未接続。
- SimulatorのWebKit logにはWorks固有のTypeError等は確認できなかった。

## 決定事項
- Works detailの正本データは`getStaticProps`で確定した`selectedWork`とする。
- 実画像8枚と同一素材から生成した8ページPDFを共通正本とする。
- 公開判定はHTTP 200やSSRだけでなく、iOS Simulator Safariの実画面で確認する。
- WordPress、Figmaファイル、PR作成は行わない。
- `public/sitemap-0.xml`のbuild生成差分は変更に含めない。
- blankの根本原因が確定するまで、追加の推測修正を公開しない。

## 次の一手
1. iOS SafariのWeb Inspectorまたは別の実DOM取得経路を確立する。
2. Works一覧と詳細のcomputed style、bounding rect、image complete/error、React runtime errorを同時に取得する。
3. 原因を再現する最小修正をlocalで確認してから、productionへ反映する。
4. overlay、ポスター、タイトル、本文、PDFリンク、固定navをfreshな実画面で判定し、安定表示を確認するまで未解決扱いにする。
