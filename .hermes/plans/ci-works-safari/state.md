# STATE: ci-works Safari mobile rendering
updated: 2026-08-28T02:20:00+09:00

## 目的
`/works/ci-works`で、iPhone Safari上の画像・本文空白を解消し、PDF/画像の既存修正を壊さず公開前後に検証する。

## 確定事実
- Repository: `/Users/akitani/_work/portfolio2022-fix-20260820`
- Public target: `https://2001y.me/works/ci-works`
- `imgSize.aspect=0.70703125`、SSR画像属性は830x586.8359375、local embedsは8件。
- ユーザー添付画像はSafariで固定navとcarousel矢印だけが見え、画像・本文が見えない。
- `styles/components/carousel.module.scss`は変更済み。thumbnail/carouselのauto sizingをやめ、寸法を明示した。
- `tests/carouselLayout.test.mjs`を追加済み。
- `bun run test`: 14 passed。
- `bun run lint`: success、既存React Hook warning 4件のみ。
- `bun run build`: success。
- patched buildをiOS Simulator Safariで検証中。127.0.0.1はSimulator自身を指し、Macのlocal serverへ到達しない。LAN URLもSafari側でloading継続となり、patched UIの実画面成功とは判定していない。
- SafariDriverはmacOSの「Allow remote automation」が未許可で、DOM取得には使えない。

## 決定事項
- 決定: Safariで高さ0になり得る`width:auto`/`height:auto`/`aspect-ratio`/`max-height`の組み合わせを、明示寸法へ変更する。理由: ユーザー画像の矢印位置と、Chromeでは見えるがWebKitで消える症状に整合する。
- 決定: 公開前にテスト、production build、公開URLのiOS相当レンダリングを分けて確認する。
- 決定: buildが生成した`public/sitemap-0.xml`差分は今回の変更に含めない。
- 決定: WordPress本文/APIは変更せず、local assets/PDFを正とする。

## Files touched
- `styles/components/carousel.module.scss`
- `tests/carouselLayout.test.mjs`
- `.hermes/plans/ci-works-safari/state.md`

## 未解決 / リスク
- patched buildのiOS Simulator Safariで、LAN到達性のため実ページ描画をまだ確認できていない。
- Safari本体のWebDriver DOM検証はremote automation許可が必要で未実施。
- まだcommit/push/deployしていない。

## 次の一手
1. build生成物sitemapを戻し、diff/test/build artifactをreadback。
2. branch/worktreeを確認し、今回の3ファイルだけcommit。
3. 明示済みの公開承認に基づきpush/deploy。
4. exact revisionのVercel成功とcustom domain readbackを確認。
5. public URLをChrome mobile probeと可能なiOS Simulator Safariで再確認。未検証は未検証と報告する。
