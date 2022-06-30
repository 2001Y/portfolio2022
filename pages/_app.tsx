import "the-new-css-reset/css/reset.css";
import "../styles/variable.scss";
import "../styles/globals.scss";
import "../styles/prism.css"
import Header from "components/header";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import LoadAVG from "public/load.svg";
export default function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const [pageLoading, setPageLoading] = useState(false);
	useEffect(() => {
		const handleStart = (url) => {
			url = new URL("http://example.com" + url);
			url.pathname !== router.pathname && setPageLoading(true)
		};
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
	var nowTime = new Date();
	var Y = nowTime.getFullYear();

	return (
		<>
			<Header />
			<main className={String(pageLoading)}>
				<Component {...pageProps} />
			</main>

			<footer>©︎ {Y} Yoshiki TAMURA</footer>
			<div className={String("loading " + pageLoading)}>
				<LoadAVG className="load" />
			</div>
		</>
	);
}
