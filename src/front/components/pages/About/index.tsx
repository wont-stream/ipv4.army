import 'mdui/components/card';
import 'mdui/components/avatar';

import 'mdui/components/segmented-button-group';
import 'mdui/components/segmented-button';

import { getColorFromImage } from 'mdui/functions/getColorFromImage';
import { artist } from '../../../utilities/artist';
import Lanyard from '../../Lanyard';
import Hyperate from '../../Hyperate';

const Abyssinian = new Image();
Abyssinian.src = "/public/Abyssinian/default.png";
Abyssinian.onload = async () => {
    const profilePicture = document.getElementById("profilePicture") as HTMLElement;

    artist(await getColorFromImage(Abyssinian), profilePicture);

    profilePicture.setAttribute("src", Abyssinian.src);
    profilePicture.innerText = "";
};

export default () => {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "100%",
        }}>
            <mdui-card variant="filled" style={{
                width: "90%",
                padding: ".5rem",
                // center the contents
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",

                textAlign: "center",
            }}>
                <mdui-avatar style={{
                    width: "5rem",
                    height: "inherit",
                    border: "2px solid rgb(var(--status-color))",
                }} id="profilePicture">S</mdui-avatar>
                <h1>Seth</h1>
                {/* make important text bold */}
                <p>
                    A <strong>Dedicated</strong> Backend Developer, with many <strong>passions</strong>.
                    <br />
                    <br />
                    <mdui-segmented-button-group full-width>
                        <mdui-segmented-button>high-fidelity audio</mdui-segmented-button>
                        <mdui-segmented-button>gaming</mdui-segmented-button>
                        <mdui-segmented-button>development</mdui-segmented-button>
                    </mdui-segmented-button-group>
                </p>
            </mdui-card>

            <br style={{
                display: "var(--lanyard-display)",
            }} />

            <mdui-card variant="filled" style={{
                width: "90%",
                padding: ".5rem",
                // center the contents
                display: "var(--lanyard-display, flex)",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",

                //textAlign: "center",
            }}>
                <Lanyard />
            </mdui-card>

            <br style={{
                display: "var(--hyperate-display)",
            }} />

            <mdui-card variant="filled" style={{
                width: "90%",
                padding: ".5rem",
                // center the contents
                display: "var(--hyperate-display, flex)",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",

                //textAlign: "center",
            }}>
                <Hyperate />
            </mdui-card>
        </div >
    );
};
