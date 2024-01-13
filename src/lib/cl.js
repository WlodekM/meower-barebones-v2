export const cl = new WebSocket("wss://server.meower.org/")
export function sendDirect(val) {
	cl.send(JSON.stringify({
		"cmd": "direct",
		"val": val
	}))
}

cl.onmessage = (event) => {
	console.log(event.data);
    if(JSON.parse(event.data).val == "I:112 | Trusted Access enabled") {
        sendDirect("meower")
        console.log("meower")
    }
};

export function sendCmd(cmd, val) {
    console.log({
        "cmd": "direct",
        "val": {
            cmd: cmd,
            val: val,
        }
    })
    cl.send(JSON.stringify({
        "cmd": "direct",
        "val": {
            cmd: cmd,
            val: val,
        }
    }))
}