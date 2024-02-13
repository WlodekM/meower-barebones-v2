<script>
    import { chats, authHeader, chat, isGuest, user, ulist } from "@/lib/stores.js";
    import { apiUrl } from "@/lib/urls.js";
    import { goto, params } from "@roxi/routify";
	import {onMount, onDestroy} from "svelte";
    import UsernameDisplay from "@/lib/UsernameDisplay.svelte";
    import Topbar from "@/lib/Topbar.svelte"
    import Container from "@/lib/Container.svelte"
    import Post from "@/lib/Post.svelte";
    import * as clm from "@/lib/clm.js";
    import PostList from "@/lib/postList.svelte";
    onMount(async () => {
		if ($params.chatid === "livechat") {
			chat.set({
				_id: "livechat",
				type: 0,
				nickname: "Livechat",
				owner: "",
				members: [],
				created: 0,
				last_active: 0,
				deleted: false,
			});

			clm.link.send({
				cmd: "direct",
				val: {
					cmd: "set_chat_state",
					val: {
						state: 1,
						chatid: "livechat",
					},
				},
			});
		} else if ($params.admin) {
			try {
				const resp = await fetch(
					`${apiUrl}admin/chats/${$params.chatid}`,
					{
						headers: $authHeader,
					}
				);
				if (!resp.ok) {
					throw new Error(
						"Response code is not OK; code is " + resp.status
					);
				}
				chat.set(await resp.json());
			} catch (e) {
				console.log({
					title: "Failed getting chat",
					desc: `Error while getting chat ${$params.chatid}: ${e}`,
				});
			}
		} else {
			chats.subscribe(async _chats => {
				let _chat = $chats.find(_chat => _chat._id === $params.chatid);
				if (_chat) {
					chat.set(_chat);
				} else if ($chat._id) {
					// $goto("/chats");
				} else {
					try {
						const resp = await fetch(
							`${apiUrl}chats/${$params.chatid}`,
							{
								headers: $authHeader,
							}
						);
						if (!resp.ok) {
							if (resp.status === 404) {
								throw new Error(
									`The chat you requested (${$params.chatid}) doesn't exist or you don't have access to it.`
								);
							}
							throw new Error(
								"Response code is not OK; code is " +
									resp.status
							);
						}
						chat.set(await resp.json());
					} catch (e) {
						console.log({
							title: "Failed getting chat",
							desc: e,
						});
						// $goto("/chats");
					}
				}
			});
		}
	});
    let postContent, postError;
</script>

<Topbar />

<div style="padding: 8px;">
    <Container>
        {@const members = $chat.members.length > 50
            ? $chat.members.slice(0, 49)
            : $chat.members}
        <h1 style="margin: 0;margin-bottom: 8px;">
            {#if $chat.type == 0}
                {$chat.nickname}
            {:else}
                <UsernameDisplay member={$chat.members.filter(
                    username => username !== $user.name
                )[0]} showOnline={false} />
            {/if}
        </h1>
        <details>
            <summary style="cursor: pointer;">Members</summary>
            {#each members as member}
                <UsernameDisplay member={member} />
                {#if members.indexOf(member) != members.length -1},&nbsp;{/if}
            {/each}
        </details>
    </Container>
    <!-- 👍 -->
    <div class="posting" style="margin: 0;">
        <!-- style="resize: none;width:calc(100% - (11px * 2) - 100px)" -->
        <textarea rows="2" class="type-message" bind:this={postContent}></textarea>
        <button id="postbutton" on:click={()=>{
            console.log("hi mom")
            let post = postContent.value + " "
            // post = emojify(post)
            if ($isGuest) {
                // fetch('https://webhooks.meower.org/post/home', {
                //     method: 'POST',
                //     headers: {
                //         'Accept': 'application/json',
                //         'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify({ "post": post, "username": $user.name })
                // })
                //     .then(response => response.text())
                postContent.value = ""
            } else {
                clm.sendCmd("post_chat", {chatid: $params.chatid, p: post}).catch((err) => {
                    postError = `Error when posting: "${err}"`
                })
                postContent.value = ""
            }
        }}>Post!</button>
    </div>
    <PostList path={`posts/${$params.chatid}`} origin={$chat._id} />
</div>