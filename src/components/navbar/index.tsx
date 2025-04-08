export default () => {
    return (
        <>
            <nav class="navbar shadow fixed-top" style="background-color: var(--bs-content-bg); border-bottom: var(--bs-border-width) solid var(--bs-content-border-color);">
                <div class="container-fluid">
                    <div class="navbar-brand">
                        <img src="favicon.svg" alt="Logo" width="24" height="24" class="d-inline-block align-text-top" />
                        Seth
                    </div>
                    <span class="navbar-text">
                        IPv4 dot Army
                    </span>
                    <div class="d-flex hstack gap-2" role="search">
                        <button type="button" class="btn btn-outline-success btn-sm">🗕︎</button>
                        <button type="button" class="btn btn-outline-warning btn-sm">🗖︎</button>
                        <button type="button" class="btn btn-outline-danger btn-sm">🗙︎</button>
                    </div>
                </div>
            </nav>
        </>
    )
}