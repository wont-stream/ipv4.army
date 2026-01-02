import { lanyard } from "src/web/util/lanyard";

// for the sake of song lyrics
const regex = new RegExp(/ni+g{1,2}a?s?/i);
const clean = (str: string) =>
  str.replace(regex, (match) => "*".repeat(match.length));

const Citation = () => {
  return lanyard.value.activities.map((activity) => {
    if (activity.type !== 4) return null;

    return (
      <>
        <br />- <cite>{clean(activity.state ?? "uhm..")}</cite>
      </>
    );
  });
};

export default Citation;
