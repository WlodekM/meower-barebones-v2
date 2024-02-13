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
};
chats.subscribe(v => {
	_chats = v;
	// if (_authHeader.username && _authHeader.token) {
	// 	localStorage.setItem("meower_savedusername", _authHeader.username);
	// 	localStorage.setItem("meower_savedpassword", _authHeader.token);
	// }
});

authHeader.subscribe(v => {
	_authHeader = v;
	// if (_authHeader.username && _authHeader.token) {
	// 	localStorage.setItem("meower_savedusername", _authHeader.username);
	// 	localStorage.setItem("meower_savedpassword", _authHeader.token);
	// }
});

user.subscribe(v => {
	_user = v;
	// if (_authHeader.username && _authHeader.token) {
	// 	localStorage.setItem("meower_savedusername", _authHeader.username);
	// 	localStorage.setItem("meower_savedpassword", _authHeader.token);
	// }
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
	// spinner.set(true);
	return new Promise((resolve, reject) => {
		let returnData = null;
		const timer = setTimeout(() => {
			reject("Timed out");
			// spinner.set(false);
		}, 10000);
		const ev = link.sendListener(
			{
				...data,
				listener: "listener_" + Math.floor(Math.random() * 10000000),
			},
			cmd => {
				if (cmd.cmd === "statuscode") {
					link.off(ev);
					// spinner.set(false);

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
    console.log(events)
    if(events) {
        for (const ev in events) {
            if (Object.hasOwnProperty.call(events, ev)) {
                const evID = events[ev];
                if(evID) {
                    delete events[ev]
                    console.log(`link.off("${evID}") // ${ev}`)
                    link.off(evID)
                }
            }
        }
    }
    link.connect(linkUrl)
    events.connected = link.on("connected", () => {
        // disconnected.set(false);
        // attemptedAutoReconnect.set(false);
        connected = true
        setInterval(() => {
            link.send({cmd: "ping", val: ""});
        }, 10000);
    });
	// events.connectionstart = link.once("connectionstart", () => {
    //     //...
    // });
    events.ulist = link.on("ulist", cmd => {
        console.log("ulist", cmd.val)
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
            // set user, auth header, and relationships
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
            // _relationships = {};
            // for (let relationship of cmd.val.payload.relationships) {
            //     _relationships[relationship.username] = relationship.state;
            // }
            // relationships.set(_relationships);
    
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

// cl.onmessage = (event) => {
// 	console.log(event.data);
//     if(JSON.parse(event.data).val == "I:112 | Trusted Access enabled") {
//         sendDirect("meower")
//         console.log("meower")
//     }
//     if (isWaitingForStatus && JSON.parse(event.data).cmd == "statuscode") {
//         status = JSON.parse(event.data).val
//     }
// };

export function sendCmd(cmd, val) {
    if(!connected) connect()
    console.log({
        "cmd": "direct",
        "val": {
            cmd: cmd,
            val: val,
        }
    })
    return meowerRequest({
        "cmd": "direct",
        "val": {
            cmd: cmd,
            val: val,
        }
    })
}