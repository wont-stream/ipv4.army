import "mdui/components/card";
import "mdui/components/avatar";

import "mdui/components/segmented-button-group";
import "mdui/components/segmented-button";

import Hyperate from "../../Hyperate";
import Lanyard from "../../Lanyard";

export default () => {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
				height: "100%",
			}}
		>
			<mdui-card
				// @ts-expect-error; variant is not in the types for some reason?
				variant="filled"
				style={{
					width: "90%",
					padding: ".5rem",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",

					textAlign: "center",
				}}
			>
				<mdui-avatar
					style={{
						width: "5rem",
						height: "inherit",
						border: "2px solid rgb(var(--mdui-color-primary))",
					}}
					src="/public/Abyssinian/default.png"
					class="pfp"
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

			<br
				style={{
					display: "var(--lanyard-display)",
				}}
			/>

			<mdui-card
				// @ts-expect-error; variant is not in the types for some reason?
				variant="filled"
				style={{
					width: "90%",
					padding: ".5rem",
					// center the contents
					display: "var(--lanyard-display, flex)",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
				}}
			>
				<Lanyard />
			</mdui-card>

			<br
				style={{
					display: "var(--hyperate-display)",
				}}
			/>

			<mdui-card
				// @ts-expect-error; variant is not in the types for some reason?
				variant="filled"
				style={{
					width: "90%",
					padding: ".5rem",
					// center the contents
					display: "var(--hyperate-display, flex)",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",

					textAlign: "center",
				}}
			>
				<Hyperate />
			</mdui-card>
		</div>
	);
};
