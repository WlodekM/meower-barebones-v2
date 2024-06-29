<script>
    // import ProgressBar from '@/components/ProgressBar.svelte'
    import "../Style.css"
    import ProgressBar from "@/lib/ProgressBar.svelte"
    import { url } from '@roxi/routify'
    import { isLoggedIn, user } from "@/lib/stores.js";
    const requiredLoginPaths = [
        "/home",
        "/home/",
        "/credits",
        "/credits/",
        "/logout",
        "/logout/",
        "/chats",
    ]
    if(window.location?.pathname == "/" || (!$isLoggedIn && requiredLoginPaths.some((a)=>window.location?.pathname.startsWith(a))) && !window.location?.pathname.startsWith("/token")) {
        console.log(`/login?redirect=${window.location?.pathname}`, $url(`/login`, {
            redirect: window.location?.pathname
        }))
        // fuck it, $goto SUCKS
        window.location.href = $url(`/login`, {
            redirect: window.location?.pathname
        })
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

	// let currentPage = "";
	// let currentParams = JSON.stringify($params);
	// let remounting = false;
	// $afterPageLoad(async page => {
	// 	if (remounting) return;

	// 	if (page.title === currentPage) {
	// 		if (currentParams !== JSON.stringify($params)) {
	// 			currentPage = page.title;
	// 			currentParams = JSON.stringify($params);

	// 			remounting = true;
	// 			await tick();
	// 			remounting = false;
	// 		}
	// 	} else {
	// 		currentPage = page.title;
	// 		currentParams = JSON.stringify($params);
	// 	}
	// });
</script>

<ProgressBar />

{#key $user.layout}
    {@html `<style>${$user.layout.css}</style>`}
{/key}
<slot />
