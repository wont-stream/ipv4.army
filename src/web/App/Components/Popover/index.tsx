import "./index.css";
import { X } from "lucide-preact";
import type { ComponentChildren } from "preact";

export const Popover = (props: {
	id: string;
	title: string;
	children: ComponentChildren;
}) => {
	const handleClose = () => {
		const el = document.getElementById(props.id) as HTMLDivElement;
		el?.hidePopover?.();
	};

	return (
		<div popover class="popover" id={props.id}>
			<div class="header">
				<span>{props.title}</span>
				<button onClick={handleClose} type="button" aria-label="Close popover">
					<X />
				</button>
			</div>
			<div class="body center">{props.children}</div>
		</div>
	);
};
