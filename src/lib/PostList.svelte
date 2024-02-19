<script>
    import { onDestroy, onMount } from "svelte"
    import Post from "./Post.svelte";
    import * as clm from "./clm";
    import { apiUrl } from '@/lib/urls.js'
    import { authHeader, user, isGuest, isLoggedIn } from "./stores.js";
    import Container from "./Container.svelte"
	import { emojify } from "@/lib/emojis.js";

    export let path = '/home'
    export let origin = "home"
    export let chat = "home"
    export let enablePosting = true

    console.log(path)

    let id = 0;

    let queryParams = {}
    let postInput
    let postError = ""
	// let postContent = ""
    
	/**
	 * Loads posts
	 * @returns {Promise<{Array}>}
	 */
     async function loadPosts(page = 1) {
        const params = new URLSearchParams({
            autoget: "1",
            page: page.toString(),
            ...queryParams,
        }).toString();
        console.log(`${apiUrl}${path}?${params}`)
        const resp = await fetch(`${apiUrl}${path}?${params}`, {headers: $authHeader})
        if (!resp.ok) {
            throw new Error('Response code is not OK; code is ' + resp.status)
        }
        const json = await resp.json()
        console.log(`!!`, json)


        const result = json.autoget
        return result
    }

	function deleteFromArray(array, index) {
		array.splice(index, 1)
	}

    let posts = [];

    (async () => {
        //@ts-ignore
        posts = (await loadPosts())
        console.log(posts)
    })()

    let destroy = () => {}

    if(destroy) destroy()
    onMount(()=>{
        console.log("mounted")
        const eventID = clm.link.on("direct", (cmd) => {
            console.log("cmd", cmd)
            if (!cmd.val) return;
            if (cmd.val["post_origin"] == origin) {
                console.log("New post!!1!11111!1!!!1!1!!1!!!1!1!1")
                let temp = posts
                temp.unshift(cmd.val)
                posts = temp
            } else if (cmd.val["post_origin"]) console.log(cmd.val["post_origin"])
            if (cmd.val.mode == "delete") {
                let postID = posts.findIndex((a)=>{a["_id"] == cmd.val.id})
                if (posts[postID]) deleteFromArray(posts, postID)
            }
        })
        destroy = ()=>{
            console.log("destroyed")
            clm.link.off(eventID)
        }
    })
    onDestroy(destroy)
	function postsMapThing(post) {
		const badges = {
			"Discord": "Bridged",
			"Revower": "Bridged",
			"RevowerJS": "Bridged",
			"Webhooks": "Webhook",
		}
		let thePost = post
        if(!thePost.p) thePost.p = ""
        if (badges[thePost.u]) {
            thePost.u = `${thePost.p.split(":")[0]}`
			thePost.bridged = true
            thePost.p = thePost.p.split(":").slice(1).join(":")
        }
		return thePost
	}

    function postPost(content, postOrigin) {
        fetch(`${apiUrl}${postOrigin == "home" ? "home" : `posts/${postOrigin}`}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                ...$authHeader
            },
            body: JSON.stringify({content})
        }).then(response => response.text())
        postInput.value = ""
    }
</script>
<div class="posting">
    <!-- style="resize: none;width:calc(100% - (11px * 2) - 100px)" -->
    <textarea rows="2" class="type-message" bind:this={postInput}></textarea>
    <button id="postbutton" on:click={()=>{
		console.log("hi mom")
		let post = postInput.value + " "
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
        // if ($isGuest && chat != "home") return;
		// if ($isGuest) {
		// 	fetch('https://webhooks.meower.org/post/home', {
		// 		method: 'POST',
		// 		headers: {
		// 			'Accept': 'application/json',
		// 			'Content-Type': 'application/json'
		// 		},
		// 		body: JSON.stringify({ "post": post, "username": $user.name })
		// 	}).then(response => response.text())
        //     postInput.value = ""
		// }
        // if(chat == "home") {
		// 	fetch(`${apiUrl}${path}`, {
		// 		method: 'POST',
		// 		headers: $authHeader,
		// 		body: JSON.stringify({"post": post})
		// 	}).then(response => response.text())
        //     postInput.value = ""
        // } else {
        //     clm.sendCmd("post_chat", {chatid: chat, p: post}).catch((err) => {
        //         postError = `Error when posting: "${err}"`
        //     })
        // }
        postPost(post, origin)
        if (postError) {
            //@ts-ignore
            if (window.mixins) {
                //@ts-ignore
                if (typeof window.mixins != "array") window.mixins = []
                //@ts-ignore
                window.mixins.forEach(mixin => {
                    if(mixin.type == "onPostError") {
                        mixin.function(post)
                    }
                });
            }
            return
        }
        postInput.value = ""
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
    {#key posts}
        {#if $user.debug}
            <Container style="margin-top: 10px;">
                <h2 style="margin: 0;margin-bottom: 8px;">Debug info</h2>
                Rendered {posts.length} posts at {new Date()}
            </Container>
        {/if}
        {#each posts.map(postsMapThing) as post}
            <Post post={post} input={postInput} />
        {/each}
    {/key}
</div>