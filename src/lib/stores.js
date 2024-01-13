import {writable} from "svelte/store";

export let isLoggedIn = writable(false);
export let isGuest = writable(false);
export let user = writable({
    username: ""
});