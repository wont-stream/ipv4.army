import "mdui/components/card";
import "mdui/components/avatar";

import "mdui/components/segmented-button-group";
import "mdui/components/segmented-button";

import colors from "../../../colors.module.css";
import Hyperate from "../../Hyperate";
import Lanyard from "../../Lanyard";
import styles from "./index.module.css";

export default () => {
	return (
		<div class={styles.container}>
			<mdui-card
				// @ts-expect-error; variant is not in the types for some reason?
				variant="filled"
				class={`${styles.card} ${styles.center}`}
			>
				<mdui-avatar
					src="/public/Abyssinian/default.png"
					class={`${styles.avatar} ${colors.pfp}`}
				/>
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

			<br class={styles.lanyard} />

			<mdui-card
				// @ts-expect-error; variant is not in the types for some reason?
				variant="filled"
				class={`${styles.card} ${styles.lanyard}`}
			>
				<Lanyard />
			</mdui-card>

			<br class={styles.hyperate} />

			<mdui-card
				// @ts-expect-error; variant is not in the types for some reason?
				variant="filled"
				class={`${styles.card} ${styles.center} ${styles.hyperate}`}
			>
				<Hyperate />
			</mdui-card>
		</div>
	);
};
