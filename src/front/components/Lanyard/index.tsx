import { highlightElement } from "@speed-highlight/core";
import { createRef } from "tsx-dom";
import socket from "../../Socket";

const statusTypes = {
	online: "rgb(0, 150, 0)",
	idle: "rgb(150, 150, 0)",
	dnd: "rgb(150, 0, 0)",
	offline: "rgb(150, 150, 150)",
};

const gradientTypes = {
	online: "rgba(0, 150, 0, 0.1)",
	idle: "rgba(150, 150, 0, 0.1)",
	dnd: "rgba(150, 0, 0, 0.1)",
	offline: "rgba(150, 150, 150, 0.1)",
};

const activityTypes: Record<number, string> = {
	0: "Playing",
	1: "Streaming",
	2: "Listening to",
	3: "Watching",
	4: "Custom Status",
	5: "Competing in",
};

export default () => {
	const container = createRef<HTMLDivElement>();

	socket.addEventListener("lanyard", (event: Event) => {
		const lanyard = (event as CustomEvent<LanyardData>).detail;

		document.body.style = `--status-color: ${statusTypes[lanyard.discord_status]}; --gradient-color: ${gradientTypes[lanyard.discord_status]};`;

		if (container.current) {
			container.current.className = "shj-lang-json";
			container.current.textContent = JSON.stringify(
				{
					status: lanyard.discord_status,
					activities: lanyard.activities.map((act) => {
						const type = activityTypes[act.type];
						const parts = [type];
						if (act.name !== type) parts.push(act.name);
						if (act.details) parts.push(act.details);
						if (act.state) parts.push(act.state);
						return parts;
					}),
				},
				null,
				2,
			);
			highlightElement(container.current);
		}
	});

	return (
		<div class="shj-lang-json" ref={container}>
			{"{}"}
		</div>
	);
};
