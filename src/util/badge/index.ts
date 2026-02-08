const badgeTypes = ["listening", "status"];

export const badge = async (req: Bun.BunRequest<"/api/badge/:type">) => {
  let badge = "404";
  if (badgeTypes.includes(req.params.type)) {
    badge = req.params.type;
  }

  const maker = await import(`./${badge}`);
  return new Response(await maker.default(), {
    headers: {
      "content-type": "image/svg+xml",
    },
  });
};
