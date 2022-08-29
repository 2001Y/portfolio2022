import Image from "next/image";

import Contact from "components/Contact"

import c_photoDrop from "styles/components/photoDrop.module.scss";

export default function Output({ res }) {
	var nowTime = new Date();
	var Y = nowTime.getFullYear() - 1 - 2001;
	let M = (9 - nowTime.getMonth()) / 12;
	let D = nowTime.getDay() / 30 / 365;

	function ram() {
		var min = -50;
		var max = 50;
		return Math.floor(Math.random() * (max + 1 - min)) + min;
	}
	return (
		<>
			<section>
				<p>工事中...🚧<br /><br /><br /><br /></p>
				<h1>Yoshiki TAMURA</h1>
				<p>
					武蔵野美術大学 造形構想学部
					<br />
					クリエイティブイノベーション学科
				</p>
				<h2>equipment 機材</h2>
				<p>
					dob: 2001/09/20
					<br />
					age: {Y + M + D}
				</p>
				{/* <article>{html2jsx().processSync(res.content).result}</article> */}
				<h2>Contact</h2>
				{/* <button onClick={onSubmit}>ttt</button> */}
				<Contact name={"About"}></Contact>
			</section>
			<ul className={c_photoDrop.box}>
				{res.profile_imgList.map((e, i) => (
					<li key={i} className={c_photoDrop.img} style={{ "--ram": ram() + "%" }}>
						<Image
							alt={res.title + "のサムネイル"}
							src={e.img}
							width={500}
							height={500 / e.size.aspect}
						/>
					</li>
				))}
			</ul>
		</>
	);
}

import { GETwp } from "lib/fetch";
import { md2html } from "lib/unified"
export async function getStaticProps() {
	let res = await GETwp("/pages?slug=about");
	res = res[0];
	res.content = await md2html(res.content);
	return {
		props: {
			res
		},
	};
}