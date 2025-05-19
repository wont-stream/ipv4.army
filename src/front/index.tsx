import "tsx-dom";

import "./utilities/clicker";

import App from "./App";
import colors from "./utilities/colors.module.css";
import { snacker } from "./utilities/snackbar";

document.documentElement.className = colors.offline || "";

document.body.appendChild(<App />);

let clicks = 0;
let resetCount = "";
document.onclick = () => {
    clicks++;

    if (clicks > 5) {
        snacker({
            message: `Please stop.${resetCount}`,
        });
        resetCount += ".";
    }
};

// You're garbage, let me collect you.
fetch("/api/gc");
