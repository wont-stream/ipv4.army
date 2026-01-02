export const opts: Bun.BuildConfig = {
  entrypoints: ["./src/web/index.html"],
  outdir: "./dist",
  sourcemap: "linked",
  minify: true,
  external: [],
};

const build = async () => {
  return await Bun.build(opts);
};

export default build;
