import { highlightElement } from "@speed-highlight/core";
import { createRef } from "tsx-dom";
import socket from "../../utilities/socket";


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

		const streamingActivity = lanyard.activities.find((act) => act.type === 1);
		if (streamingActivity) {
			document.documentElement.className = "streaming";
		} else {
			document.documentElement.className = lanyard.discord_status;
		}

		if (lanyard.activities.length === 0) {
			document.body.style.setProperty("--lanyard-display", "none");
		} else {
			document.body.style.removeProperty("--lanyard-display");
		}

		if (container.current) {
			container.current.textContent = JSON.stringify(
				{
					activities: [
						...new Set(
							lanyard.activities.map((act) => {
								const type = activityTypes[act.type];
								const parts = [
									`${type}${act.name === "Custom Status" ? "" : ` ${act.name}`}`,
								];
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
		<code class="shj-lang-json" ref={container}>
			{"{}"}
		</code>
	);
};
