async function json(e) {
	return await fetch(process.env.wpURL + e).then((res) => res.json());
}async function json(e) {
	return await fetch(process.env.wpURL + e).then((res) => res.json());
}
export async function GETwpList(url) {
	var fetchJson = await fetch(process.env.wpURL + url);
	var totalpages = await fetchJson.headers.get("x-wp-totalpages");

	let res = await Promise.all(
		Array(Number(totalpages))
			.fill(0)
			.map(async (e, i) => {
				let a = await json(url + "&page=" + (i + 1));
				return a;
			})
	);
	return res.flat();
}