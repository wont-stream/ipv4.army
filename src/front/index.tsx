import "tsx-dom";

import "./utilities/clicker";

import App from "./App";

import colors from "./utilities/colors.module.css";

document.documentElement.className = colors.offline || "";

document.body.appendChild(<App />);

// You're garbage, let me collect you.
fetch("/api/gc");
