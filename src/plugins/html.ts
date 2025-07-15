const { minify } = require("html-minifier-terser");

export const htmlMinifier: Bun.BunPlugin = {
	name: "html minifier",
	async setup(build) {
		build.onLoad(
			{ filter: /\.handlebars$/, namespace: "file" },
			async (args) => {
				return {
					contents: await minify(await Bun.file(args.path).text(), {
						collapseBooleanAttributes: true,

						collapseInlineTagWhitespace: true,
						collapseWhitespace: true,

						decodeEntities: true,

						noNewlinesBeforeTagClose: true,

						removeAttributeQuotes: true,
						removeEmptyAttributes: true,
						removeRedundantAttributes: true,
						removeScriptTypeAttributes: true,
						removeStyleLinkTypeAttributes: true,

						sortAttributes: true,
						sortClassName: true,

						useShortDoctype: true,
					}),
					loader: "text",
				};
			},
		);
	},
};
