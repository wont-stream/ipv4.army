import type {
	IMaterialDynamicColorsTheme,
	IMaterialDynamicColorsThemeColor,
} from "../types";

export const themeJsonToCss = (data: IMaterialDynamicColorsTheme) => {
	let style = "";

	for (const key of Object.keys(data.dark) as Array<
		keyof IMaterialDynamicColorsThemeColor
	>) {
		const value = data.dark[key];
		const kebabCase = key
			.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
			.toLowerCase();

		style += `--${kebabCase}:${value};`;
	}

	return style;
};
