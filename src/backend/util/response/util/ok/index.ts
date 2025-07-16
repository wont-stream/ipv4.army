import { compress } from "../../../compression";
import { respOptions } from "../..";

export const ok = async (req: Request) => {
	const acceptEncoding = req.headers.get("Accept-Encoding") || "";

	const { header, body } = await compress("OK", acceptEncoding);

	return new Response(body, {
		status: 200,
		headers: {
			...respOptions.headers,
			...header,
			"Content-Type": "text/plain",
		},
	});
};
