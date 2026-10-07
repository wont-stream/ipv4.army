import { hexFromArgb, type Theme } from "@material/material-color-utilities";
import type { IMaterialDynamicColorsTheme } from "../types";

export const themeToJson = (theme: Theme): IMaterialDynamicColorsTheme => {
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
