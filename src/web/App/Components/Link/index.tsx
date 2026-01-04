import type { ComponentChildren } from "preact";

export const Link = (props: { href?: string; children: ComponentChildren }) => {
	return (
		<a
			href={props.href}
			referrerPolicy="no-referrer"
			rel="noopener noreferrer"
			target="_blank"
		>
			{props.children}
		</a>
	);
};
