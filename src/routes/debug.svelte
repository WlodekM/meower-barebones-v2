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
			if (typeof window.mixins != "array") window.mixins = []
			//@ts-ignore
			window.mixins.forEach(mixin => {
				if(mixin.type == "onPosted") {
					mixin.function()
				}
			});
		}
    //@ts-ignore
    if (typeof window.mixins != "array") window.mixins = []
    //@ts-ignore
    window.mixins.forEach(mixin => {
        debug.mixins.push(mixin)
    });
</script>

<Topbar />

<h1>Debug info</h1>
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
<h2>Mixins</h2>
{#each debug.mixins as mixin}
    <h4>{mixin.type}</h4>
    {mixin.function?.toString() ?? "Null"}
{/each}
{#if !debug.mixins}
    No mixins found, either your plugins r brokey or you dont use plugins (IMPOSSIBUL!11!11!?!???//)
{/if}