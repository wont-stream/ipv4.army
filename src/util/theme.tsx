import { ui } from "beercss/src/cdn/beer"
import { useEffect } from "react";
import { useLanyard } from "use-lanyard";
import { site } from "../data/site";

const THEME_BY_STATUS: Record<string, string> = {
	online: "#00FF00",
	idle: "#FFFF00",
	dnd: "#FF0000",
};

export const ThemeProvider = () => {
	const lanyard = useLanyard(site.discordUserId);
	const art = lanyard?.spotify?.album_art_url;
	const status = lanyard?.discord_status ?? "offline";

	useEffect(() => {
		ui("theme", art || THEME_BY_STATUS[status] || "#FFF");
	}, [art, status]);

	return null;
};
