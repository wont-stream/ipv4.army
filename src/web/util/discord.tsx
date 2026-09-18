import { useEffect, useState } from "react";
import { get, useLanyard } from "use-lanyard";
import { site } from "@/web/data/site";

export const DiscordProvider = () => {
	const [initialData, setInitialData] = useState<
		Awaited<ReturnType<typeof get>> | undefined
	>(undefined);

	useEffect(() => {
		(async () => {
			const data = await get(site.discordUserId);
			setInitialData(data);
		})();
	}, []);

	useLanyard(site.discordUserId, {
		initialData,
	});

	return null;
};
