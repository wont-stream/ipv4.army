import type { Types } from "@prequist/lanyard";

declare module "*.svg" {
	const content: string;
	export default content;
}

declare module "*.css" {
	const content: string;
	export default content;
}

declare global {
	type LanyardData = Types.Presence;
	type LanyardActivity = Types.Activity;
}
