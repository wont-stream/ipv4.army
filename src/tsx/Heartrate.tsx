import { createRef } from "tsx-dom";
import { on } from "../ts/lib/event.ts";

export const Heartrate = () => {
	const hr = createRef<HTMLSpanElement>();

	on("heartrate", (rate: string) => {
		if (hr.current) {
			hr.current.textContent = rate === "Inactive" ? "Inactive" : `${rate} BPM`;
		}

		document.documentElement.style.setProperty("--bpm", rate);
	});

	return (
		<p>
			<div class="heart">
				♥️
				<br />
				<span ref={hr}>Inactive</span>
			</div>
		</p>
	);
};
