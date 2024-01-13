export const cl = new WebSocket("wss://server.meower.org/")
function sendDirect(val) {
	cl.send(JSON.stringify({
		"cmd": "direct",
		"val": val
	}))
}

cl.onmessage = (event) => {
	console.log(event.data);
};
cl.onopen = (event) => {
	sendDirect("meower")
	console.log("meower")
};