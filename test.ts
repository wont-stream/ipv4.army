import { getTheme } from "./src/back/utilities/themer";

//console.log(getTheme("#ffddc4"));

const colorMap = {
	online: "#00ff00",
	idle: "#ffff00",
	dnd: "#ff0000",
	offline: "",
	streaming: "#ff00ff",
};

Object.entries(colorMap).forEach(([key, value]) => {
	console.log(key, getTheme(value), "\n\n");
});
