import { SiBun, SiJavascript, SiReact, SiTypescript } from "react-icons/si";
import { VscVscode, VscVscodeOutline } from "react-icons/vsc";
import { Card } from "@/components/ui/card";
import { Chip, ChipBag } from "@/components/ui/chip";
import { Label } from "@/components/ui/label";

export const Tools = () => {
	return (
		<Card>
			<Label>IDEs</Label>
			<ChipBag>
				<Chip icons={{ default: <VscVscodeOutline />, hovered: <VscVscode /> }}>
					Visual Studio Code
				</Chip>
			</ChipBag>

			<Label>Language</Label>
			<ChipBag>
				<Chip icons={{ default: <SiTypescript /> }}>TypeScript</Chip>
				<Chip
					icons={{
						default: <SiJavascript />,
					}}
				>
					JavaScript
				</Chip>
			</ChipBag>
			<Label>Frameworks</Label>
			<ChipBag>
				<Chip icons={{ default: <SiReact /> }}>React</Chip>
				<Chip
					icons={{
						default: <SiBun />,
					}}
				>
					Bun
				</Chip>
			</ChipBag>
		</Card>
	);
};
