import Head from "components/Head";
import Link from "next/link";

import c_works from "styles/works.module.scss";

import { useEffect, useState, createElement } from "react";
import Router, { useRouter } from "next/router";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeReact from "rehype-react";
import classNames from "classnames";

import Carousel from "components/Carousel";

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

export default function Output({ res }) {
	const router = useRouter();
	// SSR時点でも本文を表示する。モバイルSafariでhydrationが遅延・失敗しても空画面にしない。
	let [state_open, set_state_open] = useState(true);

	let dynamicRoutesName = router.pathname.split(/\[|\]/)[1];
	const queryParams = JSON.parse(JSON.stringify(router.query));
	delete queryParams[dynamicRoutesName];

	const handleKeyUp = (event) => {
		if (event.key === 'Escape') {
			delayPushPage("/");
		}
	};

	useEffect(() => {
		set_state_open(true);
		document.addEventListener('keyup', handleKeyUp);
		return () => {
			document.removeEventListener('keyup', handleKeyUp);
		};
	}, []);

	function delayPushPage(url) {
		set_state_open(false);
		router.prefetch(url);
		setTimeout(() => {
			Router.push(
				{
					pathname: url,
					query: {
						...queryParams,
					},
				},
				undefined,
				{
					shallow: true,
				}
			);
		}, 0.3 * 1000);
	}

	const renderContent = (content) => {
		if (!content) return null;
		try {
			return processor.processSync(content).result;
		} catch (error) {
			console.error("Works content rendering failed", error);
			return <div dangerouslySetInnerHTML={{ __html: content }} />;
		}
	};

	return (
		<>
			<Head
				title={res.title && res.title + "｜2001Y's Works"}
				img={res.cfs.img}
			/>

			<section
				className={classNames(c_works.WorksOverlay, {
					[c_works.open]: state_open,
				})}
				style={{ opacity: state_open ? 1 : 0 }}
				onClick={(e) => {
					if (e.target.className.indexOf(c_works.WorksOverlay) == 0) {
						delayPushPage("/");
					}
				}}
			>
				<div className={c_works.main} style={{ transform: state_open ? "translateY(0)" : "translateY(100%)" }}>

					{res.cfs.embed && (
						<div className={classNames(c_works.tmbArea, c_works.modalWindow)}>
							<Carousel className={classNames(c_works.tmb)} res={res.cfs.embed} imgSize={res.imgSize} />
						</div>
					)}

					<div className={classNames(c_works.mainArea, c_works.modalWindow)}>
						<article>
							<div className={c_works.meta}>
								{res.title && (
									<h2
										className={c_works.title}
										dangerouslySetInnerHTML={{ __html: res.title_html }}
									></h2>
								)}
								{res.tags && (
									<ul className={c_works.tagList}>
										{res.tags.map((e, i) => (
											<li key={i}>#{e.name}</li>
										))}
									</ul>
								)}
								{res.cfs.time && <li>{res.cfs.time}</li>}
								{res.cfs.location && <li>{res.cfs.location}</li>}
							</div>
							{renderContent(res.content)}
						</article>

					</div>
					<footer>
						©︎ 2015-2023, 2001Y<br />
						引用や転載の際は当URLを掲載すること。
					</footer>
				</div>

				{/* Task: 関連記事 */}
				{/* {res.child && (
					<div
						className={classNames(c_works.relatedScrollBox, {
							[c_works.open]: state_open,
						})}
					>
						<ul>
							{res.child.map((e, i) => (
								<WorksList_post key={i} res={e} countSum={res.child.length} />
							))}
						</ul>
					</div>
				)} */}
			</section>

			{/* <div
				className={classNames(c_works.backButton)}
			>
				Back to Works
			</div> */}
		</>
	);
}
