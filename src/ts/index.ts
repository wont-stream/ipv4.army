import { Socket } from "./lib/socket.ts";
import { emit } from "./lib/event.ts";

const handleStringData = async (data: Activity) => {
	const tidalData: Activities = data.activities.filter(
		async (act: Activities) => {
			return act.application_id === "1288341778637918208";
		},
	)[0];

	data.listening_to_tidal = typeof tidalData === "object";

	data.tidal = {
		trackId: tidalData?.assets?.small_text.split("|")[1],
		song: tidalData?.name,
		artist: tidalData?.state,
		album: tidalData?.assets?.large_text,
	};

	return await emit("discord", data);
};

fetch("https://string.ipv4.army/")
	.then((res) => res.json())
	.then(handleStringData);

const string = new Socket("wss://string.ipv4.army/ws");

string.onmessage = async ({ data }) => {
	return await handleStringData(JSON.parse(data));
};

const hyperate = new Socket(
	// Yes, this can be hardcoded.
	"wss://app.hyperate.io/socket/websocket?token=wv39nM6iyrNJulvpmMQrimYPIXy2dVrYRjkuHpbRapKT2VSh65ngDGHdCdCtmEN9",
);

let hrTimeout: ReturnType<typeof setTimeout>;

const setHrInterval = async () => {
	hrTimeout = setTimeout(async () => {
		return await emit("heartrate", "Inactive");
	}, 6000);
};

hyperate.onopen = async () => {
	hyperate.send(
		JSON.stringify({
			topic: "hr:0BCA",
			event: "phx_join",
			payload: {},
			ref: 0,
		}),
	);

	setInterval(async () => {
		hyperate.send(
			JSON.stringify({
				topic: "phoenix",
				event: "heartbeat",
				payload: {},
				ref: 0,
			}),
		);
	}, 10000);

	return await setHrInterval();
};

hyperate.onmessage = async ({ data }) => {
	const { event, payload } = JSON.parse(data);
	switch (event) {
		case "hr_update": {
			clearTimeout(hrTimeout);
			await setHrInterval();

			await emit("heartrate", payload.hr);

			break;
		}
		default: {
			break;
		}
	}
};
