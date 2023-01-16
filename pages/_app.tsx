import "the-new-css-reset/css/reset.css";
import "../styles/variable.scss";
import "../styles/globals.scss";
import "../styles/prism.css"
// import Head from "components/Head";
import Head from "next/head";
import Header from "components/header";
import Script from 'next/script'

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import LoadAVG from "public/load.svg";
export default function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const [pageLoading, setPageLoading] = useState(false);
	useEffect(() => {
		const handleStart = (url) => {
			let load = true;
			url = new URL("http://example.com" + url);
			// 今のページ: router.pathname
			// 開くページ：url.pathname
			if (
				(url.pathname == router.pathname) ||
				((router.pathname.split("/")[1] == "works") || (url.pathname.split("/")[1] == "works"))
			) {
				load = false;
			}
			setPageLoading(load)
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

	useEffect(() => {
		if (!CSS.supports("(height: 100dvh)")) {
			handleResize();
			window.addEventListener('resize', handleResize)
			return () => {
				window.removeEventListener('resize', handleResize)
			}
		}
		function handleResize() {
			let vh = window.innerHeight;
			document.documentElement.style.setProperty('--100vh', `${vh}px`);
		}
	}, []);

	return (
		<>
			<Script id="ga-file" async src="https://www.googletagmanager.com/gtag/js?id=G-51E14JSXC0"></Script>
			<Script id="ga-script" dangerouslySetInnerHTML={{
				__html: `
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', 'G-51E14JSXC0');
				`,
			}}>
			</Script>
			<Header />
			<main className={String(pageLoading)}>
				<Component {...pageProps} />
			</main>
			<div className={String("loading " + pageLoading)}>
				<LoadAVG className="load" />
			</div>
		</>
	);
}
