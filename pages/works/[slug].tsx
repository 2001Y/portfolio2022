import Head from "components/Head";
import WorksList from "components/widget/WorksList"
import Works_view from "components/widget/Works_view";
import { useRouter } from 'next/router'

export default function Output({ res, cat }) {
   const router = useRouter();
   let params = router.query;

   let title = "2001Y's Works";
   // 個別ページ
   let postRes = res.find((e) => encodeURI(decodeURI(e.slug)) == encodeURI(String(params.slug)));
   return (
      <>
         <Head title={title} />

         {/* 個別ページ */}
         <Works_view res={postRes} />

         {/* メイン */}
         <WorksList cat={cat} res={res} lock={false} />
      </>
   );
}

import { GETwpList } from "lib/fetch";
import { unified } from "unified";
import fetchFigma from "lib/fetchFigma";
import remarkParse from "remark-parse";
import remarkGfm from 'remark-gfm'
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrism from '@mapbox/rehype-prism';
import rehypeSlug from 'rehype-slug'
export async function getStaticProps({ params }) {
   let res = await GETwpList("/works");
   let cat = await GETwpList("/works_cat");
   await Promise.all(res.map(async (e, i) => {
      if (e.slug == params.slug) {

         // 本文
         let result = await unified()
            // Markdown → HTML
            .use(remarkParse)
            .use(remarkGfm) //表対応
            .use(remarkRehype, {
               allowDangerousHtml: true // <html>など
            })
            .use(rehypeSlug) //見出しにid
            .use(rehypePrism, {
               ignoreMissing: true  // 存在しない言語名を書いていた時に無視する
            })
            .use(rehypeStringify, { allowDangerousHtml: true })
            .process(e.content);
         e.content = String(result);

         // タイトル
         let title = e.title;
         const segmenterJp = new Intl.Segmenter('ja-JP', { granularity: 'word' });
         const segments = segmenterJp.segment(title);
         title = Array.from(segments).map((target) => target.segment == '\n' ? '<br>' : `<span style="display: inline-block">${target.segment}</span>`).join('');
         e.title_html = title;

         // カールセル
         if (e.cfs.embed) {
            e.cfs.embed = await Promise.all(
               e.cfs.embed.map(async (embeds, i) => {
                  let figma_fileID = embeds.figma_fileID;
                  let figma_pageName = embeds.figma_pageName;
                  if (figma_fileID && figma_pageName) {
                     return await fetchFigma(figma_fileID, figma_pageName);
                  }
                  return embeds;
               })
            );
            e.cfs.embed = e.cfs.embed.flat();

         } else {
            e.cfs.img && (e.cfs.embed = [{ image: e.cfs.img }]);
            e.cfs.youtube && (e.cfs.embed = [{ youtube: e.cfs.youtube }]);
         }
      } else {
         e.content = "";
      }
   }));

   return {
      props: {
         res,
         cat,
      },
   };
}

export async function getStaticPaths() {
   // 外部APIエンドポイントを呼び出して記事を取得します。
   let res = await GETwpList("/works?per_page=100");
   res = res.map((e) => decodeURI(e.slug));

   // 記事に基づいてプリレンダリングしたいパスを取得します
   var paths = res.map((slug) => ({
      params: { slug },
   }));

   // ビルド時にこれらのパスだけをプリレンダリングします。
   // { fallback: false } は他のルートが404になることを意味します。
   return { paths, fallback: false };
}
