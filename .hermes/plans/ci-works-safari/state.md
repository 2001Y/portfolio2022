# STATE: ci-works mobile rendering
updated: 2026-09-11T19:00:00+09:00

## 目的
`/works/ci-works`で、スマホのSafariでも画像・本文を表示し、リンクとPDFの公開状態を検証する。

## 現在の判定
- **根本原因を特定し、初回の画像・PDF・スマホ表示・依存・lint/test/build/React Doctor修正は`origin/main`とVercel liveへ反映済み。最新の混在画像除外・3枚PDF・可変frame修正はlocalで検証済みで、これからcommit/pushと公開readbackを行う。**
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
- 以前の8枚同期は、Figma Page 1の別作品（PhysicsClub／For the color.／HSSearch／YellowMug）を含んでいたため、最新revisionで無効化した。
- WordPress正本のcover画像を`public/images/works/ci-works/ci-works-cover.jpg`へ取り込み、Figma Page 1から市ヶ谷の思いやりに属する`Frame 35`、`Frame 34 (a)`、`Frame 26`の3枚だけを残した。
- 別作品5枚は`ci-works`の公開asset配下から削除し、manifestのselection testで再混入を防止した。
- 3枚から`public/works/ci-works.pdf`を再生成した。確認値は3ページ、8,362,161 bytes。各ページ比率は元画像の1.95966475、2.13122687、2.08238173と一致する。
- Figma一時URLを本番参照から除去し、管理下画像とPDFをWorks manifestから参照するようにした。
- `assets:sync`に`ci-works`専用のframe selection gate、画像natural dimensions、既存cover保持を追加した。
- Worksの`next/image`を`unoptimized`にしてVercel optimizer 402を回避した。

## 検証結果
- local `bun run test`: 29 passed、0 failed。
- `bun run lint`: exit 0、ESLint 0 warning / 0 error。
- `tsc --noEmit`: exit 0。
- `bun install --frozen-lockfile`: exit 0、Bun lockfile再現性確認済み。
- `react-doctor`: 0 error / 0 warning / 0 affected files。
- `bun run build`: success、571ページ生成、next-sitemap success、build warning/errorなし。
- Sass 1.104更新後に表面化した`@import`/legacy builtin deprecationを`@use`、`color.channel`、`list.nth`、`map.get`へ移行し、最終buildのwarningを0件にした。
- semver範囲内の依存を更新し、`@mapbox/rehype-prism`を0.9.0、`sharp`を0.35.4へ更新。未使用のStylelint/Prettier toolchainは削除した。
- 依存更新後も`bun install --frozen-lockfile`、27 tests、ESLint、TypeScript、React Doctor（0 error / 0 warning / 0 affected files）、571ページbuildを再通過した。
- `bun audit`は43件（critical 1 / high 26 / moderate 13 / low 3）残存。主因はNext 15の`styled-jsx`/Babel、Next/PostCSS、ESLint/next-sitemapのtransitive toolchainで、Next 16等のmajor migrationなしに安全な解消経路はないため、0件とは扱わない。
- state.mdの最終追補は一時textlint環境で0 findings、exit 0。
- `git diff --check`: success。
- production `next start`: HTML HTTP 200、167,905 bytes。HTMLにWorks overlay、画像URL、本文が存在した。
- production PDF: HTTP 200、3,557,935 bytes、`application/pdf`。
- iOS Simulator Safari（UDID `00514918-1431-474B-9B65-26B6B6C62EF2`）で、恒久CSSのみのproduction buildをfresh URLから30秒後に撮影し、ポスター・タイトル・本文を確認した。
- commit `24d8e76`を`origin/main`へpushし、remote readbackでSHA一致を確認した。
- Vercel statusは`success: Deployment has completed`。公開CSS`324deb6344ca2c09.css`に`html,body,#__next{height:100%;min-height:100%}`をreadbackした。
- 公開HTMLはHTTP 200、Works overlay・8画像・本文・`/works/ci-works.pdf`リンクをreadbackした。公開PDFはHTTP 200、3,557,935 bytes、`application/pdf`。
- 公開URLを同じiOS Simulator Safariでfresh起動し、ポスター・タイトル・本文が表示されることを確認した。修正前の公開blankとの差分も同一Simulatorで確認した。
- `public/sitemap-0.xml`のbuild生成差分は変更に含めず復元した。
- `origin/main`はcommit `b4cd209da4e319474a228bf1dbe338f5c17afb81`でremote readback一致。
- Vercel live `https://2001y.me/works/ci-works`はHTTP 200、HTML 155,098 bytes、local releaseと同じCSS/JS hash、`x-vercel-cache: HIT`でreadbackした。
- live PDFはHTTP 200、3,557,935 bytes、`application/pdf`。HTMLには8画像識別子、本文、`ci-works.pdf`リンクが存在する。
- 公開DOMの8画像はnatural dimensionsを取得し、computed `object-fit: contain`を確認した。共通表示box 695.52x212.14px内のcontent ratioは8枚ともnatural ratioと一致したため、画像の引き伸ばしはない。
- 追加依存/Sass修正commit `a00aa4e0e1bf129be9d6d008a20a75b87c8a2df3`を`origin/main`へpushし、remote readbackでSHA一致。
- 追加push後のVercel liveはHTML HTTP 200、ETag `13b12ea1f7072462f118a9afb2ac4dd1`、155,098 bytes。8画像識別子・本文・PDFリンクを再readbackした。
- 追加push後のlive PDFはHTTP 200、3,557,935 bytes、`application/pdf`。browser DOMで8枚すべてのnatural dimensionsと`object-fit: contain`を再readbackした。

