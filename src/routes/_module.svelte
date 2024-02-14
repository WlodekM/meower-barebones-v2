<script>
    // import ProgressBar from '@/components/ProgressBar.svelte'
    import "../Style.css"
    import ProgressBar from "@/lib/ProgressBar.svelte"
    import { Router, createRouter, isActive, url, goto } from '@roxi/routify'
    import { isLoggedIn } from "@/lib/stores.js";
    const requiredLoginPaths = [
        "/home",
        "/home/",
        "/credits",
        "/credits/",
        "",
        "/",
        "/logout",
        "/logout/"
    ]
    if(!$isLoggedIn && requiredLoginPaths.includes(window.location?.pathname)) {
        $goto("/login")
    }
</script>

<ProgressBar />

<slot />
