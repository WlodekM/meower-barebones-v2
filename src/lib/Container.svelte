<script>
    export let style = "";
</script>

<div class="container" style={style ?? ""}>
    <slot />
</div>

<style>
    .container {
        border-radius: 5px;
        background:    var(--secondary-bg);
        padding:       5px;
        border:        2px var(--border) solid;
        text-wrap:     wrap;
        overflow-wrap: break-word;
        position: relative;
        overflow: auto;
        box-sizing:    border-box;
        max-width:     100vw;
    }
</style>