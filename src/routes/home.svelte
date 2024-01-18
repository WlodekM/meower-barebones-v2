<script>

    import { apiUrl } from '@/lib/urls.js'
    import { sendCmd, meowerRequest, link } from '@/lib/clm.js'
	import { isGuest, user, isLoggedIn, ulist } from '@/lib/stores.js'
    import Topbar from "@/lib/Topbar.svelte";
	//@ts-ignore
    import { goto } from "@roxi/routify"
	import Container from "@/lib/Container.svelte";
    import Post from "@/lib/Post.svelte";
	import { emojify } from "@/lib/emojis.js";
    if(!$isLoggedIn) {$goto("/login")}
    const path = '/home?autoget'
	function deleteFromArray(array, index) {
		array.splice(index, 1)
	}

	// PagedList stuff
	let list;
	let items = [];

	/**
	 * Loads posts
	 * @returns {Promise<{Array}>}
	 */
    async function loadPosts() {
        const resp = await fetch(`${apiUrl}${path}`)

        if (!resp.ok) {
        throw new Error('Response code is not OK; code is ' + resp.status)
        }
        const json = await resp.json()

        const result = json.autoget
        return result
    }
	/**
	 * Posts
	 * @type {Array}
	 */
    let posts = []
	loadPosts().then((aa)=>{
		//@ts-ignore
		posts = aa
	})
    link.on("direct", (cmd) => {
		if (!cmd.val) return;
        // console.log(`h`, cmd.val);
        if (cmd.val["post_origin"] == "home") {
			// svelte moment
			console.log("its a post!!!111", cmd.val)
			//TODO - Rename this var
			let temp = posts
            temp.unshift(cmd.val)
			posts = temp
			console.log(posts)
        }
    });
    link.on("direct", (cmd) => {
		console.log("direct", cmd)
		if (cmd.val.mode != "delete") return;
        // console.log(`h`, cmd.val);
        let postID = posts.findIndex((a)=>{a["_id"] == cmd.val.id})
		console.log(`delete post #${postID} (${cmd.val.id})\n`, "object:", posts[postID])
		deleteFromArray(posts, postID)
    });
	function postsMapThing(post) {
		const badges = {
			"Discord": "Bridged",
			"Revower": "Bridged",
			"RevowerJS": "Bridged",
			"Webhooks": "Webhook",
		}
        if (badges[post.u]) {
            post.u = `${post.p.split(":")[0]} <badge>${String(badges[post.u]).toUpperCase()}</badge>`
            post.p = post.p.split(":").slice(1).join(":")
        }
		post.p.replaceAll("\n", "<br>")
		return post
	}
	let postContent
	console.log(posts)
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
	}}>Post!</button>
</div>

<div id="posts">
	{#each posts.map(postsMapThing) as post}
        <Post post={post} />
	{/each}
</div>

<style>
	.margin {
		margin-inline: 8px;
	}
</style>