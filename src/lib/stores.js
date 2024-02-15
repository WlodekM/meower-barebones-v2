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
    xss: false,
    whitelist_enabled: true,
});
export let chats = writable([])
export let ulist = writable([])
export let page  = writable("")
export const chat = writable({
	_id: "",
	type: 0,
	nickname: "",
	owner: "",
	members: [],
	created: 0,
	last_active: 0,
	deleted: false,
});
export let authHeader = writable({
    username: null,
    token: null,
})

//@ts-ignore
window.stores = {}
isLoggedIn.subscribe((value)=>{
    //@ts-ignore
    window.stores.isLoggedIn = value
})
isGuest.subscribe((value)=>{
    //@ts-ignore
    window.stores.isGuest = value
})
user.subscribe((value)=>{
    //@ts-ignore
    window.stores.user = value
})
chats.subscribe((value)=>{
    //@ts-ignore
    window.stores.chats = value
})
ulist.subscribe((value)=>{
    //@ts-ignore
    window.stores.ulist = value
})
page.subscribe((value)=>{
    //@ts-ignore
    window.stores.page = value
})
ulist.subscribe((value)=>{
    //@ts-ignore
    window.stores.ulist = value
})
chat.subscribe((value)=>{
    //@ts-ignore
    window.stores.chat = value
})
authHeader.subscribe((value)=>{
    //@ts-ignore
    window.stores.authHeader = value
})