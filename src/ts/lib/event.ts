// biome-ignore lint/complexity/noBannedTypes: This is a custom event emitter that uses a banned type
type Event = { name: string; callback: Function };
const events: Event[] = [];

export const on = async (name: Event["name"], callback: Event["callback"]) => {
	console.log("Event registered:", name);
	return events.push({ name, callback });
};

export const emit = async (name: string, data: Activity | Tidal | string) => {
	for (const event of events.filter((event) => event.name === name)) {
		console.log("Event emitted:", name, data);
		return await event.callback(data);
	}
};
