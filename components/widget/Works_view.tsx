import Image from "next/image";
import c_works from "styles/works.module.scss"

import { createElement } from "react";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeReact from "rehype-react";
import classNames from "classnames";

const CustomLink = ({ children, href }) => (
   <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
   </a>
);
const processor = unified()
   .use(rehypeParse, { fragment: true }) // fragmentは必ずtrueにする
   .use(rehypeReact, {
      createElement,
      components: {
         a: CustomLink, // ←ここで、<a>を<CustomLink>に置き換えるよう設定
      },
   });

export default function ({ res }) {
   return (
      <>
         <div
            className={c_works.main_inner}
         >
            <div>
               {res.cfs.img && (
                  <div
                     className={classNames(
                        c_works.tmb,
                        { [c_works.vertical]: res.imgSize.aspect < 1 }
                     )}
                     style={{
                        "--aspect": res.imgSize.aspect
                     }}
                  >
                     <Image
                        src={res.cfs.img}
                        height={res.imgSize.height}
                        width={res.imgSize.width}
                     />
                     {res.category && (
                        <ul className={classNames(
                           c_works.categoryList,

                        )}>
                           {res.category.map((e, i) => (
                              <li key={i}>{e.name}</li>
                           ))}
                        </ul>
                     )}
                  </div>
               )}
               {res.title && (
                  <h2 className={c_works.title}>
                     {res.title}
                  </h2>
               )}
               {(res.cfs.time || res.tags) && (
                  <ul className={c_works.meta}>
                     {res.cfs.time && (
                        <li>
                           制作期間：{res.cfs.time}
                        </li>
                     )}
                     {res.tags && (
                        <li>
                           使用技術：<ul className={c_works.tagList}>
                              {res.tags.map((e, i) => (
                                 <li key={i}>#{e.name}</li>
                              ))}
                           </ul>
                        </li>
                     )}
                  </ul>
               )}
               <article>
                  {processor.processSync(res.content).result}
               </article>
            </div>
         </div>
      </>
   )
}