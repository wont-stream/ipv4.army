import { allowedOrigins } from "@/data/allowedOrigins";

export const middleware = (req: Bun.BunRequest<"/*">) => {
	if (!allowedOrigins.includes(req.headers.get("origin"))) {
		return new Response("Unauthorized", { status: 403 });
	}
};
