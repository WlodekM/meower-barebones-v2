/**
 * @file ZZZzzz...
 */

//NOTE - No, I didn't steal this from Meower Svelte, what are you talking about? (5)

/**
 * Sleep for a certain amount of milliseconds.
 * @param {number} ms
 * @returns {Promise}
 */
export default function (ms) {
	return new Promise(r => setTimeout(r, ms));
}