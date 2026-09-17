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
				<Chip icons={{ default: <Person />, hovered: <PersonFill /> }}>
					he/him
				</Chip>
				<Chip
					icons={{
						default: <NestClockFarsightAnalog />,
						hovered: <NestClockFarsightAnalogFill />,
					}}
				>
					<Time />
				</Chip>
				<Chip icons={{ default: <LocationOn />, hovered: <LocationOnFill /> }}>
					NC, USA
				</Chip>
			</ChipBag>
		</Card>
	);
};
