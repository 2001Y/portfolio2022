export default function ({ res }) {
	const secretKEY = process.env.recaptcha.secretKEY;

	const { name, email, recaptchaResponse } = req.body;

	const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKEY}&response=${recaptchaResponse}`;

	try {
		const recaptchaRes = await fetch(verifyUrl, { method: "POST" });

		const recaptchaJson = await recaptchaRes.json();

		res.status(200).json({ name, email, ...recaptchaJson });
	} catch (e) {
		res.status(400).json(e.error);
	}
}
