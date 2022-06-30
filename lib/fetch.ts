import urlJoin from "url-join";
export async function json(e) {
	return await fetch(urlJoin(process.env.wpURL, e)).then((res) => res.json());
}

export async function GETpostList(tags) {
	var res = await fetch(
		urlJoin(
			process.env.wpURL,
			"posts?per_page=18&_fields=id,title,slug,date,voting,tags" + tags
		)
	);
	return {
		postList: await res.json(),
		totalpages: await res.headers.get("x-wp-totalpages"),
	};
}
export async function GETpost(slug) {
	var res = await json("/posts?slug=" + encodeURI(slug));
	// console.log(res);
	return res[0];
}
export async function GETwp(url) {
	let a = await json(url);
	return a;
}
export async function GETwpList(url) {
	let fetchJson = await fetch(process.env.wpURL + url);
	let totalpages = await fetchJson.headers.get("x-wp-totalpages");

	let res = await Promise.all(
		Array(Number(totalpages))
			.fill(0)
			.map(async (e, i) => {
				url = urlJoin(url, "?page=" + (i + 1));
				let a = await json(url);
				return a;
			})
	);
	return res.flat();
}

export async function tagTop() {
	var res = await json("/tags?per_page=3&orderby=count&order=desc");
	return tagList(res);
}
export async function tag(slug) {
	var res = await json("/tags?slug=" + encodeURI(slug));
	return res[0];
}
export async function tagList(res) {
	var mainTags = res.map((e, i) => e.id);

	// 各tagListの調整
	let viewTagList = []; //表示されてる全ての記事
	viewTagList = viewTagList.concat(mainTags);
	res = res
		.reverse()
		.map((e, i) => {
			let count = 0; //親タグあたりの子タグの数
			e.tagList = e.tagList.filter((e1) => {
				if (!viewTagList.includes(e1.id)) {
					if (count < 3) {
						viewTagList.push(e1.id);
						count++;
						return true;
					}
				}
				return false;
			});
			return e;
		})
		.reverse();

	// Latestタグ追加
	res.push({
		id: "latest",
		name: "All",
		// slug: "/",
		tagList: await latestTagList(),
	});
	async function latestTagList() {
		let viewTagList = res
			.map((e) => e.tagList.map((e1) => e1.id))
			.concat(mainTags)
			.flat();
		let topTag100 = await json(
			"/tags?per_page=100&orderby=count&order=desc&_fields=id,name,slug,count,allCount"
		);
		return topTag100.filter((e) => !viewTagList.includes(e.id)).slice(0, 3);
	}

	// 記事追加
	res = await Promise.all(
		res.map(async (e, i) => {
			// 各親タグの記事取得
			let fetch;
			if (e.id == "latest") {
				fetch = await GETpostList();
			} else {
				fetch = await GETpostList("&tags=" + e.id);
			}
			e.postList = fetch.postList;
			e.totalpages = fetch.totalpages;
			return e;
		})
	);
	// 記事の重複削除
	let viewPostList = []; //表示されてる全ての記事
	res = res
		.reverse()
		.map((e, i, selfArr) => {
			// 親タグ別の処理
			let count = 0; //タグ別の記事の数
			e.postList = e.postList.filter((e1, i1) => {
				// 記事ごとの処理
				if (count < 12) {
					if (!viewPostList.includes(e1.id)) {
						// 重複がない場合
						viewPostList.push(e1.id);
						count++;
						return true;
					}
				}
				return false;
			});
			return e;
		})
		.reverse();

	return res;
}
