import "mdui/components/navigation-bar";
import "mdui/components/navigation-bar-item";
import "mdui/components/button-icon";

import "@mdui/icons/person--outlined";
import "@mdui/icons/person--rounded";

import "@mdui/icons/more-vert--rounded";

export default () => {
    return (
        <mdui-navigation-bar value="item-1">
            <mdui-navigation-bar-item value="item-1">
                <mdui-icon-person--outlined slot="icon" />
                <mdui-icon-person--rounded slot="active-icon" />
                Item 1
            </mdui-navigation-bar-item>
            <mdui-navigation-bar-item value="item-2">
                <mdui-icon-more-vert--rounded slot="icon" /> Item 2
            </mdui-navigation-bar-item>
            <mdui-navigation-bar-item value="item-3">
                <mdui-icon-more-vert--rounded slot="icon" /> Item 3
            </mdui-navigation-bar-item>
            <mdui-navigation-bar-item value="item-4">
                <mdui-icon-more-vert--rounded slot="icon" /> Item 4
            </mdui-navigation-bar-item>
        </mdui-navigation-bar>
    );
};
