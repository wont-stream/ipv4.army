import {
	argbFromHex,
	sourceColorFromImageBytes,
	type Theme,
	themeFromSourceColor,
} from "@material/material-color-utilities";
import sharp from "sharp";

export const generateTheme = async ({
	src,
	color,
}: {
	src?: string;
	color?: string;
}): Promise<Theme> => {
	let sourceColor: number = 0;

	if (src) {
		const imgReq = await fetch(src);
		const imgRes = await imgReq.arrayBuffer();
		const sharpOut = await sharp(imgRes).ensureAlpha().raw().toBuffer();
		sourceColor = sourceColorFromImageBytes(new Uint8ClampedArray(sharpOut));
	} else if (color) {
		sourceColor = argbFromHex(color);
	}

	return themeFromSourceColor(sourceColor);
};
