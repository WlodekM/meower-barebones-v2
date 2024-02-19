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
        "/logout/",
        "/chats"
    ]
    if(!$isLoggedIn && requiredLoginPaths.some((a)=>window.location?.pathname.startsWith(a))) {
        $goto("/login")
    }
</script>

<ProgressBar />

<slot />
