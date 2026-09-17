import { NowPlaying } from "@/web/components/sections/nowplaying";
import { Image } from "@/web/components/ui/image";
import "./index.css";

export const Sidebar = () => {
	return (
		<div className="sidebar">
			<Image
				className="responsive round large"
				src={`https://ipv4.army/pfp.png`}
				alt="Avatar"
				fetchPriority="high"
				width={570}
				height={570}
			/>
			<NowPlaying />
		</div>
	);
};
