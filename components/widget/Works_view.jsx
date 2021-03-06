import Head from "components/Head";
import Image from "next/image";
import Link from "next/link";
import c_works from "styles/works.module.scss";

import { useEffect, useLayoutEffect, useState, createElement } from "react";
import Router, { useRouter } from "next/router";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeReact from "rehype-react";
import classNames from "classnames";

import ImgLupe from "components/ImgLupe";
import WorksList_post from "components/widget/WorksList_post";

const CustomLink = ({ children, href }) => (
	<a href={href} target="_blank" rel="noopener noreferrer">
		{children}
	</a>
);
const CustomImg = ({ src, width, height, alt }) => (
	<Image src={src} alt={alt} />
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
	let params = router.query;
	let [state_open, set_state_open] = useState(false);
	let [state_youtube, set_state_youtube] = useState(false);
	const [state_ImgLupe, set_state_ImgLupe] = useState(false);

	let dynamicRoutesName = router.pathname.split(/\[|\]/)[1];
	const queryParams = JSON.parse(JSON.stringify(router.query));
	delete queryParams[dynamicRoutesName];

	useEffect(() => {
		set_state_open(true);
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
				onClick={(e) => {
					console.log(e.target.className.indexOf(c_works.WorksOverlay));
					if (e.target.className.indexOf(c_works.WorksOverlay) == 0) {
						delayPushPage("/");
					}
				}}
			>
				<ImgLupe
					src={res.cfs.img}
					height={res.imgSize.height}
					width={res.imgSize.width}
					alt={res.title + "のサムネイル"}
					position={state_ImgLupe}
				/>
				<div className={c_works.main}>
					<div className={c_works.main_inner}>
						{res.cfs.img && (
							<div
								className={classNames(c_works.tmb, {
									[c_works.vertical]: res.imgSize.aspect < 1,
									[c_works.youtube]: res.cfs.youtube,
								})}
								style={{
									"--aspect": res.imgSize.aspect,
								}}
								onClick={() => set_state_youtube(res.cfs.youtube)}
								// onMouseEnter={() => set_state_ImgLupe(true)}
								onMouseMove={(e) => {
									const rect = e.currentTarget.getBoundingClientRect();
									let position = {
										x: ((e.clientX - rect.left) / rect.width) * 100,
										y: ((e.clientY - rect.top) / rect.height) * 100,
									};
									set_state_ImgLupe(position);
								}}
								onMouseLeave={() => set_state_ImgLupe(false)}
							>
								{res.cfs.youtube && state_youtube && (
									<iframe
										className={classNames(c_works.youtube, {
											[c_works.play]: state_youtube,
										})}
										src={
											"https://www.youtube.com/embed/" +
											state_youtube +
											"?autoplay=1"
										}
										title={res.title}
										frameBorder="0"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
									></iframe>
								)}
								<Image
									src={res.cfs.img}
									height={res.imgSize.height}
									width={res.imgSize.width}
									alt={res.title + "のサムネイル"}
								/>
								{res.category && (
									<ul className={classNames(c_works.categoryList)}>
										{res.category.map((e, i) => (
											<li key={i}>{e.name}</li>
										))}
									</ul>
								)}
							</div>
						)}
						{res.title && (
							<h2
								className={c_works.title}
								dangerouslySetInnerHTML={{ __html: res.title }}
							></h2>
						)}
						{(res.cfs.time || res.tags || res.cfs.location) && (
							<ul className={c_works.meta}>
								{res.tags && (
									<li>
										<ul className={c_works.tagList}>
											{res.tags.map((e, i) => (
												<li key={i}>#{e.name}</li>
											))}
										</ul>
									</li>
								)}
								{res.cfs.time && <li>{res.cfs.time}</li>}
								{res.cfs.location && <li>{res.cfs.location}</li>}
							</ul>
						)}
						{res.content && (
							<article>{processor.processSync(res.content).result}</article>
						)}
					</div>
				</div>

				{/* Task: 関連記事 */}
				{res.child && (
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
				)}
			</section>
		</>
	);
}
