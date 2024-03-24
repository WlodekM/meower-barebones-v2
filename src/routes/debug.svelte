<script>
	import { isLoggedIn } from '@/lib/stores.js'
    import Topbar from "@/lib/Topbar.svelte";
	//@ts-ignore
    import { goto } from "@roxi/routify"
    if(!$isLoggedIn) {$goto("/login")}
    let debug = {
        stores: [],
        mixins: []
    }
    //@ts-ignore
    for (const key in window.stores) {
        //@ts-ignore
        if (Object.hasOwnProperty.call(window.stores, key)) {
            //@ts-ignore
            const value = window.stores[key];
            debug.stores.push({
                key: key,
                value: value ?? "Null"
            })
        }
    }
		//@ts-ignore
		if (window.mixins) {
			//@ts-ignore
			if (!window.mixins) window.mixins = []
			//@ts-ignore
			window.mixins.forEach(mixin => {
				if(mixin.type == "onPosted") {
					mixin.function()
				}
			});
		}
    //@ts-ignore
    if (!window.mixins) window.mixins = []
    //@ts-ignore
    window.mixins.forEach(mixin => {
        debug.mixins.push(mixin)
    });
	let files;
</script>

<Topbar />

<h1>Debug info</h1>
<input accept=".js,.mjs,.plugin.js,.mbb.js,.barebones.js" bind:files id="avatar" name="avatar" type="file" />
<br>
<button on:click={async ()=>{
    if(files) {
        eval(await files[0].text())
    }
}}>Load plugin</button>
<h2>Mixins</h2>
{#each debug.mixins as mixin}
    <h4>{mixin.type}</h4>
    {mixin.function?.toString() ?? "Null"}
{/each}
{#if debug.mixins.length <= 0}
    No mixins found, either your plugins r brokey or you dont use plugins (IMPOSSIBUL!11!11!?!???//)
{/if}
<h2>Stores</h2>
{#each debug.stores as store}
    <h4>{store.key}</h4>
    <textarea style="width: 100%;" on:change={(e)=>{
        let parsedValue
        try {
            //@ts-ignore
            parsedValue = JSON.parse(e.target?.value)
        } catch (err) {
            //@ts-ignore
            e.target.value = e.originalTarget.value
            return
        }
        //@ts-ignore
        window.stores[store.key] = parsedValue}}>{JSON.stringify(store.value) ?? "Null"}</textarea>
{/each}