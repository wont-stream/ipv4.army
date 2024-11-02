import "./ts/index.js";
import { App } from "./tsx/App.tsx";

declare global {
	type Tidal = {
		trackId: string;
		song: string;
		artist: string;
		album: string;
	};
	type Activity = {
		status: string;
		listening_to_tidal: boolean;
		tidal: Tidal;
		activities: [];
	};
	type Activities = {
		application_id: string;
		assets: {
			small_text: string;
			large_text: string;
		};
		name: string;
		state: string;
	};
}

document.body.appendChild(<App />);
