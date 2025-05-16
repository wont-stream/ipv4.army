import { highlightElement } from "@speed-highlight/core";
import { createRef } from "tsx-dom";
import socket from "../../Socket";

const statusTypes = {
	online: "0, 150, 0",
	idle: "150, 150, 0",
	dnd: "150, 0, 0",
	offline: "150, 150, 150",
};

const gradientTypes = {
	online: "0, 150, 0",
	idle: "150, 150, 0",
	dnd: "150, 0, 0",
	offline: "150, 150, 150",
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

		document.body.style = `--status-color: rgb(${statusTypes[lanyard.discord_status]}); --gradient-color: rgba(${gradientTypes[lanyard.discord_status]}, 0.1);`;

		if (container.current) {
			container.current.textContent = JSON.stringify(
				{
					status: lanyard.discord_status,
					activities: [
						...new Set(
							lanyard.activities.map((act) => {
								const type = activityTypes[act.type];
								const parts = [`${type} ${act.name === "Custom Status" ? "" : act.name}`];
								if (act.details && act.details !== act.name)
									parts.push(act.details);
								if (act.state && act.state !== act.name) parts.push(act.state);
								return parts;
							}),
						),
					],
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
