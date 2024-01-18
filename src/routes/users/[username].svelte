<script>
	import { apiUrl, encodeApiURLParams } from "@/lib/urls.js";
	import { params, goto } from "@roxi/routify";
    import { ulist, user } from "@/lib/stores";
    import * as clm from "@/lib/clm.js";
    import Topbar from "@/lib/Topbar.svelte";
    import Container from "@/lib/Container.svelte";
    import hljs from "highlight.js";
	import MarkdownIt from "markdown-it";

    const PFP_COUNT = 34;

    const pfps = new Array(PFP_COUNT).fill().map((_, i) => i + 1);
    let pfpSwitcher = false;

    async function loadProfile() {
        let path = `users/${$params.username}`;
        if (encodeApiURLParams) path = encodeURIComponent(path);
        const resp = await fetch(`${apiUrl}${path}`);
        if (!resp.ok) {
            throw new Error("Response code is not OK; code is " + resp.status);
        }
        const json = await resp.json();
        return json;
    }
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
			md.linkify.add("@", {
				validate: function (text, pos) {
					var tail = text.slice(pos);
					return tail.match(/[a-zA-Z0-9-_]{1,20}/gs)[0].length;
				},
				normalize: function (match) {
					match.url =
						window.location.host +
						"/users/" +
						match.url.replace(/^@/, "");
				},
			});
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
								true
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
		} catch (e) {
			// this is to stop any possible XSS attacks by bypassing the markdown lib
			// which is responsible for escaping HTML
			return `Failed rendering post: ${e}`;
		}

		return renderedContent;
	}
</script>

<Topbar />

{#await loadProfile()}
    Loading...
{:then data} 
    <div style="padding: 8px;">
        <Container>
            <h1 style="margin: 0;margin-bottom: 8px;">{$params.username}</h1>
            {$ulist.includes($params.username) ? "Online" : "Offline"}
        </Container>
    </div>
    <div style="padding: 8px; padding-block: 0;">
        <Container>
            <h2 style="margin: 0;margin-bottom: 8px;">Quote</h2>
            {#await addFancyElements(data.quote) then content}
                <i>{@html content}</i>
            {/await}
        </Container>
    </div>
    {#if $params.username == $user.name}
        <div style="padding: 8px;">
            <Container>
                <h2 style="margin: 0;margin-bottom: 8px;">Settings</h2>
                Enable xss: <input type="checkbox" name="XSS" checked={$user.xss} 
                    on:click={() =>
                        clm.updateProfile({
                            xss: $user.xss === true ? false : true,
                        })}
                /><br>
                XSS is currently {($user.xss ?? false) ? "enabled" : "disabled"}
            </Container>
        </div>
    {/if}
{/await}