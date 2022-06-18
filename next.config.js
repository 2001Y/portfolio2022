/** @type {import('next').NextConfig} */
module.exports = {
	env: {
		wpURL: "https://yoshikitam.wpx.jp/2001y/wp-json/wp/v2",
		recaptcha: {
			siteKEY: "6LftP-cfAAAAAHLMQW44OmVE1-TZ6OMx0ZYvUnIk",
			secretKEY: "6LftP-cfAAAAAI9Z-xUQAazRXpnQ038keebNPsTp",
		},
	},
	// Custom
	reactStrictMode: true,
	smcLoader: true,
	swcMinify: true,
	cpus: 4,
	sassOptions: {
		prependData: '@import "styles/prepend.scss";',
	},
	images: {
		domains: ["yoshikitam.wpx.jp", "github.com"],
		formats: ["image/avif", "image/webp"],
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"],
		});
		return config;
	},
};
