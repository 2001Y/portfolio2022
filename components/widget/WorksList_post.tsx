import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from 'react'
import c_works from "styles/works.module.scss"
import useSWR from 'swr';
import classNames from "classnames";
import Router, { useRouter } from 'next/router'

export default function ({ work, state }) {
	const router = useRouter();
	const params = router.query
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
			<li style={{
				"--aspectSum": work.imgSize.aspectSum,
				"--aspect": work.imgSize.aspect,
			}}
				onClick={() => { pushQuery("post", work.slug) }}

			>
				{/* <Link href={"/works/" + work.slug}>
					<a> */}
				{work.cfs.img && (
					<div className={c_works.tmb} >
						<Image
							src={work.cfs.img}
							layout={"fill"}
							height={work.imgSize.height}
							width={work.imgSize.width}
						/>
					</div>
				)}
				<div className={c_works.meta} >
					<h3 className={c_works.list_title} dangerouslySetInnerHTML={{ __html: work.title }}></h3>
					<ul>
						{work.tags && (
							<li>
								<ul>
									{work.tags.map((e2, i2) => (
										<li key={i2}>
											#{e2.name}
										</li>
									))}
								</ul>
							</li>
						)}
					</ul>
				</div>
				{work.category && (
					<>
						<ul className={classNames(
							c_works.categoryList,

						)}>
							{work.category.map((e2, i2) => (
								<li key={i2}>
									{e2.name}
								</li>
							))}
						</ul>
					</>
				)}
				{/* </a>
				</Link> */}
			</li>
		</>
	);
}
