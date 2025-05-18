import {
	argbFromHex,
	argbFromRgb,
	argbFromRgba,
	blueFromArgb,
	CorePalette,
	greenFromArgb,
	redFromArgb,
	Scheme,
} from "@material/material-color-utilities";
import { toKebabCase } from "@mdui/jq/shared/helper.js";

const rgbFromArgb = (source: number): string => {
	const red = redFromArgb(source);
	const green = greenFromArgb(source);
	const blue = blueFromArgb(source);

	return [red, green, blue].join(",");
};

const getFromSource = (source: number): string => {
	const scheme = Scheme.dark(source).toJSON();

	const palette = CorePalette.of(source);

	Object.assign(scheme, {
		"surface-dim": palette.n1.tone(6),
		"surface-bright": palette.n1.tone(24),
		"surface-container-lowest": palette.n1.tone(4),
		"surface-container-low": palette.n1.tone(10),
		"surface-container": palette.n1.tone(12),
		"surface-container-high": palette.n1.tone(17),
		"surface-container-highest": palette.n1.tone(22),
		"surface-tint-color": scheme.primary,
	});

	// 扩充自定义颜色

	// 根据配色方案生成 css 变量
	const colorVar = (callback: (token: string, rgb: string) => string) => {
		return Object.entries(scheme)
			.map(([key, value]) => callback(toKebabCase(key), rgbFromArgb(value)))
			.join("");
	};

	// CSS 文本
	const cssText = `${colorVar((token, rgb) => `--mdui-color-${token}:${rgb};`)}`;

	return cssText;
};

export const getTheme = (color: string) => {
	let source = argbFromHex("#FFF");

	if (color.startsWith("#")) {
		source = argbFromHex(color);
	} else {
		const [r, g, b, a] = color.split(",");

		const red = r || "";
		const redExists =
			red.length > 0 &&
			red.length < 4 &&
			!Number.isNaN(Number.parseInt(red)) &&
			Number.parseInt(red) >= 0 &&
			Number.parseInt(red) <= 255;

		const green = g || "";
		const greenExists =
			green.length > 0 &&
			green.length < 4 &&
			!Number.isNaN(Number.parseInt(green)) &&
			Number.parseInt(green) >= 0 &&
			Number.parseInt(green) <= 255;

		const blue = b || "";
		const blueExists =
			blue.length > 0 &&
			blue.length < 4 &&
			!Number.isNaN(Number.parseInt(blue)) &&
			Number.parseInt(blue) >= 0 &&
			Number.parseInt(blue) <= 255;

		const alpha = a || "";
		const alphaExists =
			alpha.length > 0 &&
			alpha.length < 4 &&
			!Number.isNaN(Number.parseFloat(alpha)) &&
			Number.parseFloat(alpha) >= 0 &&
			Number.parseFloat(alpha) <= 1;

		if (redExists && greenExists && blueExists) {
			if (alphaExists) {
				source = argbFromRgba({
					r: Number.parseInt(red),
					g: Number.parseInt(green),
					b: Number.parseInt(blue),
					a: Number.parseFloat(alpha),
				});
			} else {
				source = argbFromRgb(
					Number.parseInt(red),
					Number.parseInt(green),
					Number.parseInt(blue),
				);
			}
		}
	}

	return getFromSource(source);
};
