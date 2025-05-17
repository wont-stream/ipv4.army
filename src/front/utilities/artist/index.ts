import { setColorScheme } from "mdui/functions/setColorScheme";

export const artist = (color?: string, element?: HTMLElement) => {
	if (color?.startsWith("#")) {
		setColorScheme(color, {
			target: element || document.documentElement,
		});
	} else {
		setColorScheme("#FFF");
	}

	document.body.style.setProperty(
		"--status-color",
		getComputedStyle(document.documentElement).getPropertyValue(
			"--mdui-color-primary",
		),
	);
};
