<script>
    // import ProgressBar from '@/components/ProgressBar.svelte'
    import "../Style.css"
    import ProgressBar from "@/lib/ProgressBar.svelte"
    import { Router, createRouter, isActive, url, goto } from '@roxi/routify'
    import { isLoggedIn } from "@/lib/stores.js";
    if(!$isLoggedIn && window.location?.pathname != "/login") {
        $goto("/login")
    }
</script>

<ProgressBar />

<slot />
