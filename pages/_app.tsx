import type { AppProps } from "next/app";

import "../styles/globals.scss";
import Header from "components/header";

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Header />
			<main>
				<Component {...pageProps} />
			</main>
		</>
	);
}
