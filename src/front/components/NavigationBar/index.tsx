import "mdui/components/navigation-bar";
import "mdui/components/navigation-bar-item";
import "mdui/components/button-icon";

import "@mdui/icons/person--outlined";
import "@mdui/icons/person--rounded";

import "@mdui/icons/more-vert--rounded";

export default () => {
	return (
		<mdui-navigation-bar value="about">
			<mdui-navigation-bar-item value="about">
				<mdui-icon-person--outlined slot="icon" />
				<mdui-icon-person--rounded slot="active-icon" />
				About
			</mdui-navigation-bar-item>
		</mdui-navigation-bar>
	);
};
