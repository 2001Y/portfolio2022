import Image from "next/image";

const ResponsiveImage = (props) => (
    <Image alt={props.alt} layout="responsive" {...props} />
);
const components = {
    img: ResponsiveImage,
};

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import rehypeParse from "rehype-parse";
import rehypeReact from "rehype-react";

import { useEffect, useState } from "react";
export default function ({ res, content }) {
    return (
        <>
            <h1 dangerouslySetInnerHTML={{ __html: res.title }}></h1>
            <time>{res.date}</time>
            <article dangerouslySetInnerHTML={{ __html: res.content }}></article>
        </>
    );
}

import Link from "next/link";
const CustomLink = ({
    children,
    href,
}: {
    children: string;
    href: string;
}): JSX.Element =>
    href.startsWith("/") || href === "" ? (
        <Link href={href}>
            <a>{children}</a>
        </Link>
    ) : (
        <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    );

import { json } from "lib/fetch";
import { createElement } from "react";
export async function getStaticProps({ params }) {
    let res = await json("/works?slug=" + params.slug);
    console.log(res);
    let content = await unified()
        // Markdown → HTML
        .use(remarkParse)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeHighlight)
        .use(rehypeStringify, { allowDangerousHtml: true })
        // HTML → React
        .use(rehypeParse, { fragment: true }) // fragmentは必ずtrueにする
        .use(rehypeReact, {
            createElement: createElement,
            components: {
                a: CustomLink, // ←ここで、<a>を<CustomLink>に置き換えるよう設定
            },
        })
        .process(res.content);
    res.content = String(content);
    return {
        props: {
            res: res[0],
        },
    };
}

import { GETwpList } from "lib/fetch";
export async function getStaticPaths() {
    // 外部APIエンドポイントを呼び出して記事を取得します。
    let res = await GETwpList("/works?per_page=100&_fields=slug");
    res = res.map((e) => e.slug);

    // 記事に基づいてプリレンダリングしたいパスを取得します
    var paths = res.map((slug) => ({
        params: { slug },
    }));

    // ビルド時にこれらのパスだけをプリレンダリングします。
    // { fallback: false } は他のルートが404になることを意味します。
    return { paths, fallback: false };
}
