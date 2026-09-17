import { SiBun, SiJavascript, SiReact, SiTypescript } from "react-icons/si";
import { VscVscode, VscVscodeOutline } from "react-icons/vsc";
import { Card } from "@/web/components/ui/card";
import { Chip, ChipBag } from "@/web/components/ui/chip";
import { Label } from "@/web/components/ui/label";

export const Tools = () => {
	return (
		<Card>
			<Label>IDEs</Label>
			<ChipBag>
				<Chip
					icons={{
						default: <VscVscodeOutline title="Visual Studio Code Icon" />,
						hovered: <VscVscode title="Visual Studio Code Icon Filled" />,
					}}
				>
					Visual Studio Code
				</Chip>
			</ChipBag>

			<Label>Language</Label>
			<ChipBag>
				<Chip icons={{ default: <SiTypescript title="TypeScript Icon" /> }}>
					TypeScript
				</Chip>
				<Chip
					icons={{
						default: <SiJavascript title="JavaScript Icon" />,
					}}
				>
					JavaScript
				</Chip>
			</ChipBag>
			<Label>Frameworks</Label>
			<ChipBag>
				<Chip icons={{ default: <SiReact title="React Icon" /> }}>React</Chip>
				<Chip
					icons={{
						default: <SiBun title="Bun Icon" />,
					}}
				>
					Bun
				</Chip>
			</ChipBag>
		</Card>
	);
};
