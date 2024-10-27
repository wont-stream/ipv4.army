import { Socket } from "./lib/socket.ts";
import { emit } from "./lib/event.ts";

const string = new Socket("wss://string.ipv4.army/ws");

type Activity = {
	application_id: string;
};

string.onmessage = ({ data }) => {
	data = JSON.parse(data);

	const tidalData = data.activities.filter((act: Activity) => {
		return act.application_id === "1288341778637918208";
	})[0];

	data.listening_to_tidal = typeof tidalData === "object";

	data.tidal = {
		trackId: tidalData?.assets?.small_text.split("|")[1],
		song: tidalData?.name,
		artist: tidalData?.state,
		album: tidalData?.assets?.large_text,
	};

	emit("discord", data);
};

const hyperate = new Socket(
	// Yes, this can be hardcoded.
	"wss://app.hyperate.io/socket/websocket?token=wv39nM6iyrNJulvpmMQrimYPIXy2dVrYRjkuHpbRapKT2VSh65ngDGHdCdCtmEN9",
);

let hrTimeout: ReturnType<typeof setTimeout>;

const setHrInterval = () => {
	hrTimeout = setTimeout(() => {
		emit("heartrate", "Inactive");
	}, 6000);
};

hyperate.onopen = () => {
	hyperate.send(
		JSON.stringify({
			topic: "hr:0BCA",
			event: "phx_join",
			payload: {},
			ref: 0,
		}),
	);

	setInterval(() => {
		hyperate.send(
			JSON.stringify({
				topic: "phoenix",
				event: "heartbeat",
				payload: {},
				ref: 0,
			}),
		);
	}, 10000);

	setHrInterval();
};

hyperate.onmessage = ({ data }) => {
	const { event, payload } = JSON.parse(data);
	switch (event) {
		case "hr_update": {
			clearTimeout(hrTimeout);
			setHrInterval();

			emit("heartrate", payload.hr);

			break;
		}
		default: {
			break;
		}
	}
};
