import { createRef } from "tsx-dom";

export const App = () => {
	const iframe = createRef<HTMLIFrameElement>();

	const ids = ["fBxDSqwIT1o", "mUDCxccln4s", "m2abp-DKTOc", "HBZEhAQQ004"];
	const id = ids[Math.floor(Math.random() * ids.length)];

	setTimeout(() => {
		if (iframe.current) {
			iframe.current.src = `https://www.youtube-nocookie.com/embed/${id}?&autoplay=1&mute=1&controls=0loop=1&playlist=${id}&modestbranding=1&showinfo=0&hd=1&rel=0`;
		}
	});

	return (
		<span>
			<iframe
				title="YouTube video player"
				allow="autoplay; encrypted-media;"
				ref={iframe}
			/>
			<main>
				<header>
					<h3>€CHO€D 4W4Y</h3>
				</header>
				<a href="https://open.spotify.com/artist/5MaazmzZIHqs5sdA0jmtV2">
					Spotify
				</a>
				<br />
				<a href="https://music.apple.com/au/artist/%E2%82%ACcho%E2%82%ACd-4w4y/1780938599">
					Apple Music
				</a>
				<br />
				<a href="https://tidal.com/browse/artist/51850854">Tidal</a>
			</main>
		</span>
	);
};
