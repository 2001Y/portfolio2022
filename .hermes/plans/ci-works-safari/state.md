# STATE: ci-works mobile rendering
updated: 2026-09-09T19:14:42+09:00

## 目的
`/works/ci-works`で、スマホのSlack内蔵ブラウザ／iPhone相当viewportでも画像・本文を表示し、PDFと画像の公開状態を検証する。

## 確定事実
- Repository: `/Users/akitani/_work/portfolio2022-fix-20260820`
- Public target: `https://2001y.me/works/ci-works`
- ユーザー添付画像の上部は`< Slack`であり、Safari単体ではなくSlack内蔵ブラウザの画面だった。
- 添付画像ではWorks overlayが表示されず、固定navと背景だけが残っていた。これは画像paint不良ではなく、overlayのReact描画がhydration後に消える事象と判定した。
- `[slug].tsx`はclient初期renderで`router.query.slug`が未確定になり得るのに、`postRes`をrouter queryから検索して`Works_view`へ渡していた。これによりSlack WebViewの遅いhydrationで`res`がundefinedになり、本文描画が落ちる経路があった。
- `getStaticProps`で確定した`selectedWork`をpropsとして渡し、Works本文の描画をrouter queryの準備状態から分離した。
- commit `a28863098f9893a094242eec4b7b3d065298a3d1` は`origin/main`と一致し、Vercelは2026-09-09T10:12:17Zにsuccessになった。
- live HTMLのbuildIdは`ELHiFNVhyaCkn_MGn698F`、`pageProps.selectedWork`を含む。
- liveを390x844のmobile viewportで6秒待機後にprobeし、overlay class=`works_open`、opacity=`1`、rect=`390x844`、article本文あり、PDFリンクあり、画像要素あり、console errorなしを確認した。
- 同じ本番状態をscreenshotで目視し、ポスター画像、タイトル「市ヶ谷の思いやり」、本文が表示されることを確認した。添付画像の固定navだけの状態とは異なる。
- `bun run test`: 16 passed。
- `bun run lint`: success、既存React Hook warning 4件のみ。
- `bun run build`: success。
- local productionでも390x844 mobile viewportのhydration後DOMとscreenshotがgreenだった。
- live PDFはHTTP 200、`application/pdf`、3,557,935 bytes、8ページ。
- WordPress本文/APIは変更していない。画像8枚とPDFは管理下local assetを使用している。

## 決定事項
- Works detailの正本データは`getStaticProps`で確定した`selectedWork`とする。clientの`router.query`は閉じる操作やquery引き継ぎに限定する。
- carouselの明示寸法と、mobileのnested `backdrop-filter`無効化は既存のWebKit対策として維持する。ただし、今回の添付症状の主因はroute hydration競合だった。
- buildが生成した`public/sitemap-0.xml`差分は変更に含めない。
- 公開判定はSSRだけでなく、mobile viewportのhydration後DOM・console・screenshotを併用する。

## Files touched
- `pages/works/[slug].tsx`
- `tests/worksRouteHydration.test.mjs`
- `styles/components/carousel.module.scss`
- `styles/works.module.scss`
- `tests/carouselLayout.test.mjs`
- `tests/safariBackdrop.test.mjs`
- `.hermes/plans/ci-works-safari/state.md`

## 残る制約
- ユーザーの実iPhone上のSlack WebViewへ直接Web Inspector接続はしていない。今回のlive mobile viewport screenshotは、本番URLをiPhone相当viewportで実行した検証である。
- ユーザー側のSlack内蔵ブラウザに旧HTMLが残る場合は、ページを再読み込みするか、Slack内蔵ブラウザを閉じてリンクを開き直す必要がある。

## 次の一手
1. ユーザー側でSlack内蔵ブラウザを再読み込みして`/works/ci-works`を開く。
2. それでも固定navだけになる場合は、同じ画面で再度screenshotを取得し、旧buildIdまたは別のroute遷移経路を確認する。
