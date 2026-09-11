import Image from "next/image";

import { MDtoHTML, HTMLtoJSX, processor } from "lib/unified"

import Contact from "components/Contact"
import Timeline_post from "components/widget/Timeline_post"

import c_photoDrop from "styles/components/photoDrop.module.scss";
import c_ptimeline from "styles/components/timeline.module.scss";

export default function Output({ res }) {
  var nowTime = new Date();
  var Y = nowTime.getFullYear() - 1 - 2001;
  let M = (9 - nowTime.getMonth()) / 12;
  let D = nowTime.getDay() / 30 / 365;


  return (
    <>
      <section>
        <p>
          工事中...🚧
        </p>
        {/* 
        <h2>equipment 機材</h2>
        <p>
          dob: 2001/09/20
          <br />
          age: {Y + M + D}
        </p> */}
        <article>{processor.processSync(res.content).result}</article>
        {/* <article>{HTMLtoJSX(MDtoHTML(res.content))}</article> */}
        {/* <button onClick={onSubmit}>ttt</button> */}
        <Contact name={"About"}></Contact>
      </section>
      <section>
        <ul className={c_photoDrop.box}>
          {res.profile_imgList.map((e) => (
            <li key={e.id || e.img} className={c_photoDrop.img} style={{ "--ram": ram(e.img) + "%" } as React.CSSProperties}>
              <Image
                alt={res.title + "のサムネイル"}
                src={e.img}
                width={300}
                height={300 / e.size.aspect}
                style={{
                  maxInlineSize: "unset"
                  // height: "auto","
                  // objectFit: "cover"
                }}
              />
            </li>
          ))}
        </ul>
        {/* スキルシート */}
        <ul>
          {res.cfs.skill_list.map((skill_list) => (
            <li key={skill_list.id || skill_list.skill_cat_name}>
              {skill_list.skill_cat_name}
              <ul>
                {skill_list.skill.map((skill) => (
                  <li key={skill.id || skill.skill_name}>{skill.skill_name}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className={c_ptimeline.timeline} style={{ "--min": "2", "--max": "5" } as React.CSSProperties}>
        <Timeline_post no="1" color="red" />
        <Timeline_post no="2" color="blue" />
        <Timeline_post no="3" color="#999" />
        <Timeline_post no="4" color="yellow" />
        <Timeline_post no="5" color="red" />
        <Timeline_post no="6" color="blue" />
        <Timeline_post no="7" color="#999" />
        <Timeline_post no="8" color="yellow" />
        <Timeline_post no="9" color="red" />
        <Timeline_post no="10" color="blue" />
        <Timeline_post no="11" color="#999" />
        <Timeline_post no="12" color="yellow" />
        <Timeline_post no="13" color="red" />
        <Timeline_post no="14" color="blue" />
        <Timeline_post no="15" color="#999" />
        <Timeline_post no="16" color="yellow" />
      </section>

    </>
  );
}

import { GETwp } from "lib/fetch";
import { createElement } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from 'remark-gfm'
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrism from '@mapbox/rehype-prism';
import rehypeParse from "rehype-parse";
import { Fragment } from 'react'
import rehypeReact from "rehype-react";
import rehypeSlug from 'rehype-slug'

function ram(seed = "") {
  const hash = Array.from(seed).reduce((value, character) =>
    (value * 31 + character.charCodeAt(0)) % 101,
    0,
  );
  return hash - 50;
}

export async function getStaticProps() {
  let res = await GETwp("/pages?slug=about");

  res = await Promise.all(res.map(async (e) => {
    let content = await unified()
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
      .process(
        e.content
          .replace(/(&lt;)/g, '<')
          .replace(/(&gt;)/g, '>')
          .replace(/(&quot;)/g, '"')
          .replace(/(&#39;)/g, "'")
          .replace(/(&amp;)/g, '&')
      );
    e.content = String(content);

    return e;
  }));

  res = res[0];
  // console.log(res);
  // res.content = await MDtoHTML(res.content);
  return {
    props: {
      res
    },
  };
}