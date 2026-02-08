import { makeBadge } from "badge-maker";
import { defaultBadgeOptions } from "../defaults";
import { lanyardData } from "src/socket/lanyard";
import type { Types } from "@prequist/lanyard";

const notListening: Types.Activity = {
  type: 2,
  name: "",
  id: "",
  created_at: 0,

  details: "Not Listening",
  state: "To Anything",
};

const badge = () => {
  const activity =
    lanyardData.activities.find((act) => {
      return act.type === 2;
    }) || notListening;

  return makeBadge({
    ...defaultBadgeOptions,
    label: activity.details,
    message: activity.state,
    color: "darkgreen",
  });
};

export default badge;
