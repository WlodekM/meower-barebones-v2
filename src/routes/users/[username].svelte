<script>
	import { apiUrl, encodeApiURLParams } from "@/lib/urls.js";
	import { params, goto } from "@roxi/routify";
	import { authHeader, chats } from "@/lib/stores.js";
    import { ulist, user } from "@/lib/stores";
    import * as clm from "@/lib/clm.js";
	import PostList from '@/lib/PostList.svelte';
    import Topbar from "@/lib/Topbar.svelte";
    import Container from "@/lib/Container.svelte";
    import hljs from "highlight.js";
	import MarkdownIt from "markdown-it";
	import autosize from 'svelte-autosize';

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

	let profileThemeMatch;
	let profileTheme;
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
		if(json._id == $user.name) {
			if(isJsonString(json.layout) && json.layout != "\"new\"" && json.layout != "\"old\"") {
				json.layout = JSON.parse(json.layout)
			} else {
				clm.updateProfile({
					layout: {css: ""}
				})
				$user.layout = {css: ""}
				json.layout = {css: ""}
			}
		}
		profileThemeMatch = json.quote.match(/:mbb\{"border":"#[0-9a-fA-F]{6}","background":"#[0-9a-fA-F]{6}","sec-background":"#[0-9a-fA-F]{6}"\}$/g)
		if(profileThemeMatch) {
			json.quote = json.quote.replaceAll(profileThemeMatch[0], "")
			profileTheme = JSON.parse((profileThemeMatch)[0].replace(":mbb", ""))
		}
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
	let _debug = $user.debug
</script>

<div style={profileTheme ? `background: ${profileTheme.background}; min-height: 100VH` : ""}>
<Topbar />
<div style={profileTheme ? `--border: ${profileTheme.border}; --secondary-bg: ${profileTheme["sec-background"]}; background: ${profileTheme.background}; --bg-light: ${profileTheme["sec-background"]}; min-height: 100%` : ""}>
{#await loadProfile()}
    Loading...
{:then data} 
    <div style="padding: 8px;">
        <Container>
            <h1 style="margin: 0;margin-bottom: 8px;">{$params.username}</h1>
			{#if $ulist.includes($params.username)}
				Online
			{:else}
				Offline since {new Date(data.last_seen * 1000)}
			{/if}
			<br>
			<button 
			on:click={async () => {
				let chat = $chats.find(
					_chat =>
						_chat.type === 1 &&
						_chat.members.includes(data._id)
				);
				if (chat) {
					$goto(`/chats/[chatid]`, {chatid: chat._id});
				} else {
					try {
						const resp = await fetch(
							`${apiUrl}users/${data._id}/dm`,
							{
								method: "GET",
								headers: $authHeader,
							}
						);
						if (!resp.ok) {
							switch (resp.status) {
								case 403:
									return;
								case 429:
									throw new Error(
										"Too many requests! Try again later."
									);
								default:
									throw new Error(
										"Response code is not OK; code is " +
											resp.status
									);
							}
						}
						const chat = await resp.json();
						if (
							$chats.findIndex(
								_chat => _chat._id === chat._id
							) === -1
						) {
							$chats.push(chat);
						}
						$goto(`/chats/[chatid]`, {chatid: chat._id});
					} catch (e) {
						console.error(e)
					}
				}
			}}>Message</button>
			<button disabled>Block</button>
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
				<br />
                Enable debug mode: <input type="checkbox" name="XSS" checked={_debug} 
                    on:click={() =>{
						_debug = _debug === true ? false : true;
                        clm.updateProfile({
                            debug: _debug
                        })}}
                /><br>
                debug mode is currently {($user.debug ?? false) ? "enabled" : "disabled"}
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
					<textarea name="mbb" bind:value={_layout.css} style="width: 100%;" use:autosize /><br>
					<input type="submit" value="Save">
				</form>
            </Container>
        </div>
	{:else}
		<PostList path={`users/${$params.username}/posts`} enablePosting={false} update={false} />
    {/if}
{/await}
</div>
</div>