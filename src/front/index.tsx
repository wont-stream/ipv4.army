import "tsx-dom";

import { artist } from "./utilities/artist";
import "./utilities/clicker";

import App from "./App";

artist();

document.body.appendChild(<App />);

// You're garbage, let me collect you.
fetch("/api/gc");
