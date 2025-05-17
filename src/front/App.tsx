import "mdui/components/layout";
import "mdui/components/layout-main";

import NavigationBar from "./components/NavigationBar";
import TopAppBar from "./components/TopAppBar";

import About from "./components/pages/About";

export default () => {
	return (
		<mdui-layout full-height>
			<TopAppBar />
			<mdui-layout-main>
				<About />
			</mdui-layout-main>
			<NavigationBar />
		</mdui-layout>
	);
};
