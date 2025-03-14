import { createRef } from "tsx-dom";
import { on } from "../ts/lib/event.ts";

export const Tidal = () => {
	const link = createRef<HTMLAnchorElement>();

	on("tidal", async (tidal: Tidal) => {
		if (link.current) {
			if (tidal.listening_to_tidal) {
				link.current.style.display = "";
				link.current.href = `https://tidal.com/browse/track/${tidal.trackId}/u`;
				link.current.innerHTML = `Listening to<br>${(tidal.song || "").replace(
					/\s?[\(\[].*?[\)\]]/g,
					"",
				)} by ${tidal.artist}`;
			} else {
				link.current.style.display = "none";
			}
		}
	});

	return (
		// biome-ignore lint/a11y/useAnchorContent: Content is set via JS
		<a href="/#" ref={link} style={"display:none"} aria-label="Tidal link" />
	);
};
