import Head from "components/Head";
import WorksList_post from "components/widget/WorksList_post";
import { viewF } from "lib/viewF.ts";

import { useLayoutEffect, useEffect } from "react";
import Router, { useRouter } from "next/router";
import classNames from "classnames";
import Link from "next/link";

import c_V from "styles/_V.module.scss";
import c_works from "styles/works.module.scss";

export default function Output({ res, cat, lock }) {
	const router = useRouter();
	const params = router.query;
	let title = "2001Y's Works";

	// カテゴリフィルタ
	if (params.cat) {
		let rr = [];
		res.flat().filter((e) => {
			if (e.category) {
				e.category.map((e1) => {
					if (e1.slug == params.cat) {
						rr.push(e);
						title = "#" + e1.name + "｜2001Y's Works";
						return true;
					}
				});
			}
			return false;
		});
		res = rr;
	}

	res = viewF(res);

	const sessionName = "scrollSave";
	// if (typeof window !== "undefined") {
	useLayoutEffect(() => {
		let elm = document.querySelector("#scroll");
		// スクロール位置の復元
		if (sessionStorage.getItem(sessionName)) {
			elm.scrollTop = sessionStorage.getItem(sessionName);
			sessionStorage.removeItem(sessionName);
		} else {
			elm.scrollTop = 0;
		}
	});
	// }
	useEffect(() => {
		let elm = document.querySelector("#scroll");
		const onRouteChangeStart = (url) => {
			// スクロール位置の保存
			url = new URL("http://example.com" + url);
			let now = router.pathname.split("/");
			let next = url.pathname.split("/");
			if (
				(now[1] == "" && next[1] == "works") ||
				(now[1] == "works" && next[1] == "")
			) {
				sessionStorage.setItem(sessionName, elm.scrollTop);
			}
			if (now == next) {
				sessionStorage.setItem(sessionName, "0");
			}
		};
		// このpageを離れる直前に発火
		Router.events.on("routeChangeStart", onRouteChangeStart);
		return () => {
			Router.events.off("routeChangeStart", onRouteChangeStart);
		};
	}, []);

	return (
		<>
			{/* カテゴリーリスト */}
			<ul className={c_works.catList} id="tagList">
				<li>
					<Link href={"/"} shallow={true} scroll={true}>
						<a className={classNames(c_V.animeBG_font)}>all</a>
					</Link>
				</li>
				{cat.map((e, i) => (
					<li key={i}>
						<Link href={"?cat=" + e.slug} shallow={true} scroll={true}>
							<a className={classNames(c_V.animeBG_font)}>#{e.name}</a>
						</Link>
						<ul className={classNames(c_works.subCatList, c_works.tagList)}>
							{e.tagList.map((e1, i1) => (
								<li key={i1}>{e1.name}</li>
							))}
						</ul>
					</li>
				))}
			</ul>

			{/* メイン */}
			<section
				className={classNames(c_works.wrap, { [c_works.lock]: lock })}
				id="wrap"
			>
				<div className={c_works.scroll} id="scroll">
					<ul className={c_works.list} id="box_">
						{res.map((e, i) => (
							<li key={i}>
								<ul>
									{e.map((e1, i1) => (
										<WorksList_post key={i1} res={e1} countSum={e.length} />
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
// import { GETwpList } from "lib/fetch";
// import { md2html } from "lib/unified";
// export async function getStaticProps() {
// 	let res = await GETwpList("/works");
// 	let cat = await GETwpList("/works_cat");
// 	res.map(async (e, i) => {
// 		e.content = await md2html(e.content);
// 	});
// 	return {
// 		props: {
// 			res,
// 			cat,
// 		},
// 	};
// }
