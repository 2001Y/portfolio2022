/** @type {import('next').NextConfig} */

const TerserPlugin = require("terser-webpack-plugin");
const isProd = process.env.NODE_ENV === "production";

module.exports = {
	env: {
		title: "2001Y's Site",
		domain: "https://2001y.me",
		wpURL: "https://yoshikitam.wpx.jp/2001y/wp-json/wp/v2"
	},
	async redirects() {
		return [
			{
				source: "/blog/web/:slug",
				destination: "/blog/:slug",
				permanent: true,
			},
			{
				source: "/blog/gadget/:slug",
				destination: "/blog/:slug",
				permanent: true,
			},
			{
				source: "/blog/camera/:slug",
				destination: "/blog/:slug",
				permanent: true,
			},
			{
				source: "/blog/other/:slug",
				destination: "/blog/:slug",
				permanent: true,
			},
		];
	},
	// Custom
	reactStrictMode: true,
	swcMinify: true,
	sassOptions: {
		prependData: '@import "styles/_prepend.scss";',
	},
	images: {
		domains: ["yoshikitam.wpx.jp", "github.com", "figma-alpha-api.s3.us-west-2.amazonaws.com"],
		formats: ["image/avif", "image/webp"],
	},
	webpack(config, options) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"],
		});

		config.optimization.minimize = isProd;
		config.optimization.minimizer = [
			new TerserPlugin({
				terserOptions: {
					compress: {
						drop_console: isProd,
					},
				},
				extractComments: "all",
			}),
		];
		return config;
	},
};
