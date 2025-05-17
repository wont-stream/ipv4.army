import "mdui/components/top-app-bar";
import "mdui/components/top-app-bar-title";
import "mdui/components/button-icon";

export default () => {
    return (
        // @ts-ignore // variant is not in the types for some reason?
        <mdui-top-app-bar variant="center-aligned" scroll-behavior="elevate">
            <mdui-top-app-bar-title>IPv4.ARMY</mdui-top-app-bar-title>
        </mdui-top-app-bar>
    );
};
