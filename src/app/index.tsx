/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import materialDynamicColors from "material-dynamic-colors";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "../app/app";
import { ThemeProvider } from "../util/theme";

window.materialDynamicColors = materialDynamicColors;

// biome-ignore lint/style/noNonNullAssertion: https://bun.com/docs/bundler/hot-reloading#import-meta-hot-data
const elem = document.getElementById("root")!;
const Root = (
	<StrictMode>
		<ThemeProvider />
		<App />
	</StrictMode>
);

// biome-ignore lint/suspicious/noAssignInExpressions: https://bun.com/docs/bundler/hot-reloading#import-meta-hot-data
(import.meta.hot.data.root ??= createRoot(elem)).render(Root);
