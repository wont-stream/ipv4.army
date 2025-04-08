const pfp = document.getElementById("pfp");
const music = document.getElementById("music");
const heartrate = document.getElementById("heartrate");

const presenceMap = {
    "online": "border-success-subtle",
    "idle": "border-warning-subtle",
    "dnd": "border-danger-subtle",
    "offline": "border-light-subtle"
}

const lanyard = new WebSocket("wss://lanyard.creations.works/socket");

lanyard.onopen = () => {
    lanyard.send(JSON.stringify({
        op: 2,
        d: {
            subscribe_to_id: "1273447359417942128"
        }
    }))
}

lanyard.onmessage = ({ data }) => {
    const { op, d } = JSON.parse(data)

    switch (op) {
        case 0: {
            pfp.className = `border border-4 rounded-circle ${presenceMap[d.discord_status]}`

            const tidalData = d.activities.filter((act: Activities) => {
                return act?.application_id === "1130698654987067493";
            })[0];

            if (tidalData) {
                const [color, trackId] = tidalData?.assets?.small_text.split("|");
                music.style.color = color;
                music.href = `https://tidal.com/browse/track/${trackId}/u`
                music.innerHTML = `Listening to<br>${tidalData?.name.replace(
					/\s?[\(\[].*?[\)\]]/g,
					"",
				)} by ${tidalData?.state}`
            }
            break
        }
        case 1: {
            setInterval(async () => {
                lanyard.send(JSON.stringify({
                    op: 3,
                }))
            }, d.heartbeat_interval)
        }
    }
}

const hyperate = new WebSocket(
	// Yes, the token can be hardcoded.
	"wss://app.hyperate.io/socket/websocket?token=wv39nM6iyrNJulvpmMQrimYPIXy2dVrYRjkuHpbRapKT2VSh65ngDGHdCdCtmEN9",
);

let hrTimeout: ReturnType<typeof setTimeout>;

const setHrInterval = async () => {
	hrTimeout = setTimeout(async () => {
		heartrate.innerHTML = "";
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

            document.documentElement.style.setProperty("--bpm", payload.hr);

            heartrate.innerHTML = `<div class="heart">♥️<br /><span>${payload.hr} BPM</span></div>`;

			break;
		}
		default: {
			break;
		}
	}
};