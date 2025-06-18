import "tsx-dom";

import App from "./App";
import colors from "./utilities/colors.module.css";

document.documentElement.className = colors.offline || "";

document.body.appendChild(<App />);

const effectTick = new Audio("https://no.ipv4.army/raw/Effect_Tick.ogg");
document.onclick = () => {
	"vibrate" in navigator && navigator.vibrate(1);
	effectTick.currentTime = 0;
	effectTick.play();
};

// You're garbage, let me collect you.
fetch("/api/gc");
