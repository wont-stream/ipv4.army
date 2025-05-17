import { createRef } from "tsx-dom";

import socket from "../../utilities/socket";

export default () => {
	const paragraph = createRef<HTMLParagraphElement>();

	socket.addEventListener("hyperate", (event: Event) => {
		const heartRate = (event as CustomEvent).detail;

		if (heartRate === 0) {
			document.body.style.setProperty("--hyperate-display", "none");
		} else {
			document.body.style.removeProperty("--hyperate-display");
		}

		document.body.style.setProperty("--bpm", heartRate.toString());

		if (paragraph.current) {
			paragraph.current.innerText = `❤️ ${heartRate} BPM`;
		}
	});
	return (
		<div>
			<p class="heartbeat" ref={paragraph}>
				❤️ 0 BPM
			</p>
		</div>
	);
};
