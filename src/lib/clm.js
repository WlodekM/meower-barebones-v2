import { chats, ulist, isLoggedIn, user, authHeader } from './stores.js'
import { linkUrl } from "./urls.js";
import { writable } from "svelte/store";
import { tick } from "svelte"
import Cloudlink from "./cloudlink.js";
export let isWaitingForStatus = writable(false);
export let status = null;

//NOTE - No, I didn't steal this from Meower Svelte, what are you talking about? (3)
/**
 * The single CloudLink instance used by the manager.
 */
export const link = new Cloudlink();
let events = {}
export let connected = false
connect()
// @ts-ignore
window.cljs = link;

let _chats, _authHeader = null
let _user = {
    name: null,
    flags: 0,
    permissions: 0,
    unread_inbox: false,
    theme: "orange",
    mode: true,
    sfx: true,
    bgm: false,
    bgm_song: 2,
    layout: {
        css: ""
    },
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
};
chats.subscribe(v => {
	_chats = v;
});

authHeader.subscribe(v => {
	_authHeader = v;
});

user.subscribe(v => {
	_user = v;
});

//NOTE - No, I didn't steal this from Meower Svelte, what are you talking about? (4)
/**
 * Send a "Meower request" - a packet that makes the server respond with a direct and a statuscode packet.
 *
 * @param {object} data
 * @returns {Promise<object | string>} Either an object representing the direct command's val parameter (if it resolves), or an error code as a string (if it rejects).
 */
export async function meowerRequest(data) {
	link.log("manager", "meower request", data);
	return new Promise((resolve, reject) => {
		let returnData = null;
		const timer = setTimeout(() => {
			reject("Timed out");
		}, 10000);
		const ev = link.sendListener(
			{
				...data,
				listener: "listener_" + Math.floor(Math.random() * 10000000),
			},
			cmd => {
				if (cmd.cmd === "statuscode") {
					link.off(ev);

					clearTimeout(timer);

					if (cmd.val === "I:100 | OK") {
						resolve(returnData);
					} else {
						reject(cmd.val);
					}
				} else if (cmd.cmd === "direct") {
					returnData = cmd.val;
				}
			}
		);
	});
}

export function connect() {
    if(events) {
        for (const ev in events) {
            if (Object.hasOwnProperty.call(events, ev)) {
                const evID = events[ev];
                if(evID) {
                    delete events[ev]
                    link.off(evID)
                }
            }
        }
    }
    link.connect(linkUrl)
    events.connected = link.on("connected", () => {
        connected = true
        setInterval(() => {
            link.send({cmd: "ping", val: ""});
        }, 10000);
    });
    events.ulist = link.on("ulist", cmd => {
        const _ulist = cmd.val.split(";");
        if (_ulist[_ulist.length - 1] === "") {
            _ulist.pop();
        }
        ulist.set(_ulist);
    });
    events.update_chat = link.on("direct", cmd => {
        if (cmd.val.mode === "update_chat") {
            let itemIndex = _chats.findIndex(
                chat => chat._id === cmd.val.payload._id
            );
            if (itemIndex === -1) return;
            _chats[itemIndex] = Object.assign(
                _chats[itemIndex],
                cmd.val.payload
            );
            chats.set(_chats);
        }
    });
    events.create_chat = link.on("direct", cmd => {
        if (cmd.val.mode === "create_chat") {
            let itemIndex = _chats.findIndex(
                chat => chat._id === cmd.val.payload._id
            );
            if (itemIndex !== -1) return;
            _chats.push(cmd.val.payload);
            chats.set(_chats);
        }
    });
    events.auth = link.on("direct", async cmd => {
        if (cmd.val.mode === "auth") {
            user.update(v =>
                Object.assign(v, {
                    ...cmd.val.payload.account,
                    name: cmd.val.payload.username,
                })
            );
            authHeader.set({
                username: cmd.val.payload.username,
                token: cmd.val.payload.token,
            });
    
            // get and set chats
            await tick();
            const resp = await fetch(`https://api.meower.org/chats?autoget=1`, {
                headers: _authHeader,
            });
            const json = await resp.json();
            chats.set(json.autoget);
        }
    });
    events.delete = link.on("direct", cmd => {
        if (cmd.val.mode === "delete") {
            _chats = _chats.filter(chat => chat._id !== cmd.val.id);
            chats.set(_chats);
        }
    });
    events.disconnect = link.on("disconnected", (e) => {
        console.log("DISCONNECTED")
        isLoggedIn.set(false)
        connected = false
        connect()
    })
}

/**
 * Sends a request to update the user's settings.
 *
 * @returns {Promise<object | string>} Either an object or an error code; see meowerRequest.
 */
export async function updateProfile(updatedValues) {
	if (!_user.name) return;
	Object.assign(_user, updatedValues);
	user.set(_user);
    if(updatedValues.layout) {
        updatedValues.layout = JSON.stringify(updatedValues.layout)
    }
	return meowerRequest({
		cmd: "direct",
		val: {
			cmd: "update_config",
			val: updatedValues,
			/*{
				unread_inbox: profile.unread_inbox,
				theme: profile.theme,
				mode: profile.mode,
				sfx: profile.sfx,
				bgm: profile.bgm,
				bgm_song: profile.bgm_song,
				layout: profile.layout,
				hide_blocked_users: profile.hide_blocked_users,
				favorited_chats: profile.favorited_chats,
				pfp_data: profile.pfp_data,
				quote: profile.quote,
			},*/
		},
	});
}

export function sendCmd(cmd, val) {
    if(!connected) connect()
    return meowerRequest({
        "cmd": "direct",
        "val": {
            cmd: cmd,
            val: val,
        }
    })
}