# STATE: ci-works mobile rendering
updated: 2026-09-11T00:00:00+09:00

## 目的
`/works/ci-works`で、スマホのSafariでも画像・本文を表示し、リンクとPDFの公開状態を検証する。

## 現在の判定
- **根本原因を特定し、画像・PDF・スマホ表示・依存・lint/test/build/React Doctorまで修正・検証済み。再公開待ち。**
- iOS Simulator Safariの修正前は、WorksのSSR HTML・DOM・画像・本文が存在するにもかかわらず、背景と固定navだけが表示されていた。
- `html/body`の実rectが`402x61`で、`WorksOverlay`は`position:fixed`・rect`402x754`・`display:block`・`visibility:visible`・`opacity:1`だった。
- `html/body/#__next`へ`height:100%; min-height:100%`をinline適用するA/Bで、ポスター・タイトル・本文が復帰した。
- 同じCSSを恒久化したproduction buildを`next start`で起動し、iOS Simulator Safariで通常URLの表示を確認した。
- iPhone実機SafariとSlack内蔵ブラウザは未確認であり、そこは残る検証リスクである。

## 確定した原因
- Figma由来の画像URLはFigma S3保護URLで、公開取得時にHTTP 403となりリンク切れになっていた。
- WordPress側のPDFは表紙1枚・1ページだけで、全ポスターを含む正本ではなかった。
- iOS Safariのblankはデータ取得・hydration・画像ロード・opacityではなく、通常flowのコンテンツがheader中心で`html/body`の高さが61pxになった状態で、fixedなWorks overlayを配置していたことが原因だった。
- iOS Safariではこのviewport未満のrootと`overflow-x:hidden`を持つroot配下で、fixed overlayのrectやcomputed styleは正常でも、overlayとdescendantのpaintがclipされていた。
- `debug-probe`でSafari自身から、overlayのrect・子要素rect・画像`complete=true`・`naturalWidth=7482`・本文存在を取得した。したがってDOM欠落や画像配信失敗ではない。
- Vercel Image Optimizationはmobileが選ぶwidth（例`w=384`）でHTTP 402、`X-Vercel-Error: OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED`を返す。これは独立した画像配信不具合であり、`unoptimized`で回避した。
- Works CSSにはSafariで不安定なcalc乗算があり、flex/aspect-ratioと加算のみへ変更した。これは独立した互換性修正として保持している。

## 実装した修正
- `styles/globals.scss`で`html, body, #__next`に`height: 100%; min-height: 100%;`を追加し、fixed Works overlayのrootをviewportサイズにした。
- `components/widget/WorksList.jsx`のSSR警告を解消するため、スクロール位置復元の`useLayoutEffect`を`useEffect`へ変更した。
- `tests/fixedOverlayRootSizing.test.mjs`でviewport-sized rootを固定した。
- `tests/worksListSSR.test.mjs`でWorks listがserver-incompatibleなlayout effectを使わないことを固定した。
- 一時debug probe、paint probe、Error Boundary、z-index A/Bはすべて削除済み。

## 資産修正
- Figma Desktop GUIから実ポスター8枚をPNG/JPEGとして取得し、`public/images/works/ci-works/`で管理した。
- 実画像8枚から`public/works/ci-works.pdf`を生成した。確認値は8ページ、3,557,935 bytes。
- Figma一時URLを本番参照から除去し、管理下画像とPDFをWorks manifestから参照するようにした。
- Worksの`next/image`を`unoptimized`にしてVercel optimizer 402を回避した。

## 検証結果
- local `bun run test`: 27 passed、0 failed。
- `bun run lint`: exit 0、ESLint 0 warning / 0 error。
- `tsc --noEmit`: exit 0。
- `bun install --frozen-lockfile`: exit 0、Bun lockfile再現性確認済み。
- `react-doctor`: 0 error / 0 warning / 0 affected files。
- `bun run build`: success、571ページ生成、next-sitemap success、build warning/errorなし。
- `git diff --check`: success。
- production `next start`: HTML HTTP 200、167,905 bytes。HTMLにWorks overlay、画像URL、本文が存在した。
- production PDF: HTTP 200、3,557,935 bytes、`application/pdf`。
- iOS Simulator Safari（UDID `00514918-1431-474B-9B65-26B6B6C62EF2`）で、恒久CSSのみのproduction buildをfresh URLから30秒後に撮影し、ポスター・タイトル・本文を確認した。
- commit `24d8e76`を`origin/main`へpushし、remote readbackでSHA一致を確認した。
- Vercel statusは`success: Deployment has completed`。公開CSS`324deb6344ca2c09.css`に`html,body,#__next{height:100%;min-height:100%}`をreadbackした。
- 公開HTMLはHTTP 200、Works overlay・8画像・本文・`/works/ci-works.pdf`リンクをreadbackした。公開PDFはHTTP 200、3,557,935 bytes、`application/pdf`。
- 公開URLを同じiOS Simulator Safariでfresh起動し、ポスター・タイトル・本文が表示されることを確認した。修正前の公開blankとの差分も同一Simulatorで確認した。
- `public/sitemap-0.xml`のbuild生成差分は変更に含めず復元した。

## 決定事項
- Works detailの正本データは`getStaticProps`で確定した`selectedWork`とする。
- 実画像8枚と同一素材から生成した8ページPDFを共通正本とする。
- 公開判定はHTTP 200やSSRだけでなく、iOS Simulator Safariの実画面で確認する。
- WordPress、Figmaファイル、PR作成は行わない。
- `public/sitemap-0.xml`のbuild生成差分は変更に含めない。
- 今回の根本修正は`html/body/#__next`のviewport-sized rootであり、未検証のfixed/z-index推測修正は追加しない。

## 現在のFiles touched
- `styles/globals.scss`
- `components/widget/WorksList.jsx`
- `tests/fixedOverlayRootSizing.test.mjs`
- `tests/worksListSSR.test.mjs`
- `.hermes/plans/ci-works-safari/state.md`

## 未解決 / リスク
- iPhone実機SafariとSlack内蔵ブラウザでのfresh確認は未実施。Simulator Safariでの修正結果はpassしている。
- Vercelの今回revisionのdeployment readbackはcommit/push後に実施する。

## 今回の追加修正
- Carouselの画像表示を`object-fit: contain`とintrinsic aspect sizingへ修正し、`object-fit: fill`による横伸びを除去。
- `dangerouslySetInnerHTML`、index key、static interactive element、stale effect、timer/RAF cleanup、HTTP status/body retry、Set利用、並列取得、Google Analytics手書きscriptを修正。
- Nextを`15.5.25`、Reactを`18.3.1`へ更新し、`@next/third-parties/google`へ移行。
- `next lint`をESLint CLIへ移行、Sass slash divisionを`math.div`へ移行、package managerをBunへ一本化。

## 次の一手
- 変更をtask-wise commit/pushし、Vercel deploymentと公開URL・PDF・実画面をreadbackする。
- iPhone実機またはSlack内蔵ブラウザで同じ症状が残る場合のみ、fresh cacheで追加確認する。
