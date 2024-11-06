import { createRef } from "tsx-dom";
import { on } from "../ts/lib/event.ts";

export const Heartrate = () => {
	const p = createRef<HTMLParagraphElement>();
	const hr = createRef<HTMLSpanElement>();

	on("heartrate", async (rate: string) => {
		if (p.current && hr.current) {
			if (rate === "Inactive") {
				p.current.style.display = "none";
			} else {
				p.current.style.display = "";
				hr.current.textContent = `${rate} BPM`;
			}
		}

		document.documentElement.style.setProperty("--bpm", rate);
	});

	return (
		<p ref={p} style={"display:none"}>
			<div class="heart">
				♥️
				<br />
				<span ref={hr}>Inactive</span>
			</div>
		</p>
	);
};
