import { NowPlaying } from "../../sections/nowplaying";
import "./index.css";

export const Sidebar = () => {
	return (
		<div className="sidebar">
			<img className="responsive round large" src="/pfp.png" alt="Avatar" />
			<NowPlaying />
		</div>
	);
};
