import { useState } from 'preact/hooks';

import './index.css';


export default () => {
    const [heartrate, setHeartrate] = useState(0);

    const ws = new WebSocket("wss://app.hyperate.io/socket/websocket?token=wv39nM6iyrNJulvpmMQrimYPIXy2dVrYRjkuHpbRapKT2VSh65ngDGHdCdCtmEN9");

    let hrTimeout: ReturnType<typeof setTimeout>;

    const setHrInterval = () => {
        hrTimeout = setTimeout(() => {
            return setHeartrate(0);
        }, 6000);
    };

    ws.onopen = () => {
        ws.send(
            JSON.stringify({
                topic: "hr:0BCA",
                event: "phx_join",
                payload: {},
                ref: 0,
            }),
        );

        setInterval(() => {
            ws.send(
                JSON.stringify({
                    topic: "phoenix",
                    event: "heartbeat",
                    payload: {},
                    ref: 0,
                }),
            );
        }, 10000);

        return setHrInterval();
    };


    ws.onmessage = ({ data }) => {
        const { event, payload } = JSON.parse(data);
        switch (event) {
            case "hr_update": {
                clearTimeout(hrTimeout);
                setHrInterval();
                setHeartrate(payload.hr);
                break;
            }
            default: {
                break;
            }
        }
    };

    return (
        <>
            <div style={heartrate == 0 ? "display:none" : `--bpm: ${heartrate};`} class="heart">
                    ♥️
                    <br />
                    <span>{heartrate} BPM</span>
            </div>
        </>
    )
}