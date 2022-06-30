import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";

const ResponsiveImage = (props) => (
	<Image alt={props.alt} layout="responsive" {...props} />
);

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
	// console.log(res)
	return (
		<>
			<div className={c_Post.meta}>
				<h1
					className={classNames(c_Post.h1, c_Heading.h1, c_Heading.h1_tag)}
					dangerouslySetInnerHTML={{ __html: res.title }}></h1>
				{/* <time itemProp="datePublished">{res.date}</time>
				{res.date !== res.modified && (
					<time itemProp="dateModified">{res.modified}</time>
				)} */}
				{/* <ul className={classNames(c_blog.tagList, c_blog.hover)}>
					{res.tags.map((e, i) => (
						<li>
							<Link href={"/blog/tag/" + e.slug}>
								<a>#{e.name}</a>
							</Link>
						</li>
					))}
				</ul> */}
			</div>
			<article className={c_Post.article}>
				{processor.processSync(res.content).result}
			</article>
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
import rehypeReact from "rehype-react";
import rehypeSlug from 'rehype-slug'
export async function getStaticProps({ params }) {
	let res = await GETwp("/works?slug=" + encodeURI(params.slug));
	res = res[0];
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
		.process(res.content);
	console.log(content)
	res.content = String(content);
	return {
		props: {
			res,
		},
	};
}

import { GETwpList } from "lib/fetch";
export async function getStaticPaths() {
	// 外部APIエンドポイントを呼び出して記事を取得します。
	let res = await GETwpList("/works?per_page=100&_fields=slug");
	res = res.map((e) => decodeURI(e.slug));

	// 記事に基づいてプリレンダリングしたいパスを取得します
	var paths = res.map((slug) => ({
		params: { slug },
	}));

	// ビルド時にこれらのパスだけをプリレンダリングします。
	// { fallback: false } は他のルートが404になることを意味します。
	return { paths, fallback: false };
}
