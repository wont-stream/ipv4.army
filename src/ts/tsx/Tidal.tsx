import { createRef } from "tsx-dom";
import { on } from "../lib/event.ts";

export const Tidal = () => {
	const link = createRef<HTMLAnchorElement>();

	on("discord", (activity: Activity) => {
		if (link.current) {
			if (activity.listening_to_tidal) {
<<<<<<< HEAD:src/ts/tsx/Tidal.tsx
				img.current.style.background = `center / contain no-repeat url(https://wsrv.nl/?output=webp&q=1&url=${activity.tidal.album_art_url})`;
				blur.current.classList.add("small-blur");
=======
>>>>>>> f495ae3 (update):src/tsx/Tidal.tsx
				link.current.href = `https://tidal.com/browse/track/${activity.tidal.trackId}/u`;
				link.current.innerHTML = `Listening to<br>${activity.tidal.song.replace(
					/\s?[\(\[].*?[\)\]]/g,
					"",
				)} by ${activity.tidal.artist}`;
			} else {
				link.current.href = "/#";
				link.current.textContent = "Not listening to anything.";
			}
		}
	});

	return (
		<a href="/#" ref={link}>
			Not listening to anything.
		</a>
	);
};
