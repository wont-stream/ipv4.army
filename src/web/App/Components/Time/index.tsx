import { useEffect, useState } from "preact/hooks";

const timeZone = "America/New_York";

export const Time = () => {
  const [time, setTime] = useState(
    new Date().toLocaleString(undefined, { timeZone }),
  );

  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleString(undefined, { timeZone }));
    };
    let interval: NodeJS.Timeout;

    const delay = 1000 - new Date().getMilliseconds();
    const timeout = setTimeout(() => {
      tick();
      interval = setInterval(tick, 1000);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  return <code>{time}</code>;
};
