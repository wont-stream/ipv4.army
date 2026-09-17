type Props = {
	className?: string;
	src: string;
	alt: string;
};

export const Image = ({ className, src, alt }: Props) => {
	return (
		<img
			src={`https://wsrv.nl?url=${encodeURIComponent(src)}&default=${encodeURIComponent(`${location.href}${src}`)}`}
			className={className}
			alt={alt}
		/>
	);
};
