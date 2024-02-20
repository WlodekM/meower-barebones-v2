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
        "/chats"
    ]
    if(!$isLoggedIn && requiredLoginPaths.some((a)=>window.location?.pathname.startsWith(a))) {
        $goto("/login")
    }
    //TODO - Do better code ¯\_(ツ)_/¯
    let _user
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
    user.subscribe((v)=>{
        _user = v
        waitForElm("#css").then(el => {
            if(el) {
                el.innerText = _user.layout.css
            } else {console.log("no #css?")}
        })
    })
</script>

<ProgressBar />

<div>
    {#key $user}
        <style id="css"></style>
    {/key}
    <slot />
</div>
