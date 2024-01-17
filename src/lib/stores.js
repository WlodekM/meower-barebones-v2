import {writable} from "svelte/store";

function systemDarkMode() {
	if (window.matchMedia) {
		return window.matchMedia("(prefers-color-scheme: dark)").matches;
	} else {
		return false;
	}
}

export let isLoggedIn = writable(false);
export let isGuest = writable(false);
export let user = writable({
    name: null,
    flags: 0,
    permissions: 0,
    unread_inbox: false,
    theme: "orange",
    mode: !systemDarkMode(),
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
});
export let chats = writable([])
export let ulist = writable([])
export let authHeader = writable({
    username: null,
    token: null,
})