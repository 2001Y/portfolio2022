import Link from "next/link";
import Image from "next/image";

import Blog_post from "components/widget/blog_post";
import { GETpostList } from "lib/fetch";
import { useState, useEffect } from "react";
import c_blog from "styles/blog.module.scss";
import c_Heading from "styles/heading.module.scss";
export default function ({ res }) {
	let [state_pageNumber, setPageNumber] = useState([1, 1, 1, 1]);
	let [state_nextPageList, setNextPageList] = useState([[], [], [], []]);

	async function nextPageBlogList(i, id) {
		let pageNumber = Array.from(state_pageNumber);
		let page = pageNumber[i] + 1;
		pageNumber[i] = page;
		setPageNumber(pageNumber);

		let postList;
		if (id == "latest") {
			postList = await GETpostList("&per_page=9&page=" + page);
		} else {
			postList = await GETpostList("&per_page=9&page=" + page + "&tags=" + id);
		}
		let nextPageList = Array.from(state_nextPageList);
		nextPageList[i] = [...state_nextPageList[i], ...postList];
		setNextPageList(nextPageList);
	}
	return (
		<>
			<ol className={c_blog.postSection}>
				{res.map((e, i) => (
					<li key={i}>
						<div className={c_blog.title}>
							<h2 className={c_Heading.h2}>
								<Link href={"/blog/tag/" + e.slug}>
									<a>
										#{e.name} - {e.allCount}
									</a>
								</Link>
							</h2>
							<ol className={c_blog.tagList}>
								{e.tagList.map((e1, i1) => (
									<li key={i1}>
										<Link href={"/blog/tag/" + e1.slug}>
											<a>
												#{e1.name} - {e1.allCount}
											</a>
										</Link>
									</li>
								))}
							</ol>
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
							<li onClick={() => nextPageBlogList(i, e.id)}>NEXT</li>
						</ul>
					</li>
				))}
			</ol>
		</>
	);
}
