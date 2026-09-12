import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("de-DE", {
	hour: "2-digit",
	minute: "2-digit",
	hour12: false,
	timeZone: "America/New_York",
});

const getTime = () => formatter.format(new Date());

export const Time = () => {
	const [time, setTime] = useState(getTime);

	useEffect(() => {
		const update = () => setTime(getTime());

		const now = new Date();
		const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

		let interval: ReturnType<typeof setInterval> | undefined;
		const timeout = setTimeout(() => {
			update();
			interval = setInterval(update, 60_000);
		}, delay);

		return () => {
			clearTimeout(timeout);
			clearInterval(interval);
		};
	}, []);

	return <>{time}</>;
};
