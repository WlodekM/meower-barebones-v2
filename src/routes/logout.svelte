<script>
	import { user, authHeader, isLoggedIn, isGuest } from "../lib/stores.js";

	import {goto} from "@roxi/routify";
	import {onMount, tick} from "svelte";

	onMount(async () => {
		localStorage.removeItem("meower_savedusername");
		localStorage.removeItem("meower_savedpassword");
		user.set({
            name: null,
            flags: 0,
            permissions: 0,
            unread_inbox: false,
            theme: "orange",
            mode: false,
            sfx: true,
            bgm: false,
            bgm_song: 2,
            layout: "new",
            debug: false,
            hide_blocked_users: false,
            favorited_chats: [],
            embeds_enabled: true,
            pfp_data: 1,
            quote: "",
            ban: {
                state: "None",
                expires: 0,
                reason: "",
            },
            xss: false
        });
		authHeader.set({
			username: null,
			token: null,
		});
        $isLoggedIn = false;
        $isGuest = false;
		// screen.set("setup");
		await tick();
        $goto("/login")
	});
</script>