import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";

const ResponsiveImage = (props) => (
	<Image alt={props.alt} layout="responsive" {...props} />
);

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import rehypeParse from "rehype-parse";
import rehypeReact from "rehype-react";

import c_Heading from "styles/heading.module.scss";
import c_blog from "styles/blog.module.scss";
import c_Post from "styles/post.module.scss";

export default function ({ res, content }) {
	console.log(res)
	return (
		<>
			<div className={c_Post.meta}>
				<h1 className={classNames(c_Post.h1, c_Heading.h1, c_Heading.h1_tag)} dangerouslySetInnerHTML={{ __html: res.title }}></h1>
				<time itemprop="datePublished">{res.date}</time>
				<time itemprop="dateModified">{res.modified}</time>
				<ul className={classNames(c_blog.tagList, c_blog.hover)}>
					{res.tags.map((e, i) => (
						<li>
							<Link href={"/blog/tag/" + e.slug}>
								<a>#{e.name}</a>
							</Link>
						</li>
					))}
				</ul>
			</div>
			<article className={c_Post.article} dangerouslySetInnerHTML={{ __html: res.content }}></article>
		</>
	);
}

import { GETpost } from "lib/fetch";
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

import { createElement } from "react";
export async function getStaticProps({ params }) {
	let res = await GETpost(params.slug);
	let content = await unified()
		// Markdown → HTML
		.use(remarkParse)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeHighlight)
		.use(rehypeStringify, { allowDangerousHtml: true })
		// HTML → React
		// .use(rehypeParse, { fragment: true }) // fragmentは必ずtrueにする
		// .use(rehypeReact, {
		// 	createElement: createElement,
		// 	components: {
		// 		a: CustomLink, // ←ここで、<a>を<CustomLink>に置き換えるよう設定
		// 	},
		// })
		.process(res.content);
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
	let res = await GETwpList("/posts?per_page=100&_fields=slug");
	res = res.map((e) => e.slug);

	// 記事に基づいてプリレンダリングしたいパスを取得します
	var paths = res.map((slug) => ({
		params: { slug },
	}));

	// ビルド時にこれらのパスだけをプリレンダリングします。
	// { fallback: false } は他のルートが404になることを意味します。
	return { paths, fallback: false };
}
