import WorksPost from "components/widget/works_post";
export default function ({ res, cat }) {
	const shuffle = ([...array]) => {
		for (let i = array.length - 1; i >= 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	};

	// res = shuffle(res);

	return (
		<>
			{cat.map((e, i) => (
				<>
					<h2>#{e.name}</h2>
				</>
			))}
			{res.map((e, i) => (
				<WorksPost res={e} />
			))}
		</>
	);
}
import { GETwpList } from "lib/fetch";
export async function getStaticProps() {
	let res = await GETwpList("/works");
	let cat = await GETwpList("/works_cat");
	return {
		props: {
			res, cat
		},
	};
}
