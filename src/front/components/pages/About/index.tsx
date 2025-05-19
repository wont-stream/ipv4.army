import "mdui/components/card";
import "mdui/components/avatar";
import "mdui/components/segmented-button-group";
import "mdui/components/segmented-button";
import "mdui/components/tooltip.js";

import type { Tooltip } from "mdui/components/tooltip.js";
import { createRef } from "tsx-dom";
import socket from "../../../utilities/socket";
import Hyperate from "../../Hyperate";
import Lanyard from "../../Lanyard";
import styles from "./index.module.css";

export default () => {
	const tooltip = createRef<Tooltip>();

	socket.addEventListener("lanyard", (event: Event) => {
		const lanyard = (event as CustomEvent<LanyardData>).detail;

		const customStatus = lanyard.activities.find((act) => act.type === 4);

		if (tooltip.current) {
			if (customStatus?.state) {
				tooltip.current.setAttribute("content", customStatus.state);
			} else {
				tooltip.current.removeAttribute("content");
			}
		}
	});
	return (
		<div class={styles.container}>
			<mdui-card class={`${styles.card} ${styles.center}`}>
				<mdui-tooltip ref={tooltip}>
					<mdui-avatar
						src="/public/Abyssinian/default.png"
						class={styles.avatar}
					/>
				</mdui-tooltip>
				<p>
					Seth, the <strong>dedicated</strong> backend developer, with many{" "}
					<strong>passions</strong>.
					<br />
					<br />
					<mdui-segmented-button-group full-width>
						<mdui-segmented-button>hi-fi audio</mdui-segmented-button>
						<mdui-segmented-button>gaming</mdui-segmented-button>
						<mdui-segmented-button>development</mdui-segmented-button>
					</mdui-segmented-button-group>
				</p>
			</mdui-card>

			<br class={styles.hyperate} />

			<mdui-card
				// @ts-expect-error; variant is not in the types for some reason?
				variant="filled"
				class={`${styles.card} ${styles.center} ${styles.hyperate}`}
			>
				<Hyperate />
			</mdui-card>

			<br class={styles.lanyard} />

			<div class={`${styles.card} ${styles.lanyard}`}>
				<Lanyard />
			</div>
		</div>
	);
};
