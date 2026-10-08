import { useLanyard } from "use-lanyard";
import { site } from "@/data/site";
import { Image } from "@/web/components/ui/image";

export const NowPlaying = () => {
	const lanyard = useLanyard(site.discordUserId);
	const spotify = lanyard?.spotify;

	if (!spotify?.album_art_url) return null;

	return (
		<div className="pfpContainer responsive round large">
			<Image
				className="responsive large"
				src={spotify.album_art_url}
				alt="Spotify Album Art"
				width={570}
				height={570}
			/>

			<div className="round row absolute top left right padding top-shadow truncate">
				<p>{spotify.artist}</p>
			</div>

			<div className="round row absolute bottom left right padding bottom-shadow truncate">
				<p>{spotify.song}</p>
			</div>
		</div>
	);
};
