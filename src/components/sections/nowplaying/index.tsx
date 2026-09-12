import { useLanyard } from "use-lanyard";
import { Card } from "@/components/ui/card";
import { site } from "../../../data/site";

export const NowPlaying = () => {
	const lanyard = useLanyard(site.discordUserId);
	const spotify = lanyard?.spotify;

	if (!spotify) return null;

	return (
		<Card className="no-padding small">
			<img
				className="responsive"
				src={spotify.album_art_url ?? undefined}
				alt=""
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
