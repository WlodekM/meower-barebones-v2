<script>

    import { apiUrl } from '@/lib/urls.js'
    import { sendCmd, meowerRequest, link } from '@/lib/clm.js'
	import { isGuest, user, isLoggedIn } from '@/lib/stores.js'
    import { goto } from "@roxi/routify"
    import Post from "@/lib/Post.svelte";
    if(!$isLoggedIn) {$goto("/login")}
    const path = '/home?autoget'

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
        if (cmd.val["post_origin"]) {
			// svelte moment
			console.log("its a post!!!111", cmd.val)
			//TODO - Rename this var
			let temp = posts
            temp.unshift(cmd.val)
			posts = temp
			console.log(posts)
        }
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

<div class="posting">
    <!-- style="resize: none;width:calc(100% - (11px * 2) - 100px)" -->
    <textarea rows="4" class="type-message" bind:this={postContent}></textarea>
    <button id="postbutton" on:click={()=>{
		console.log("hi mom")
		if ($isGuest) {
			fetch('https://webhooks.meower.org/post/home', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ "post": postContent.value, "username": $user.username })
			})
				.then(response => response.text())
			postContent.value = ""
		} else {
			sendCmd("post_home", postContent.value).catch((err) => {
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
