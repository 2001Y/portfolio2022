import Head from "components/Head";
import WorksList from "components/widget/WorksList"
import WorksList_post from "components/widget/WorksList_post";
import Works_view from "components/widget/Works_view";
import Link from "next/link";
import { useEffect, useState } from 'react'
import classNames from "classnames";
import Router, { useRouter } from 'next/router'

import c_V from "styles/_V.module.scss";
import c_works from "styles/works.module.scss"

import { viewF } from "lib/viewF";

export default function Output({ res, cat }) {
	const router = useRouter();
	const params = router.query;
	let title = "2001Y's Works";

	// カテゴリフィルタ
	if (params.cat) {
		res.flat().filter((e) => {
			if (e.category) {
				e.category.map((e1) => {
					if (e1.slug == params.cat) {
						title = "#" + e1.name + "｜2001Y's Works";
					}
				});
			}
			return false;
		});
		res = viewF(res)
	} 0

	return (
		<>
			<Head title={title} />
			<WorksList cat={cat} res={res} lock={false} />
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
	res.map(e => e.content = "");
	return {
		props: {
			res,
			cat
		},
	};
}