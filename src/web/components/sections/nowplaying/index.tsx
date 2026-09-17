import { useLanyard } from "use-lanyard";
import { Card } from "@/web/components/ui/card";
import { Image } from "@/web/components/ui/image";
import { site } from "@/web/data/site";

export const NowPlaying = () => {
	const lanyard = useLanyard(site.discordUserId);
	const spotify = lanyard?.spotify;

	if (!spotify?.album_art_url) return null;

	return (
		<Card className="no-padding small">
			<Image
				className="responsive"
				src={spotify.album_art_url}
				alt="Spotify Album Art"
				width={288}
				height={288}
			/>
			<div className="row absolute bottom left right padding bottom-shadow bottom-round truncate">
				<p>{spotify.song}</p>
			</div>

			<div className="row absolute top left right padding top-shadow bottom-round truncate">
				<p>{spotify.artist}</p>
			</div>
		</Card>
	);
};
