import "./ts/index.ts";
import { App } from "./tsx/App.tsx";

declare global {
	type Tidal = {
		listening_to_tidal: boolean;
		trackId?: string;
		song?: string;
		artist?: string;
		album?: string;
	};
	type Activity = {
		discord_status: string;
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

//document.body.style.backgroundImage = "url('https://')";

document.body.appendChild(<App />);
