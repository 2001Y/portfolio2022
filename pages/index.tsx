import Head from "components/Head";
import WorksList from "components/widget/WorksList"

export default function Output({ res, cat }) {
	let title = "2001Y's Works";

	return (
		<>
			<Head title={title} />
			<WorksList cat={cat} res={res} lock={false} />
		</>
	);
}
import { GETwpList } from "lib/fetch";
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