import "./index.css";

import { useEffect, useState } from "preact/hooks";

export const ProgressBar = (props: { activity: LanyardActivity }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const tick = () => {
      setNow(Date.now());
    };

    const now = new Date();
    const delay = 1000 - now.getMilliseconds(); // align to next second

    const timeout = setTimeout(() => {
      tick();
      const interval = setInterval(tick, 1000);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, []);

  const start = props.activity.timestamps?.start ?? null;
  const end = props.activity.timestamps?.end ?? null;
  const createdAt = props.activity.created_at;

  if (start && end) {
    const progress =
      Math.min(Math.max((now - start) / (end - start), 0), 1) * 100;

    return (
      <div class="progress-container">
        <div class="progress-bar" style={`width:${progress}%`}></div>
      </div>
    );
  } else if (start && !end) {
    const elapsed = new Date(now - start);
    const hours = elapsed.getUTCHours();
    const minutes = elapsed.getUTCMinutes();
    const seconds = elapsed.getUTCSeconds();

    return (
      <span>
        Elapsed {hours > 0 ? `${hours}:` : ""}
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    );
  } else if (end && !start) {
    const left = new Date(end - now);
    const hours = left.getUTCHours();
    const minutes = left.getUTCMinutes();
    const seconds = left.getUTCSeconds();

    return (
      <span>
        {hours > 0 ? `${hours}:` : ""}
        {minutes}:{seconds.toString().padStart(2, "0")} left
      </span>
    );
  } else if (!start && !end && createdAt) {
    const elapsed = new Date(now - createdAt);
    const hours = elapsed.getUTCHours();
    const minutes = elapsed.getUTCMinutes();
    const seconds = elapsed.getUTCSeconds();

    return (
      <span>
        Elapsed {hours > 0 ? `${hours}:` : ""}
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    );
  }

  return null;
};
