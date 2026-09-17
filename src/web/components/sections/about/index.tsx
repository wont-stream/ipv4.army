import {
	LocationOn,
	LocationOnFill,
} from "@material-symbols-svg/react/rounded/icons/location-on";
import {
	NestClockFarsightAnalog,
	NestClockFarsightAnalogFill,
} from "@material-symbols-svg/react/rounded/icons/nest-clock-farsight-analog";
import {
	Person,
	PersonFill,
} from "@material-symbols-svg/react/rounded/icons/person";
import { Card } from "@/web/components/ui/card";
import { Chip, ChipBag } from "@/web/components/ui/chip";
import { Label } from "@/web/components/ui/label";
import { Time } from "@/web/util/time";

export const About = () => {
	return (
		<Card>
			<Label>About</Label>
			<h4>Hey, I'm S€TH.</h4>
			I'm any guy, but a man of few words and many hobbies.
			<ChipBag>
				<Chip
					icons={{
						default: <Person title="Person Icon" />,
						hovered: <PersonFill title="Person Icon Filled" />,
					}}
				>
					he/him
				</Chip>
				<Chip
					icons={{
						default: <NestClockFarsightAnalog title="Clock Icon" />,
						hovered: (
							<NestClockFarsightAnalogFill title="Clock Icon Icon Filled" />
						),
					}}
				>
					<Time />
				</Chip>
				<Chip
					icons={{
						default: <LocationOn title="Location Icon" />,
						hovered: <LocationOnFill title="Location Icon Filled" />,
					}}
				>
					NC, USA
				</Chip>
			</ChipBag>
		</Card>
	);
};
