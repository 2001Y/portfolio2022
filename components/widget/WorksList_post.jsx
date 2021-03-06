import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import c_works from "styles/works.module.scss";
import useSWR from "swr";
import classNames from "classnames";
import Router, { useRouter } from "next/router";

export default function Output({ res, countSum }) {
	const router = useRouter();
	const params = router.query;

	let dynamicRoutesName = router.pathname.split(/\[|\]/)[1];
	const queryParams = JSON.parse(JSON.stringify(router.query));
	delete queryParams[dynamicRoutesName];

	return (
		<>
			<li
				className={c_works.work}
				style={{
					"--aspectSum": res.imgSize.aspectSum,
					"--aspect": res.imgSize.aspect,
					"--gapCount": countSum - 1,
				}}
			>
				<Link
					href={{
						pathname: "/works/" + decodeURI(res.slug),
						query: { ...queryParams },
					}}
					shallow={true}
				>
					<a>
						{res.cfs.img && (
							<div
								className={classNames(c_works.tmb, {
									[c_works.youtube]: res.cfs.youtube,
								})}
							>
								<Image
									alt={res.title + "のサムネイル"}
									src={res.cfs.img}
									height={res.imgSize.height}
									width={res.imgSize.width}
								/>
							</div>
						)}
						{res.category && (
							<ul className={classNames(c_works.categoryList)}>
								{res.category.map((e2, i2) => (
									<li key={i2}>{e2.name}</li>
								))}
							</ul>
						)}
						<div className={c_works.meta}>
							<h3
								className={c_works.list_title}
								dangerouslySetInnerHTML={{ __html: res.title }}
							></h3>
							<ul>
								{res.tags && (
									<li>
										<ul className={c_works.tagList}>
											{res.tags.map((e2, i2) => (
												<li key={i2}>#{e2.name}</li>
											))}
										</ul>
									</li>
								)}
							</ul>
						</div>
					</a>
				</Link>
			</li>
		</>
	);
}
