import "mdui/components/layout";
import "mdui/components/layout-main";

import Hyperate from "./components/Hyperate";
import Lanyard from "./components/Lanyard";
import NavigationBar from "./components/NavigationBar";
import TopAppBar from "./components/TopAppBar";

export default () => {
	return (
		<div>
			<TopAppBar />
			<mdui-layout>
				<mdui-layout-main>
					<div class="app terminal">
						<p>[seth@ipv4 ~]$ cat ./about.txt</p>
						<p>
							A Dedicated Backend Developer,
							<br />
							with a passion for high-fidelity audio,
							<br />
							gaming, and web development.
						</p>

						<p>[seth@ipv4 ~]$ cat /tmp/discord-ipc</p>
						<p>
							<Lanyard />
						</p>

						<p>[seth@ipv4 ~]$ cat /tmp/heartrate</p>
						<p>
							<Hyperate />
						</p>
					</div>
				</mdui-layout-main>
			</mdui-layout>
			<NavigationBar />
		</div>
	);
};
