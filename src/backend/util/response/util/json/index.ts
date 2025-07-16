import { compress } from "../../../compression";
import { respOptions } from "../..";

export const json = async (req: Request, data: { [key: string]: string }) => {
    const acceptEncoding = req.headers.get("Accept-Encoding") || "";

    const { header, body } = await compress(JSON.stringify(data), acceptEncoding);

    return new Response(body, {
        status: 200,
        headers: {
            ...respOptions.headers,
            ...header,
            "Content-Type": "application/json",
        },
    });
};