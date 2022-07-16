import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrism from "@mapbox/rehype-prism";
import rehypeSlug from "rehype-slug";

export async function md2html(e) {
	let result = await unified()
		// Markdown → HTML
		.use(remarkParse)
		.use(remarkGfm) //表対応
		.use(remarkRehype, {
			allowDangerousHtml: true, // <html>など
		})
		.use(rehypeSlug) //見出しにid
		.use(rehypePrism, {
			ignoreMissing: true, // 存在しない言語名を書いていた時に無視する
		})
		.use(rehypeStringify, { allowDangerousHtml: true })
		.process(e);
	return String(result);
}
