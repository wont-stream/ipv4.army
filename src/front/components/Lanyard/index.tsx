import { highlightAll } from "@speed-highlight/core";
import { createRef } from "tsx-dom";

import socket from "../../Socket";

const statusTypes: { [key: string]: string } = {
	online: "rgb(0, 150, 0)",
	idle: "rgb(150, 150, 0)",
	dnd: "rgb(150, 0, 0)",
	offline: "rgb(150, 150, 150)",
};

const gradientTypes: { [key: string]: string } = {
	online: "rgba(0, 150, 0, 0.1)",
	idle: "rgba(150, 150, 0, 0.1)",
	dnd: "rgba(150, 0, 0, 0.1)",
	offline: "rgba(150, 150, 150, 0.1)",
};
const activityTypes: { [key: number]: string } = {
	0: "Playing",
	1: "Streaming",
	2: "Listening to",
	3: "Watching",
	4: "Custom Status",
	5: "Competing in",
};

const stringify = (data: { [key: string]: string }) => {
	return JSON.stringify(data, null, 2);
};

export default () => {
	const code = createRef<HTMLDivElement>();

	socket.addEventListener("lanyard", (event: Event) => {
		const lanyard = (event as CustomEvent).detail;
		document.body.style = `--status-color: ${statusTypes[lanyard.discord_status]}; --gradient-color: ${gradientTypes[lanyard.discord_status]};`;
		if (code.current) {
			code.current.innerHTML = stringify({
				status: lanyard.discord_status,
				activities: lanyard.activities.map(
					(act: {
						type: number;
						name: string;
						details: string;
						state: string;
					}) => {
						return [
							...new Set([
								activityTypes[act.type],
								act.name,
								act.details,
								act.state,
							]),
						].filter((n) => n);
					},
				),
			});
		}
		highlightAll();
	});

	return (
		<div class="shj-lang-json" ref={code}>
			{"{}"}
		</div>
	);
};
