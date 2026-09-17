/** biome-ignore-all lint/a11y/noStaticElementInteractions: no */
import { type ReactNode, useState } from "react";
import "./index.css";

type Props = {
	children: ReactNode;
	icons?: {
		default: ReactNode;
		hovered?: ReactNode;
	};
};

export const Chip = ({ children, icons }: Props) => {
	const [hovered, setHovered] = useState(false);

	const resolvedIcons =
		icons && !icons.hovered ? { ...icons, hovered: icons.default } : icons;
	return (
		<div
			className="chip fill"
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			{resolvedIcons
				? hovered
					? resolvedIcons.hovered
					: resolvedIcons.default
				: null}
			{children}
		</div>
	);
};

export const ChipBag = ({ children }: Props) => {
	return <div className="chipbag">{children}</div>;
};
