import { NowPlaying } from "@/components/sections/nowplaying";
import { Image } from "@/components/ui/image";
import "./index.css";

export const Sidebar = () => {
	return (
		<div className="sidebar">
			<Image className="responsive round large" src={`${location.href}pfp.png`} alt="Avatar" />
			<NowPlaying />
		</div>
	);
};
