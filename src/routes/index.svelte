<script>

    import { apiUrl } from '@/lib/urls.js'
    import { cl, sendCmd, sendDirect } from '@/lib/cl.js'
	import { isGuest, user, isLoggedIn } from '@/lib/stores.js'
    import { goto } from "@roxi/routify"
    if(!$isLoggedIn) {$goto("/login")}
    const path = '/home?autoget'

	// PagedList stuff
	let list;
	export let items = [];

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
		posts = aa
	})
    cl.onmessage = (event) => {
        console.log(event.data);
        if (JSON.parse(event.data)["val"]["post_origin"]) {
			// svelte moment
			console.log("its a post!!!111", JSON.parse(event.data)["val"])
			//TODO - Rename this var
			let temp = posts
            temp.unshift(JSON.parse(event.data)["val"])
			posts = temp
			console.log(posts)
        }
    };
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
		return post
	}
	let postContent
	console.log(posts)
</script>

<div class="top">
    <h1 id="logo">Meower Barebones</h1>
    <div id="controls">
        <input type="text" id="username" value="Username" />
        <!-- <div id=spacer style="width:25px;"></div> -->
        <!-- <label for="badwords">Show bad words:</label><input type="checkbox" id="badwords"> -->
        <div id="spacer" style="width:50px;"></div>
        <button id="reload">Reload</button>
    </div>
</div>
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
		} else {
			sendCmd("post_home", postContent.value)
		}
	}}>Post!</button>
</div>

<div id="posts">
	{#each posts.map(postsMapThing) as post}
		<div class="post" id="{post["post_id"]}">
			<span id=username>
				{@html post.u}
			</span>
			<p>
				{post.p}
			</p>
			<div class="post-images" id="{post["post_id"]}-images"></div>
		</div>
	{/each}
</div>
