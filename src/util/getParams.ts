export const getParams = (req: Bun.BunRequest<"/*">, params: string[]) => {
	const { searchParams } = new URL(req.url);

	return params.reduce(
		(acc, param) => {
			acc[param] = searchParams.get(param) || undefined;
			return acc;
		},
		{} as Record<string, string | undefined>,
	);
};
