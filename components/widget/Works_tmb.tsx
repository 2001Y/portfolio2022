export default function Output({ res, cat }) {
	const router = useRouter();
	const params = router.query

	let title = "2001Y's Works";

	let postRes = {};
	if (params.post) {
		postRes = res.find((e) => e.slug == params.post);
	}

	if (params.cat) {
		let rr = []
		res.flat().filter((e) => {
			if (e.category) {
				e.category.map((e1) => {
					if (e1.slug == params.cat) {
						rr.push(e)
						title = "#" + e1.name + "｜2001Y's Works";
						return true
					}
				})
			}
			return false
		})
		res = rr
	}
	res = viewF(res, 3.3)

	useEffect(() => {
		resize()
		window.onresize = resize;
		return () => window.removeEventListener("scroll", resize);
	});
	var timer = null;
	function resize() {
		window.removeEventListener("scroll", resize);
		// 斜めスクロール
		let boxElm = document.querySelector("#box_") as HTMLElement;
		let bodyHeight = document.documentElement.scrollHeight;
		let innerHeight = window.innerHeight;
		let boxHeight = boxElm.offsetHeight;
		onscroll();
		window.onscroll = onscroll;
		function onscroll() {
			// clearTimeout(timer);
			// timer = setTimeout(function () {
			let scrollRate = document.documentElement.scrollTop / bodyHeight;
			let position = -1 * scrollRate * boxHeight;
			boxElm.style.transform = `translate3d(0, ${position}px, 0)`;
			// boxElm.style = ` ${position}px`;
			// boxElm.style.setProperty('--position', `${position}px`);
			// }, 16);
		}
	}

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
			<Head title={title} />
			{params.post && <>
				<section
					className={c_works.WorksOverlay}
					onClick={(e) => {
						let elm = e.target as HTMLElement;
						elm.className == c_works.WorksOverlay && pushQuery("post", "");
					}}
				>
					<div className={c_works.main} >
						<Works_view res={postRes} />
					</div>
				</section>
			</>}
			<ul className={c_works.catList} id="tagList">
				<li>
					<Link href={"/"}>
						<a
							className={classNames(c_V.animeBG_font)}
							onClick={() => { pushQuery("cat", "") }}
						>all</a>
					</Link>
				</li>
				{cat.map((e, i) => (
					<li key={i}>
						<Link href={"?cat=" + e.slug}>
							<a
								className={classNames(c_V.animeBG_font)}
								onClick={() => { pushQuery("cat", e.slug) }}
							>
								#{e.name}
							</a>
						</Link>
					</li>
				))}
			</ul>
			<div className={c_works.wrap} id="wrap">
				<div className={c_works.boxW}>
					<ul className={c_works.list} id="box_">
						{res.map((e, i) => (
							<li key={i}>
								<ul>
									{e.map((e1, i1) => (
										<WorksList_post
											key={i1}
											res={e1}
											countSum={e.length}
										/>
									))}
								</ul>
							</li>
						))}
					</ul>
				</div>
			</div>
			<section id="box">
			</section>
		</>
	);
}