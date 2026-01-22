import { Link } from "../../Components/Link";
import { Popover } from "../../Components/Popover";

export const Popups = () => {
	return (
		<>
			<Popover id="backend" title="Backend Development">
				I'm an alright backend developer, would rather do it than frontend.
				<br />I don't have anything too notable to show off
				<br />
				but the backend of{" "}
				<Link href="https://heliopolis.live/seth/ipv4.army/-/tree/main/src">
					ipv4.army
				</Link>{" "}
				is pretty cool
			</Popover>

			<Popover id="frontend" title="Frontend Development">
				I hate doing frontend, I'm not a great designer.
				<br />
				but the frontend of{" "}
				<Link href="https://heliopolis.live/seth/ipv4.army/-/tree/main/src/web">
					ipv4.army
				</Link>{" "}
				is what I'm mostt proud of
			</Popover>

			<Popover id="gaming" title="Virtual Reality & Gaming">
				Gaming is pretty cool, been doing it pretty much my whole life
				<br />
				Virtual Reality is also pretty cool, so add the two together and... yeah
				<br />
				I've dumped a decent amount of time and money into a PC and VR setup..
				<table>
					<thead>
						<tr>
							<th>Computer</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>CPU</td>
							<td>AMD Ryzen 5 7600X3D</td>
						</tr>
						<tr>
							<td>RAM</td>
							<td>DDR5 32GB @ 4800MHz</td>
						</tr>
						<tr>
							<td>Storage</td>
							<td>1x 2TB NVMe</td>
						</tr>
						<tr>
							<td>GPU</td>
							<td>NVIDIA GeForce RTX 5070 12GB</td>
						</tr>
					</tbody>
				</table>
				<table>
					<thead>
						<tr>
							<th>VR</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Headset</td>
							<td>Valve Index</td>
						</tr>
						<tr>
							<td>Controller</td>
							<td>x2 Valve Index Controller</td>
						</tr>
						<tr>
							<td>Base Station</td>
							<td>x4 Valve Index Base Station</td>
						</tr>
						<tr>
							<td>Tracker</td>
							<td>x4 VIVE Tracker 3.0</td>
						</tr>
					</tbody>
				</table>
			</Popover>

			<Popover id="audio" title="Music & Audio">
				I'll DJ occasionally, or produce something just for fun
				<br />I have a FiiO <Link href="https://www.fiio.com/k3s">K3S</Link>{" "}
				DAC, the beyerdynamic{" "}
				<Link href="https://beyerdynamic.com/p/dt-770-pro-limited">
					DT 770 Pro Limited
				</Link>{" "}
				Headphones, a Blue{" "}
				<Link href="https://logitechg.com/en-us/shop/p/yeti-nano-usb-microphone">
					Yeti Nano
				</Link>
				, and a SteelSeries{" "}
				<Link href="https://steelseries.com/gaming-microphones/alias?model=Pro">
					Alias Pro
				</Link>
			</Popover>

			<Popover id="smarthome" title="Smart Home Equipment">
				I love having control over my stuff at the touch of a button
				<br />
				I've invested in the{" "}
				<Link href="https://csa-iot.org/all-solutions/matter">Matter</Link> over{" "}
				<Link href="https://threadgroup.org">Thread</Link> ecosystem, and refuse
				to use pretty much anything else
				<br />I have quite a few smart plugs, lightbulbs, and sensors, all just
				in my room.
				<br />
				While I do babble with{" "}
				<Link href="https://home-assistant.io">Home Assistant</Link>, I choose
				to use <Link href="https://home.google.com">Google Home</Link> just to
				keep things simple.
				<br />
				Unfortunately my lightbulb of choice, are the{" "}
				<Link href="https://philips-hue.com">Philips Hue</Link> bulbs, even
				though they run{" "}
				<Link href="https://csa-iot.org/all-solutions/zigbee">Zigbee</Link>,
				they are always going to be the superior bulbs.
			</Popover>
		</>
	);
};
