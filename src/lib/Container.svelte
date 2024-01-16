<div class="container">
    <slot />
</div>

<style>
    .container {
        border-radius: 5px;
        background:    var(--secondary-bg);
        padding:       5px;
        border:        2px var(--border) solid;
        text-wrap:     wrap;
        max-width: 100vw;
    }
</style>