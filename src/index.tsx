import "./main/index.js";
import { App } from "./tsx/App.tsx";

declare global {
	type Activity = {
		discord_status: string;
		listening_to_tidal: boolean;
		tidal: {
			color: string;
			trackId: string;
			song: string;
			artist: string;
			album_art_url: string;
			album: string;
		};
	};
}

document.body.appendChild(<App />);
