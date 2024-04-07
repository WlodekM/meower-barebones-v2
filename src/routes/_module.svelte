<script>
    // import ProgressBar from '@/components/ProgressBar.svelte'
    import "../Style.css"
    import ProgressBar from "@/lib/ProgressBar.svelte"
    import { Router, createRouter, isActive, url, goto } from '@roxi/routify'
    import { isLoggedIn, user } from "@/lib/stores.js";
    const requiredLoginPaths = [
        "/home",
        "/home/",
        "/credits",
        "/credits/",
        "",
        "/",
        "/logout",
        "/logout/",
        "/chats",
    ]
    if((!$isLoggedIn && requiredLoginPaths.some((a)=>window.location?.pathname.startsWith(a))) && !window.location?.pathname.startsWith("/token")) {
        console.log(`/login?redirect=${window.location?.pathname}`)
        $goto($url(`/login`, {
            redirect: window.location?.pathname
        }))
    }
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document, {
                childList: true,
                subtree: true
            });
        });
    }
</script>

<ProgressBar />

{#key $user.layout}
    {@html `<style>${$user.layout.css}</style>`}
{/key}
<slot />
