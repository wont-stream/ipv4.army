interface ImageProps {
	alt?: string;
	width?: string;
	height?: string;
}

export default ({ alt, width, height }: ImageProps) => {
	return (
		<img
			src={`https://wsrv.nl?url=https://ptrace.gafam.info/unofficial/img/color/lqdn-gafam-poster-${navigator.language.split("-")[0]}-color-5x1-2560x.png&default=https://ptrace.gafam.info/unofficial/img/color/lqdn-gafam-poster-en-color-5x1-2560x.png&dpr=${window.devicePixelRatio}&output=webp`}
			alt={
				alt || "Google, Apple, Facebook, Amazon, Microsoft Poster | gafam.info"
			}
			width={width || "2560px"}
			height={height || "724px"}
		/>
	);
};
