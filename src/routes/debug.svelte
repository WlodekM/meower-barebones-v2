<script>
	import { isLoggedIn } from '@/lib/stores.js'
    import Topbar from "@/lib/Topbar.svelte";
	//@ts-ignore
    import { goto } from "@roxi/routify"
    if(!$isLoggedIn) {$goto("/login")}
</script>

<Topbar />

<h1>Debug info</h1>
<h2>Stores</h2>...
<h2>Mixins</h2>...