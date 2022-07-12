import Head from "components/Head";
import WorksList_post from "components/widget/WorksList_post";
import Works_view from "components/widget/Works_view";
import Link from "next/link";
import { useEffect, useState } from 'react'
import classNames from "classnames";
import Router, { useRouter } from 'next/router'

import c_V from "styles/_V.module.scss";
import c_works from "styles/works.module.scss"



export default function Output({ res, cat }) {
	const router = useRouter();
	const params = router.query

	let title = "2001Y's Works";

	let postRes = {};
	if (params.post) {
		postRes = res.find((e) => e.slug == params.post);
	}

	if (params.cat) {
		let rr = []
		res.flat().filter((e) => {
			if (e.category) {
				e.category.map((e1) => {
					if (e1.slug == params.cat) {
						rr.push(e)
						title = "#" + e1.name + "｜2001Y's Works";
						return true
					}
				})
			}
			return false
		})
		res = rr
	}
	res = viewF(res, 3.3)

	// useEffect(() => {
	// 	resize();
	// 	window.onresize = resize;
	// 	function resize() {

	// 		let boxElm = document.querySelector("#box_") as HTMLElement;
	// 		let bodyHeight = document.documentElement.scrollHeight;
	// 		let boxHeight = boxElm.offsetHeight;
	// 		// onscroll();
	// 		// window.onscroll = onscroll;
	// 		document.addEventListener('scroll', onscroll, { passive: true });
	// 		var ticking = false;
	// 		function onscroll() {
	// 			if (!ticking) {
	// 				requestAnimationFrame(function () {
	// 					ticking = false;
	// 					let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	// 					let scrollRate = scrollTop / bodyHeight;
	// 					let position = -1 * scrollRate * boxHeight;
	// 					boxElm.style.transform = `translate3d(0, ${position}px, 0)`;
	// 					// console.log(position)
	// 				});
	// 				ticking = true;
	// 			}
	// 		}

	// 	}
	// 	return () => {
	// 		// window.removeEventListener("touchmove", onscroll);
	// 		document.removeEventListener("scroll", onscroll);
	// 	};
	// });

	function pushQuery(name, value) {
		Router.push(
			{
				query: {
					...router.query,
					[name]: value
				},
			},
			undefined,
			{ shallow: true }
		);
	}

	return (
		<>
			<Head title={title} />
			{params.post && <>
				<section
					className={c_works.WorksOverlay}
					onClick={(e) => {
						let elm = e.target as HTMLElement;
						elm.className == c_works.WorksOverlay && pushQuery("post", "");
					}}
				>
					{/* <ImgLupe
						img={{
							src: postRes.cfs.img,
							width: postRes.imgSize.width,
							height: postRes.imgSize.height
						}}

					/> */}
					<Works_view res={postRes} />
				</section>
			</>}
			<ul className={c_works.catList} id="tagList">
				<li>
					<Link href={"/"}>
						<a
							className={classNames(c_V.animeBG_font)}
							onClick={() => { pushQuery("cat", "") }}
						>all</a>
					</Link>
				</li>
				{cat.map((e, i) => (
					<li key={i}>
						<Link href={"?cat=" + e.slug}>
							<a
								className={classNames(c_V.animeBG_font)}
								onClick={() => { pushQuery("cat", e.slug) }}
							>
								#{e.name}
								{/* <ul className={classNames(c_works.subCatList, c_works.tagList)} >
									{e.tagList.map((e1, i) => (
										<li>{e1.name}</li>
									))}
								</ul> */}
							</a>
						</Link>
					</li>
				))}
			</ul>
			<section className={c_works.wrap} id="wrap">
				<div className={c_works.scroll}>
					<ul className={c_works.list} id="box_">
						{res.map((e, i) => (
							<li key={i}>
								<ul>
									{e.map((e1, i1) => (
										<WorksList_post
											key={i1}
											res={e1}
											countSum={e.length}
										/>
									))}
								</ul>
							</li>
						))}
					</ul>
				</div>
			</section>
		</>
	);
}
import { GETwpList } from "lib/fetch";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from 'remark-gfm'
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrism from '@mapbox/rehype-prism';
import rehypeSlug from 'rehype-slug'
export async function getStaticProps() {
	let res = await GETwpList("/works");
	let cat = await GETwpList("/works_cat");
	res.map(async (e, i) => {
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
	})
	return {
		props: {
			res,
			cat
		},
	};
}
function viewF(res, level) {
	// aspectの合計5までを区切る
	let aspectSum = 0;
	let result = [];
	let resChild = []
	let aspectList = [];
	res.flat().map((e, i) => {
		aspectSum += e.imgSize.aspect;
		resChild.push(e);
		if (level <= aspectSum || i == (res.length - 1)) {
			// 行終了
			aspectList.push(aspectSum);
			result.push(resChild);
			aspectSum = 0;
			resChild = [];
		}
	})
	result = result.map((e, i) => {
		let aspect = aspectList[i];
		return e.map((e1, i1) => {
			e1.imgSize.widthRate = e1.imgSize.aspect / aspect;
			e1.imgSize.aspectSum = aspect;
			// console.log(e1.imgSize.aspectSum)
			return e1
		})
	})
	return result
}