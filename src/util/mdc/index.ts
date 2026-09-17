import {
	argbFromHex,
	hexFromArgb,
	type Theme,
	themeFromImage,
	themeFromSourceColor,
} from "@material/material-color-utilities";
import type {
	IMaterialDynamicColorsTheme,
	IMaterialDynamicColorsThemeColor,
} from "./types";

const { createCanvas, loadImage } = require("@napi-rs/canvas");

globalThis.document = {
	createElement: () => {
		return createCanvas(640, 640);
	},
	// biome-ignore lint/suspicious/noExplicitAny: pls
} as any;

const themeToJson = (theme: Theme): IMaterialDynamicColorsTheme => {
	const json = JSON.parse(JSON.stringify(theme.schemes));
	delete json.light;

	for (const key of Object.keys(json.dark)) {
		json.dark[key] = hexFromArgb(json.dark[key]);
	}

	json.dark.surfaceDim = hexFromArgb(theme.palettes.neutral.tone(6));
	json.dark.surface = hexFromArgb(theme.palettes.neutral.tone(6));
	json.dark.surfaceBright = hexFromArgb(theme.palettes.neutral.tone(24));
	json.dark.surfaceContainerLowest = hexFromArgb(
		theme.palettes.neutral.tone(4),
	);
	json.dark.surfaceContainerLow = hexFromArgb(theme.palettes.neutral.tone(10));
	json.dark.surfaceContainer = hexFromArgb(theme.palettes.neutral.tone(12));
	json.dark.surfaceContainerHigh = hexFromArgb(theme.palettes.neutral.tone(17));
	json.dark.surfaceContainerHighest = hexFromArgb(
		theme.palettes.neutral.tone(22),
	);
	json.dark.onSurface = hexFromArgb(theme.palettes.neutral.tone(90));
	json.dark.onSurfaceVariant = hexFromArgb(
		theme.palettes.neutralVariant.tone(80),
	);
	json.dark.outline = hexFromArgb(theme.palettes.neutralVariant.tone(60));
	json.dark.outlineVariant = hexFromArgb(
		theme.palettes.neutralVariant.tone(30),
	);

	return json;
};

export const materialDynamicColors = async ({
	src,
	color,
}: {
	src?: string;
	color?: string;
}): Promise<IMaterialDynamicColorsTheme> => {
	if (src) {
		const image = await loadImage(src);
		image.dataset = {};

		const theme = await themeFromImage(image);
		return themeToJson(theme);
	}

	if (color) {
		const theme = themeFromSourceColor(argbFromHex(color));
		return themeToJson(theme);
	}

	throw new Error();
};

export const toCss = (data: IMaterialDynamicColorsTheme) => {
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
