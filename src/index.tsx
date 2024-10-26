import "./ts/index.js";
import "./ts/lib/1.js";
import { App } from "./ts/tsx/App.tsx";

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
