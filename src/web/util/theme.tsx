import { useEffect } from "react";
import { useLanyard } from "use-lanyard";
import { site } from "@/web/data/site";

const THEME_BY_STATUS: Record<string, string> = {
	online: "00FF00",
	idle: "FFFF00",
	dnd: "FF0000",
};

export const ThemeProvider = () => {
	const lanyard = useLanyard(site.discordUserId);
	const art = lanyard?.spotify?.album_art_url;
	const status = lanyard?.discord_status ?? "offline";

	useEffect(() => {
		const query = new URLSearchParams();
		if (art) {
			query.set("src", art);
		} else {
			query.set("color", THEME_BY_STATUS[status] || "FFF");
		}
		(async () => {
			const req = await fetch(`/api/color?${query.toString()}`);
			const res = await req.text();
			document.body.style = res;
		})();
	}, [art, status]);

	return null;
};
