/** @type {import('next').NextConfig} */
module.exports = {
	env: {
		wpURL: "https://yoshikitam.wpx.jp/2001y/wp-json/wp/v2",
	},
	// Custom
	reactStrictMode: true,
	smcLoader: true,
	swcMinify: true,
	cpus: 4,
	sassOptions: {
		prependData: '@import "styles/_V.scss";',
	},
	images: {
		domains: ["yoshikitam.wpx.jp", "github.com"],
		formats: ["image/avif", "image/webp"],
	},
};
