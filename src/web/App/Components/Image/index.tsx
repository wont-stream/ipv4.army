import type { GenericEventHandler } from "preact";

const Image = (props: {
  src?: string;
  alt?: string;
  title?: string;
  class?: string;
  width: number;
  height: number;
  onError?: GenericEventHandler<HTMLImageElement>;
}) => {
  return (
    <img
      loading="lazy"
      decoding="async"
      src={`https://wsrv.nl?dpr=${window.devicePixelRatio}&output=webp&w=${props.width}&h=${props.height}&default=${location.host}/android-chrome-192x192.png&url=${props.src}`}
      alt={props.alt}
      title={props.title}
      class={props.class}
      width={props.width}
      height={props.height}
      onError={props.onError}
    />
  );
};

export default Image;
