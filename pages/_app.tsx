import "the-new-css-reset/css/reset.css";
import "../styles/variable.scss";
import "../styles/globals.scss";
import Header from "components/header";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import Cursor from "components/Cursor"

import LoadAVG from "public/load.svg";
export default function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const [pageLoading, setPageLoading] = useState(false);
	useEffect(() => {
		const handleStart = (url) => url !== router.asPath && setPageLoading(true);
		const handleComplete = () => setPageLoading(false);
		router.events.on("routeChangeStart", handleStart);
		router.events.on("routeChangeComplete", handleComplete);
		router.events.on("routeChangeError", handleComplete);
		return () => {
			router.events.off("routeChangeStart", handleStart);
			router.events.off("routeChangeComplete", handleComplete);
			router.events.off("routeChangeError", handleComplete);
		};
	});
	const loadingComponent = (
		<img src="/load.svg" width="200" height="200" className="load" alt="" />
	);

	var nowTime = new Date();
	var Y = nowTime.getFullYear();

	return (
		<>
			{/* <Cursor /> */}
			<Header />
			{/* <GoogleReCaptchaProvider
				reCaptchaKey={process.env.recaptcha.siteID}
				language="ja"
			> */}
			{/* {pageLoading && loadingComponent} */}
			<main className={String(pageLoading)}>
				<Component {...pageProps} />
			</main>

			<footer>©︎ {Y} Yoshiki TAMURA</footer>
			{/* </GoogleReCaptchaProvider> */}
			<div className={String("loading " + pageLoading)}>
				<LoadAVG className="load" />
			</div>
		</>
	);
}
