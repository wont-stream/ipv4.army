type Props = {
	className?: string;
	src: string;
	alt: string;
};

export const Image = ({ className, src, alt }: Props) => {
	return (
		<img
			src={`https://wsrv.nl?output=webp&url=${encodeURIComponent(src)}}`}
			className={className}
			alt={alt}
		/>
	);
};
