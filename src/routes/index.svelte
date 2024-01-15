<script>
	import { isLoggedIn } from '@/lib/stores.js'
    import { goto } from "@roxi/routify"
    if(!$isLoggedIn) {$goto("/login")}
	$goto("/home")
</script>
mbb