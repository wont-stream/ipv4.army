import "tsx-dom";

import "./utilities/clicker";

import App from "./App";

document.body.appendChild(<App />);

// You're garbage, let me collect you.
fetch("/api/gc");
