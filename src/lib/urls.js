/**
 * @file Server-related URL constants.
 */

// no i didnt steal this from meower svelte, what are you talking about?

// wss://server.meower.eu.org/
// The (cl3 rewrite) API URL is https://api.meower.eu.org/

export const debug = false

export const linkUrl =
	(debug ? "wss://server.meower.eu.org/" : "wss://api.meower.org/v0/cloudlink/");
export const apiUrl =
	(debug ? "https://api.meower.eu.org/" : "https://api.meower.org/");
export const encodeApiURLParams =
	false;