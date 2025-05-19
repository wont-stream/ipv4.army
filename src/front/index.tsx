import "tsx-dom";

import App from "./App";
import colors from "./utilities/colors.module.css";
import { snacker } from "./utilities/snackbar";

document.documentElement.className = colors.offline || "";

document.body.appendChild(<App />);

let clicks = 0;
let resetCount = "";


document.onclick = () => {
	"vibrate" in navigator && navigator.vibrate(1);
	new Audio("https://no.ipv4.army/raw/Effect_Tick.ogg").play();

	clicks++;

	if (clicks % 10 === 0) {
		snacker({
			message: `Please stop.${resetCount}`,
		});
		resetCount += ".";
	}
};

// You're garbage, let me collect you.
fetch("/api/gc");
