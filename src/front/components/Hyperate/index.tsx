import { createRef } from "tsx-dom";

import socket from "../../Socket";

export default () => {
	const paragraph = createRef<HTMLParagraphElement>();

	socket.addEventListener("hyperate", (event: Event) => {
		const heartRate = (event as CustomEvent).detail;
		if (paragraph.current) {
			paragraph.current.innerText = `${heartRate} BPM`;
		}
	});
	return (
		<div>
			<p ref={paragraph}>0 BPM</p>
		</div>
	);
};
