const emojis = {
    "test": {
        "id": "test",
        "title": "TEST EMOJI PLEASE IGNORE",
        "url": "https://wlodekm.github.io/goog/Goog.png" // omg sex real
    }
}

/**
 * Emoji-fy text
 * @param {String} text 
 */
export function emojify(text) {
    let emojifiedText = text
    for (const emojiID in emojis) {
        if (Object.hasOwnProperty.call(emojis, emojiID)) {
            const emoji = emojis[emojiID];
            emojifiedText.replaceAll(`:${emoji.id}:`, `![${emoji.title}](${emoji.url})`)
        }
    }
    return emojifiedText
}