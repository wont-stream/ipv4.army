import { emit } from "./lib/event.ts";

const lanyardApiUrl = "frenchcat.aspy.dev"

const handleDiscordData = async (data: Activity) => {
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

fetch(`https://${lanyardApiUrl}/v1/users/1273447359417942128`)
	.then((res) => res.json())
	.then(async ({data}) => {
		return await handleDiscordData(data);
	});

const lanyard = new WebSocket(`wss://${lanyardApiUrl}/socket`);

const sendToLanyard = async (op: Number, d: Object) => {
	if (lanyard.readyState === WebSocket.OPEN) {
		return lanyard.send(JSON.stringify({ op, d }));
	}
};

lanyard.onmessage = async ({ data }) => {
	const { op, d } = JSON.parse(data);

	switch (op) {
		case 0: {
			return await handleDiscordData(d);
		}
		case 1: {
			setInterval(async () => {
				return await sendToLanyard(3, {});
			}, d.heartbeat_interval);
			return await sendToLanyard(2, { subscribe_to_id: "1273447359417942128" });
		}
		default: {
			break;
		}
	}
};

const hyperate = new WebSocket(
	// Yes, the token can be hardcoded.
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
