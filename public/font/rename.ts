import { Glob } from "bun";

const woff2 = new Glob("./*.woff2");

for await (const file of woff2.scan(".")) {
    const font = Bun.file(file);

    const name = font.name?.split("-")[1];

    await Bun.write(`./${name}`, await font.arrayBuffer());
    console.log(`Renamed ${file} to ${name}`);

    await font.delete();
    console.log(`Deleted original font file: ${file}`);
}

console.log("Done")