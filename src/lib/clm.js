import { isGuest, user, isLoggedIn } from './stores.js'
import { linkUrl } from "./urls.js";
import Cloudlink from "./cloudlink.js";
import {writable} from "svelte/store";
export let isWaitingForStatus = writable(false);
export let status = null;

//NOTE - No, I didn't steal this from Meower Svelte, what are you talking about? (3)
/**
 * The single CloudLink instance used by the manager.
 */
export const link = new Cloudlink();
link.connect(linkUrl)
// @ts-ignore
window.cljs = link;

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

function connect() {
    link.on("connected", () => {
        // disconnected.set(false);
        // attemptedAutoReconnect.set(false);
        setInterval(() => {
            link.send({cmd: "ping", val: ""});
        }, 10000);
    });
	link.once("connectionstart", () => {
        //...
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

link.on("disconnect", (e) => {
    isLoggedIn.set(false)
})

export function sendCmd(cmd, val) {
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