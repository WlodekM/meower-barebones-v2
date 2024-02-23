<script>
    // import marked from "marked";
	import MarkdownIt from "markdown-it";
    import hljs from "highlight.js";
    import Container from "@/lib/Container.svelte";
	import FormattedDate from "./FormattedDate.svelte";
	import { IMAGE_HOST_WHITELIST } from "./whitelist";
    import UsernameDisplay from "@/lib/UsernameDisplay.svelte";
    import { ulist, user } from "./stores"
    export let post;
    export let input;

    // yoink
	function markdown(input) {
		try {
			const md = new MarkdownIt("default", {
				breaks: true,
				linkify: true,
				typographer:  true,
			});
			md.linkify.add("@", {
				validate: function (text, pos) {
					var tail = text.slice(pos);
					return tail.match(/[a-zA-Z0-9-_]{1,20}/gs)[0].length;
				},
				normalize: function (match) {
					match.url = "/users/" + match.url.replace(/^@/, '');
				}
			});
			const tokens = md.parse(input.replaceAll(/\[([^\]]+?): (https:\/\/[^\]]+?)\]/gs, "").replaceAll(/\*\*\*\*/gs, "\\*\\*\\*\\*"));
			for (const token of tokens) {
				if (token.children) {
					for (const childToken of token.children) {
						if (childToken.type === "image") {
							const srcPos = childToken.attrs.findIndex(attr => attr[0] === "src");
							if (true) {
								childToken.attrs[srcPos][1] = "about:blank";
								console.log(childToken);
							}
						}
						if (childToken.type === "link_open") {
							const href = childToken.attrs.find(attr => attr[0] === "href")[1];
							childToken.attrs.push(["onclick", `return confirmLink('${href}')`]);
						}
					}
				}
			}
			input = md.renderer.render(tokens, md.options);

			// add quote containers to blockquotes (although, quotes are currently broken)
			input = input.replaceAll(
				/<blockquote>(.+?)<\/blockquote>/gms,
				'<div class="quote-container"><blockquote>$1</blockquote></div>'
			);
		} catch (e) {
			console.error(`Failed to load markdown on ${post.post_id}: ${e}`);
		}

		// twemoji
		// input = twemoji.parse(input, {
		// 	folder: "svg",
		// 	ext: ".svg",
		// 	size: 20,
		// });
		return input
	}
	/** @param {string} content */
	async function addFancyElements(content) {
		// markdown (which has HTML escaping built-in)
		var renderedContent;

		try {
			const md = new MarkdownIt("default", {
				breaks: true,
				linkify: true,
				typographer: true,
                highlight(str, lang) {
                    if (lang && hljs.getLanguage(lang)) {
                    return hljs.highlight(str, { language: lang }).value;
                    }
                    return "";
                },
			});
            //TODO - add user page
			md.linkify.add("@", {
				validate: function (text, pos) {
					var tail = text.slice(pos);
					return tail.match(/[a-zA-Z0-9-_]{1,20}/gs)[0].length;
				},
				normalize: function (match) {
					match.url =
						"/users/" +
						match.url.replace(/^@/, "");
				},
			});
			const regexPattern = /\[([^\]]+?): (https:\/\/[^\]]+?)\]/gs;

			// Caht gtp
			content = content.replace(regexPattern, '![image.png]($2)');

			// console.log(content)
			const tokens = md.parse(
				content
					.replaceAll(/\[([^\]]+?): (https:\/\/[^\]]+?)\]/gs, `![IMAGE]()`)
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
									childToken.attrs[srcPos][1].toLowerCase().startsWith(o.toLowerCase())
								) && $user.whitelist_enabled
							) {
								childToken.attrs[srcPos][1] = "about:blank";
								childToken.children[0].content = `[Image blocked]`;
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
			console.error(`Failed rendering post: ${e}`);
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
    <div class="post-header" style="width: 100%;">
        <UsernameDisplay member={post.u} showOnline={false} />
		{#if post.bridged}
			<badge>BRIDGED</badge>
		{/if}
        {#if post.p.endsWith(" ")}
            <span class="badge">
                Barebones
            </span>
        {/if}
		{#if $ulist.includes(post.u)}
			<div class="online"></div>
		{/if}
		<span class="id">{post._id}</span>
		<div id="spacer" style="width: 100%;"></div>
		{#if input}
			<button
				on:click={() => {
					let existingText = input.value;

					const mentionRegex =
						/^@\w+\s\[\w+-\w+-\w+-\w+-\w+\]\s*/i;
					const mention = `@${post.u} [${post.post_id}] `;
					console.log(post, post.u)

					if (mentionRegex.test(existingText)) {
						input.value = existingText
							.trim()
							.replace(mentionRegex, mention);
					} else {
						input.value = mention + existingText.trim();
					}

					input.focus();
				}}
			>reply</button>
		{/if}
    </div>
	<div class="post-time">
		<FormattedDate date={post.t.e} />
	</div>
	<!-- {@html marked(post.p)} -->
	{#await ($user.xss ? markdown : addFancyElements)(post.p) then content}
		{@html content}
	{/await}
</div>

<style>
	.id {
		color: #fff4;
		text-wrap: nowrap;
		min-width: fit-content;
	}

	:global(.post p) {
		margin: 0;
	}

    .post {
        margin-top: 10px;
		word-wrap: break-word;
    }

	.online {
		min-width: 10px !important;
		height: 10px;
		margin-block: auto;
		background: limegreen;
		border-radius: 100%;
	}

	.post-header {
		display: inline-flex;
		gap: 10px;
	}

	:global(.post img) {
		max-height: 12em;
		max-width: 100%;
		border-radius: 5px;
	}

    /* .post div img {
        width: 150px;
        height: auto;
        border-radius: 5px;
        border: 1px rgba(255, 255, 255, 0.1) solid;
    } */
</style>