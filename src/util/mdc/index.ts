import { themeJsonToCss } from "./converter/css";
import { themeToJson } from "./converter/json";
import { generateTheme } from "./generateTheme";

export const materialDynamicColors = async ({
	src,
	color,
}: {
	src?: string;
	color?: string;
}): Promise<string> => {
	const theme = await generateTheme({ src, color });
	const json = themeToJson(theme);
	return themeJsonToCss(json);
};
