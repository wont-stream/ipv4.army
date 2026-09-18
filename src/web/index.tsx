/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/web/index.html`.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/web/app";
import { DiscordProvider } from "@/web/util/discord";
import { ThemeProvider } from "@/web/util/theme";

// biome-ignore lint/style/noNonNullAssertion: https://bun.com/docs/bundler/hot-reloading#import-meta-hot-data
const elem = document.getElementById("root")!;
const Root = (
	<StrictMode>
		<DiscordProvider />
		<ThemeProvider />
		<App />
	</StrictMode>
);

// biome-ignore lint/suspicious/noAssignInExpressions: https://bun.com/docs/bundler/hot-reloading#import-meta-hot-data
(import.meta.hot.data.root ??= createRoot(elem)).render(Root);
