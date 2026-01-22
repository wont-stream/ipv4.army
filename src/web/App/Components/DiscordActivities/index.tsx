import "./index.css";

import { lanyard } from "src/web/util/realtime";
import { Image } from "../Image";
import { ProgressBar } from "../ProgressBar";

const typeMap = {
  0: "Playing",
  1: "Streaming",
  2: "Listening to",
  3: "Watching",
  4: "",
  5: "Competing in",
};

const resolveImage = (
  image: string | null = null,
  id: string | null = null,
) => {
  if (!image) {
    // use Dustin's api for this
    // since retrieving this image requires us to call "https://discord.com/api/v9/applications/public?application_ids=${id}"
    // which cannot be called without authorization
    return id ? `https://dcdn.dstn.to/app-icons/${id}` : null;
  }

  if (image.startsWith("mp:external/")) {
    return image.replace(
      "mp:external/",
      "https://media.discordapp.net/external/",
    );
  }

  if (image.startsWith("spotify:")) {
    return `https://i.scdn.co/image/${image.replace("spotify:", "")}`;
  }

  if (!id) return null;

  // the idea here is that if purely numeric, its a rich presence asset (snowflake)
  // otherwise, its a game icon (hash)
  return /^\d+$/.test(image)
    ? `https://cdn.discordapp.com/app-assets/${id}/${image}.png?size=128`
    : `https://cdn.discordapp.com/app-icons/${id}/${image}.png?size=128&keep_aspect_ratio=false`;
};

export const Activities = () => {
  return lanyard.value.activities.map((activity) => {
    if (activity.type === 4) return null;

    const resLarge = resolveImage(
      activity.assets?.large_image,
      activity.application_id,
    );
    const resSmall = resolveImage(
      activity.assets?.small_image,
      activity.application_id,
    );

    const large = resLarge;
    const small = resSmall?.includes("dcdn.dstn.to") ? null : resSmall;

    return (
      <blockquote key={activity.application_id || activity.id}>
        <div>
          {typeMap[activity.type as keyof typeof typeMap]} {activity.name}
        </div>
        <div class="activity">
          <div class="image">
            {large && (
              <Image
                width={70}
                height={70}
                src={large}
                alt={activity.assets?.large_text || activity.name}
                title={activity.assets?.large_text}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            {small && (
              <Image
                class="small"
                width={30}
                height={30}
                src={small}
                alt={activity.assets?.small_text || activity.name}
                title={activity.assets?.small_text}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>

          <div class="text">
            <div>{activity.details || " "}</div>
            <div>{activity.state || " "}</div>
          </div>
        </div>
        <ProgressBar activity={activity} />
      </blockquote>
    );
  });
};
