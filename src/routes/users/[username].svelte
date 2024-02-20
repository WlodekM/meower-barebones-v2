<script>
	import { apiUrl, encodeApiURLParams } from "@/lib/urls.js";
	import { params, goto } from "@roxi/routify";
	import { authHeader } from "@/lib/stores.js";
    import { ulist, user } from "@/lib/stores";
    import * as clm from "@/lib/clm.js";
    import Topbar from "@/lib/Topbar.svelte";
    import Container from "@/lib/Container.svelte";
    import hljs from "highlight.js";
	import MarkdownIt from "markdown-it";

    const PFP_COUNT = 34;

	function isJsonString(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}

    const pfps = new Array(PFP_COUNT).fill().map((_, i) => i + 1);
    let pfpSwitcher = false;

    async function loadProfile() {
        let path = `users/${$params.username}`;
        if (encodeApiURLParams) path = encodeURIComponent(path);
        const resp = await fetch(`${apiUrl}${path}`, 
			{
				headers: $authHeader,
			});
        if (!resp.ok) {
            throw new Error("Response code is not OK; code is " + resp.status);
        }
        const json = await resp.json();
		if(isJsonString(json.layout)) {
			json.layout = JSON.parse(json.layout)
		} else {
			clm.updateProfile({
				layout: {css: ""}
			})
		}
		console.log(json)
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
	let _layout = $user.layout
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
			{#if $params.username == $user.name}
				<textarea name="Quote" id="quote"
					placeholder="Write something..."
					maxlength="360"
					style="width: 100%"
					bind:value={$user.quote}
					on:change={() => clm.updateProfile({quote: $user.quote})}
				/>
			{:else}
				{#await addFancyElements(data.quote) then content}
					<i>{@html content}</i>
				{/await}
			{/if}
        </Container>
    </div>
    {#if $params.username == $user.name}
        <div style="padding: 8px;">
            <Container>
                <h2 style="margin: 0;margin-bottom: 8px;">Settings</h2>
                Enable xss: <input type="checkbox" name="XSS" checked={_layout.xss} 
                    on:click={() =>{
						_layout.xss = _layout.xss === true ? false : true;
                        clm.updateProfile({
                            layout: _layout
                        })}}
                /><br>
                XSS is currently {($user.xss ?? false) ? "enabled" : "disabled"}
				<br>
                CSS theme: 
				<br>
				<form 
				on:submit={(e) => {
					e.preventDefault()
					clm.updateProfile({
						layout: _layout,
					})
				}}>
					<textarea name="mbb" bind:value={_layout.css} style="width: 100%;" /><br>
					<input type="submit" value="Save">
				</form>
            </Container>
        </div>
    {/if}
{/await}