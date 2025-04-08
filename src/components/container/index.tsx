import { useState } from 'preact/hooks';

import Heart from '../heart';

const api = "lanyard.creations.works"

const statusMap = {
    online: "border-success-subtle",
    idle: "border-warning-subtle",
    dnd: "border-danger-subtle",
    offline: "border-light-subtle",
}

export default () => {
    const [status, setStatus] = useState<keyof typeof statusMap>('offline');

    fetch(`https://${api}/v1/users/1273447359417942128`)
    .then(req => req.json())
    .then((res) => {
            if (res.data.discord_status) {
                setStatus(res.data.discord_status);
            } else {
                setStatus('offline');
            }
        })

    return (
        <>
            <div class="container bg-body-tertiary shadow text-center position-absolute top-50 start-50 translate-middle mx-auto py-4">
                <img src="favicon.svg" class={`img-thumbnail rounded-circle border border-4  ${statusMap[status]}`} alt="..." width="100" />
                <br />
                <h1>Seth</h1>
                <h6 class="lead">Dedicated Backend Developer
                    <br />
                    <br />
                    <small class="text-body-secondary">
                        With a passsion for high-fidelity audio, gaming, and web development
                    </small>
                </h6>
                <Heart />
            </div>
        </>
    )
}