## 決定事項
- Works detailの正本データは`getStaticProps`で確定した`selectedWork`とする。
- 実画像3枚と同一素材から生成した3ページPDFを共通正本とする。
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
- 今回revisionのVercel deployment readbackは完了済み。

## 今回の追加修正
- Carouselの画像表示を`object-fit: contain`とintrinsic aspect sizingへ修正し、`object-fit: fill`による横伸びを除去。
- `dangerouslySetInnerHTML`、index key、static interactive element、stale effect、timer/RAF cleanup、HTTP status/body retry、Set利用、並列取得、Google Analytics手書きscriptを修正。
- Nextを`15.5.25`、Reactを`18.3.1`へ更新し、`@next/third-parties/google`へ移行。
- `next lint`をESLint CLIへ移行、Sass slash divisionを`math.div`へ移行、package managerをBunへ一本化。
- `next.config.js`のSass prependを`@use`へ移行し、`styles/_prepend.scss`と`styles/variable.scss`のSass legacy APIを更新した。
- 未使用と誤認して削除したSVG loaderは、`/contact/done`のReact #130で必要と判明したため復元した。`@svgr/webpack`は8.1系で保持し、build passを再確認した。

## 最新の再開（2026-09-20）
- WordPress正本coverと、Figma Page 1の候補8枚を内容照合した。`Frame 35`、`Frame 34 (a)`、`Frame 26`だけが「市ヶ谷の思いやり」に属し、`Frame 30`、`Frame 34 (b)`、`Frame 29`、`Frame 28`、`Frame 27`は別作品だった。
- 最新manifestはcover 1枚とdetail embed 3枚を管理し、detail embedにはnatural width/height/aspectを保持する。
- `Carousel`はactive slideの`--slide-aspect`を使い、画像ごとのframe比率を反映する。共通固定枠・55vh clampによる画像内余白を使わない。
- local `next start`のSSR HTMLは3画像、cover、PDFリンク、本文を含み、別作品5画像は0件だった。local image/PDFはHTTP 200だった。
- 3ページPDFのページ比率と元画像比率は全件一致した。
- 最終local検証は29 tests、ESLint、TypeScript、clean build 571/571、React Doctor 100/100（0 issue）。
- ここから今回分をcommit/pushし、Vercel live HTML・画像・PDF・公開DOMをreadbackする。