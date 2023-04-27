<div class="header-bar">
    <h1><b>
        <slot></slot>
    </b></h1>
</div>

<style>
    .header-bar {
        width: 100%;
        padding: 0.5em ;
        background: darkgrey;
    }

    h1 {
        font-size: 2.25em;
        margin: 0.2em;
    }
    b {
        font-weight: 600;
    }
</style>