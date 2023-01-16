import NextHead from 'next/head'
import Head from "components/Head";
import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Script from 'next/script'

import c_Heading from "styles/heading.module.scss";
import c_blog from "styles/blog.module.scss";
import c_Post from "styles/post.module.scss";


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

export default function Output({ res, content }) {
	const { asPath } = useRouter()
	useEffect(() => {
		try {
			(window.adsbygoogle = window.adsbygoogle || []).push({})
		} catch (error) {
			console.error(error);
		}
	}, [asPath])
	// console.log(res)
	return (
		<>
			<Script
				id="adsence"
				src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3750999099107987"
				crossOrigin="anonymous"
				async={true}
				strategy="afterInteractive"
				onError={(e) => { console.error('Script failed to load', e) }}
			/>
			<Head title={res.title && res.title + "｜2001Y's Blog"} />
			<div className={c_Post.meta}>
				<h1 className={classNames(c_Post.h1, c_Heading.h1, c_Heading.h1_tag)} dangerouslySetInnerHTML={{ __html: res.title }}></h1>
				<time itemProp="datePublished">{res.date}</time>
				{res.date !== res.modified && (
					<time itemProp="dateModified">{res.modified}</time>
				)}
				<ul className={classNames(c_blog.tagList, c_blog.hover)}>
					{res.tags.map((e, i) => (
						<li key={i}>
							<Link legacyBehavior href={"/blog/tag/" + e.slug}>
								<a>#{e.name}</a>
							</Link>
						</li>
					))}
				</ul>
			</div>
			<article className={c_Post.article}>
				{processor.processSync(res.content).result}
			</article>
			<div className={"kooookoku"}>
				<div key={asPath}>
					<ins className="adsbygoogle"
						style={{ display: "block" }}
						data-ad-client="ca-pub-3750999099107987"
						data-ad-slot="7157516277"
						data-ad-format="auto"
						data-full-width-responsive="true"></ins>
				</div>
				<div key={asPath}>
					<ins className="adsbygoogle"
						style={{ display: "block" }}
						data-ad-client="ca-pub-3750999099107987"
						data-ad-slot="6726245863"
						data-ad-format="auto"
						data-full-width-responsive="true"></ins>
				</div>
			</div>

		</>
	);
}

import { GETpost } from "lib/fetch";

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
export async function getStaticProps({ params }) {
	// console.log(params)
	let res = await GETpost(params.slug);
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
			res.content
				.replace(/(&lt;)/g, '<')
				.replace(/(&gt;)/g, '>')
				.replace(/(&quot;)/g, '"')
				.replace(/(&#39;)/g, "'")
				.replace(/(&amp;)/g, '&')
		);
	console.log(content)
	res.content = String(
		content
	);
	return {
		props: {
			res,
		},
	};
}

import { GETwpList } from "lib/fetch";
export async function getStaticPaths() {
	// 外部APIエンドポイントを呼び出して記事を取得します。
	let res = await GETwpList("/posts?per_page=100&_fields=slug");
	res = res.map((e) => decodeURI(e.slug));

	// 記事に基づいてプリレンダリングしたいパスを取得します
	var paths = res.map((slug) => ({
		params: { slug },
	}));

	// ビルド時にこれらのパスだけをプリレンダリングします。
	// { fallback: false } は他のルートが404になることを意味します。
	return { paths, fallback: false };
}
