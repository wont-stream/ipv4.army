import { Socket } from "./lib/socket.ts";
import { emit } from "./lib/event.ts";

const lanyard = new Socket("wss://api.lanyard.rest/socket");

type Activity = {
	application_id: string;
};

lanyard.onmessage = ({ data }) => {
	const { op, d } = JSON.parse(data);
	switch (op) {
		case 0: {
			const tidalData = d.activities.filter((act: Activity) => {
				return act.application_id === "1130698654987067493";
			})[0];

			d.listening_to_tidal = typeof tidalData === "object";

			d.tidal = {
				color: tidalData?.assets?.small_text.split("|")[0],
				trackId: tidalData?.assets?.small_text.split("|")[1],
				song: tidalData?.name,
				artist: tidalData?.details,
				album_art_url: `https://${tidalData?.assets?.large_image.split("https/")[1]}`,
				album: tidalData?.assets?.large_text,
			};

			emit("discord", d);

			break;
		}
		case 1: {
			// Setup Heartbeat
			setInterval(() => {
				lanyard.send(JSON.stringify({ op: 3 }));
			}, d.heartbeat_interval);
			// Subscribe to user id 1273447359417942128
			lanyard.send(
				JSON.stringify({
					op: 2,
					d: {
						subscribe_to_id: "1273447359417942128",
					},
				}),
			);
			break;
		}
		default: {
			break;
		}
	}
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
