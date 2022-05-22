import WorksPost from "components/widget/works_post";
export default function ({ res }) {
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
			{res.map((e, i) => (
				<WorksPost res={e} />
			))}
		</>
	);
}
import { GETwpList } from "lib/fetch";
export async function getStaticProps() {
	let res = await GETwpList("/works");
	return {
		props: {
			res,
		},
	};
}
