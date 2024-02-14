<script>
	import PostList from '@/lib/PostList.svelte';
    import { sendCmd, meowerRequest, link } from '@/lib/clm.js'
	import { isGuest, user, isLoggedIn, ulist } from '@/lib/stores.js'
    import Topbar from "@/lib/Topbar.svelte";
	//@ts-ignore
    import { goto } from "@roxi/routify"
	import Container from "@/lib/Container.svelte";
	import { emojify } from "@/lib/emojis.js";
    if(!$isLoggedIn) {$goto("/login")}
    const path = '/home?autoget'
	let postContent
	let postError = ""
</script>

<Topbar />
<div class="margin" style="margin-top: 8px;">
	<Container>
		<h1 style="margin: 0;margin-bottom: 8px;">Home</h1>
		There are {$ulist.length} users online
		<br>
		{#each $ulist as user}
			<span>{user}, </span>
		{/each}
	</Container>
</div>

<div class="posting">
    <!-- style="resize: none;width:calc(100% - (11px * 2) - 100px)" -->
    <textarea rows="2" class="type-message" bind:this={postContent}></textarea>
    <button id="postbutton" on:click={()=>{
		console.log("hi mom")
		let post = postContent.value + " "
		post = emojify(post)
		//@ts-ignore
		if (window.mixins) {
			//@ts-ignore
			if (typeof window.mixins != "array") window.mixins = []
			//@ts-ignore
			window.mixins.forEach(mixin => {
				if(mixin.type == "prePost") {
					post = mixin.function()
				}
			});
		}
		if ($isGuest) {
			fetch('https://webhooks.meower.org/post/home', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ "post": post, "username": $user.name })
			})
				.then(response => response.text())
			postContent.value = ""
		} else {
			sendCmd("post_home", post).catch((err) => {
				postError = `Error when posting: "${err}"`
			})
			postContent.value = ""
		}
		//@ts-ignore
		if (window.mixins) {
			//@ts-ignore
			if (typeof window.mixins != "array") window.mixins = []
			//@ts-ignore
			window.mixins.forEach(mixin => {
				if(mixin.type == "onPosted") {
					mixin.function(post)
				}
			});
		}
	}}>Post!</button>
</div>

<div id="posts">
	<PostList />
</div>

<style>
	.margin {
		margin-inline: 8px;
	}
</style>