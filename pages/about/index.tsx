// import {  useGoogleReCaptcha } from "react-google-recaptcha-v3";
// const { executeRecaptcha } = useGoogleReCaptcha();
// const onSubmit = async () => {
//     const reCaptchaToken = await executeRecaptcha("contactPage");
//     console.log(reCaptchaToken)
// };

export default function Output({ res }) {
	var nowTime = new Date();
	var Y = nowTime.getFullYear() - 1 - 2001;
	let M = (9 - nowTime.getMonth()) / 12;
	let D = nowTime.getDay() / 30 / 365;
	return (
		<>
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
			<h2>Contact</h2>
			{/* <button onClick={onSubmit}>ttt</button> */}
			<form action="https://api.staticforms.xyz/submit" method="post">
				<h6>お名前</h6>
				<input type="text" name="name" placeholder="田中 太郎" required />
				<h6>メールアドレス</h6>
				<input
					type="text"
					name="email"
					placeholder="mail@example.com"
					required
				/>
				<textarea
					name="$問い合わせ"
					placeholder="その他、ご自由にご記入ください。"
				></textarea>
				<input type="text" name="honeypot" className="honeypot" />
				<input type="hidden" name="replyTo" value="@" />
				<input
					type="hidden"
					name="redirectTo"
					value="https://2001y.me/contact-done"
				/>
				<input
					type="hidden"
					name="accessKey"
					value="44801933-9e6a-4b67-a226-63fe8599568b"
				/>
				<input type="submit" value="送信" />
			</form>
		</>
	);
}
