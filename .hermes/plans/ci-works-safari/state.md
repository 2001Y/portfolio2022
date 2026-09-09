# STATE: ci-works Safari mobile rendering
updated: 2026-09-09T16:53:32+09:00

## 目的
`/works/ci-works`で、iPhone Safari上の画像・本文空白を解消し、PDF/画像の既存修正を壊さず公開前後に検証する。

## 確定事実
- Repository: `/Users/akitani/_work/portfolio2022-fix-20260820`
- Public target: `https://2001y.me/works/ci-works`
- `imgSize.aspect=0.70703125`、SSR画像属性は830x586.8359375、local embedsは8件。
- ユーザー添付画像はSafariで固定navとcarousel矢印だけが見え、画像・本文が見えない。
- `styles/components/carousel.module.scss`は変更済み。thumbnail/carouselのauto sizingをやめ、寸法を明示した。
- `tests/carouselLayout.test.mjs`を追加済み。
- `bun run test`: 15 passed。
- `bun run lint`: success、既存React Hook warning 4件のみ。
- `bun run build`: success。
- commit `eb468eec4215606dbed0e017ffdea162c5107f96` は `origin/main` と一致し、GitHubのVercel checkはsuccess。
- live HTMLはHTTP 200、overlay open=true、Figma/S3参照0、管理下画像8件、PDFリンクあり。
- live画像8件はすべてHTTP 200、JPEG/PNG。live PDFはHTTP 200、`application/pdf`、3,557,935 bytes。
- live work CSSはmobile `backdrop-filter:none` と `-webkit-backdrop-filter:none`を配信している。
- iOS Simulator SafariのWebDriver probeでは、DOM・computed style・canvas画像decode・element screenshotは正常。ただしviewport screenshotでは固定nav以外が白い空白に見えた。
- iOS 27 betaの新規SimulatorではSafariDriver sessionが`The file “open” couldn’t be opened`、`simctl openurl`もtimeoutし、最終viewportの再確認はtransport blocked。

## 決定事項
- 決定: Safariで高さ0になり得る`width:auto`/`height:auto`/`aspect-ratio`/`max-height`の組み合わせを、明示寸法へ変更する。理由: ユーザー画像の矢印位置と、Chromeでは見えるがWebKitで消える症状に整合する。
- 決定: mobileではfixed overlay、modal pseudo-element、carouselのnested `backdrop-filter`を無効化する。理由: WebKitのpaint/compositing経路を避け、半透明背景は維持する。
- 決定: 公開前にテスト、production build、公開URLのiOS相当レンダリングを分けて確認する。
- 決定: buildが生成した`public/sitemap-0.xml`差分は今回の変更に含めない。
- 決定: WordPress本文/APIは変更せず、local assets/PDFを正とする。

## Files touched
- `styles/components/carousel.module.scss`
- `styles/works.module.scss`
- `tests/carouselLayout.test.mjs`
- `tests/safariBackdrop.test.mjs`
- `.hermes/plans/ci-works-safari/state.md`

## 未解決 / リスク
- iPhone実機または安定したiOS Simulatorのviewport screenshotで、修正後に本文・画像・PDFリンクが見えることは未確定。
- SafariDriverのDOM/element取得は一部成功したが、iOS 27 betaの新規session起動が不安定。
- viewportの白空白が継続する場合、fixed overlayのcompositing以外（Safari viewport capture、scroll container、layer invalidation）を追加切り分けする。

## 次の一手
1. iPhone実機SafariまたはiOS Simulator Safari transportが復旧した環境で、同じlive URLを再確認する。
2. viewport screenshotで本文・8画像・PDFリンクが見えることを確認できたら、未解決欄を閉じる。
3. 実機確認ができない間は、live HTTP/CSS/asset readbackを最終証拠とし、viewport成功とは表現しない。
