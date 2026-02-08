import { makeBadge } from "badge-maker";
import { defaultBadgeOptions } from "../defaults";
import { lanyardData } from "src/socket/lanyard";

const statusMap = {
  online: "Available",
  idle: "AFK",
  dnd: "Busy",
  offline: "Offline",
};

const colorMap = {
  online: "darkgreen",
  idle: "yellow",
  dnd: "darkred",
  offline: "gray",
};

const badge = () => {
  const status = lanyardData.discord_status;
  const message = statusMap[status];
  const color = colorMap[status];

  return makeBadge({
    ...defaultBadgeOptions,
    label: "Currently",
    message,
    color,
  });
};

export default badge;
