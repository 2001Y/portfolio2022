import Head from "components/Head";
import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";

import Blog_post from "components/widget/blog_post";
import { GETpostList } from "lib/fetch";
import { useState, useEffect } from "react";
import c_blog from "styles/blog.module.scss";
import c_Heading from "styles/heading.module.scss";
import c_V from "styles/_V.module.scss";

import { InView } from 'react-intersection-observer';

export default function Output({ res }) {
	let [state_pageNumber, setPageNumber] = useState([1, 1, 1, 1]);
	let [state_nextPageList, setNextPageList] = useState([[], [], [], []]);

	let title = "2001Y's Blog";
	if (res[0].name != "All") {
		title = "tag:" + res[0].name + "｜" + title;
	}
	// const [ref, inView] = useInView({
	// 	rootMargin: '-100px 0px',
	// });

	async function nextPageBlogList(i, id) {
		let pageNumber = Array.from(state_pageNumber);
		let page = pageNumber[i] + 1;
		pageNumber[i] = page;
		setPageNumber(pageNumber);

		let postList;
		if (id == "latest") {
			postList = await GETpostList("&page=" + page);
		} else {
			postList = await GETpostList("&page=" + page + "&tags=" + id);
		}
		postList = postList.postList;
		let nextPageList = Array.from(state_nextPageList);
		nextPageList[i] = [...state_nextPageList[i], ...postList];
		setNextPageList(nextPageList);
	}
	// console.log(res)
	return (
		<>
			<Head title={title} />
			<ol className={c_blog.postSection}>
				{res.map((e, i) => (
					<li key={i} data-count={e.allCount}>
						<div className={classNames(c_blog.title)}>
							<div className={c_blog.title_inner}>
								<h2 className={classNames(c_Heading.h2, c_Heading.h2_tag)}>
									<Link href={"/blog/tag/" + e.slug}>
										<a className={classNames(c_V.animeBG_font)}>#{e.name}</a>
									</Link>
								</h2>
								<ol className={classNames(c_blog.tagList, c_blog.hover)}>
									{e.tagList.map((e1, i1) => (
										<li key={i1}>
											<Link href={"/blog/tag/" + e1.slug}>
												<a>
													#{e1.name}({e1.allCount})
												</a>
											</Link>
										</li>
									))}
									<li>etc.</li>
								</ol>
							</div>
						</div>
						<ul className={c_blog.postList}>
							{e.postList.map((e1, i1) => (
								<li key={i1}>
									<Blog_post res={e1} />
								</li>
							))}
							{state_nextPageList[i].map((e1, i1) => (
								<li key={i1}>
									<Blog_post res={e1} />
								</li>
							))}
							{(Array.from(state_pageNumber)[i] !== Number(e.totalpages)) &&
								<InView as="li" onChange={() => nextPageBlogList(i, e.id)}>
									読み込み中...
								</InView>
							}
						</ul>
					</li>
				))}
			</ol>
		</>
	);
}
