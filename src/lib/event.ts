// biome-ignore lint/complexity/noBannedTypes: This is a custom event emitter that uses a banned type
type Event = { name: string; callback: Function };
const events: Event[] = [];

export const on = (name: Event["name"], callback: Event["callback"]) => {
	events.push({ name, callback });
};

type Activity = {
	discordStatus: string;
	listeningToTidal: boolean;
	tidal: {
		color: string;
		trackId: string;
		song: string;
		artist: string;
		albumArtUrl: string;
		album: string;
	};
};

export const emit = (name: string, data: Activity | string) => {
	for (const event of events.filter((event) => event.name === name)) {
		event.callback(data);
	}
};
