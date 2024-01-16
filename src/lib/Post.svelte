<script>
    // import marked from "marked";
	import MarkdownIt from "markdown-it";
    import Container from "@/lib/Container.svelte";
    export let post;

    // yoink
	/** @param {string} content */
	async function addFancyElements(content) {
		// markdown (which has HTML escaping built-in)
		var renderedContent;

		try {
			const md = new MarkdownIt("default", {
				breaks: true,
				linkify: true,
				typographer: true,
			});
            //TODO - add user page
			// md.linkify.add("@", {
			// 	validate: function (text, pos) {
			// 		var tail = text.slice(pos);
			// 		return tail.match(/[a-zA-Z0-9-_]{1,20}/gs)[0].length;
			// 	},
			// 	normalize: function (match) {
			// 		match.url =
			// 			window.location.host +
			// 			"/users/" +
			// 			match.url.replace(/^@/, "");
			// 	},
			// });
			const tokens = md.parse(
				content
					.replaceAll(/\[([^\]]+?): (https:\/\/[^\]]+?)\]/gs, "")
					.replaceAll(/\*\*\*\*/gs, "\\*\\*\\*\\*"),
				{}
			);
			for (const token of tokens) {
				if (token.children) {
					for (const childToken of token.children) {
						if (childToken.type === "image") {
							const srcPos = childToken.attrs.findIndex(
								attr => attr[0] === "src"
							);
							if (
								!IMAGE_HOST_WHITELIST.some(o =>
									childToken.attrs[srcPos][1]
										.toLowerCase()
										.startsWith(o.toLowerCase())
								)
							) {
								childToken.attrs[srcPos][1] = "about:blank";
								console.log(childToken);
							}
						}
						if (childToken.type === "link_open") {
							const href = childToken.attrs.find(
								attr => attr[0] === "href"
							)[1];
							childToken.attrs.push([
								"onclick",
								`return confirmLink('${href}')`,
							]);
						}
					}
				}
			}

			renderedContent = md.renderer.render(tokens, md.options);

			// add quote containers to blockquotes (although, quotes are currently broken)
			renderedContent = renderedContent.replaceAll(
				/<blockquote>(.+?)<\/blockquote>/gms,
				'<div class="quote-container"><blockquote>$1</blockquote></div>'
			);

			// if ($user.embeds_enabled) {
			// 	let youtubeMatches = [
			// 		...new Set(
			// 			content.match(
			// 				/(\<|)(http|https):\/\/(www.youtube.com\/watch\?v=|youtube.com\/watch\?v=|youtu.be\/)(\S{11})(\>|)?/gm
			// 			)
			// 		),
			// 	];
			// 	for (const watchURL of youtubeMatches) {
			// 		if (watchURL.startsWith("<") && watchURL.endsWith(">"))
			// 			continue;
			// 		let response = await (
			// 			await fetch(
			// 				`https://youtube.com/oembed?url=${watchURL}`
			// 			)
			// 		).json();
			// 		renderedContent += `<div class="youtube-container">
			// 			<h4>${response.title}</h4>
			// 			<span style="color: #606060; font-size: 1.1rem">${response.author_name}</span><br><br>
			// 			<img src="${response.thumbnail_url}" height=180 width=240 loading="lazy" alt="Thumbnail for ${response.title}">
			// 		</div>`;
			// 	}
			// }
		} catch (e) {
			// this is to stop any possible XSS attacks by bypassing the markdown lib
			// which is responsible for escaping HTML
			return `Failed rendering post: ${e}`;
		}

		// twemoji
		// renderedContent = twemoji.parse(renderedContent, {
		// 	folder: "svg",
		// 	ext: ".svg",
		// 	size: 20,
		// });

		return renderedContent;
	}
</script>
<div class="post container">
    <div class="post-header">
        {@html post.u}
        {#if post.p.endsWith(" ")}
            <span class="badge">
                Barebones
            </span>
        {/if}
    </div>
    <p>
        <!-- {@html marked(post.p)} -->
        {#await addFancyElements(post.p) then content}
            {@html content}
        {/await}
    </p>
    <div class="post-images" id="{post["post_id"]}-images"></div>
</div>

<style>
    .post {
        margin-top: 10px;
    }

    /* .post div img {
        width: 150px;
        height: auto;
        border-radius: 5px;
        border: 1px rgba(255, 255, 255, 0.1) solid;
    } */
</style>