<script>
    import { onDestroy, onMount } from "svelte"
    import Post from "./Post.svelte";
    import { link } from "./clm";
    import { apiUrl } from '@/lib/urls.js'
    import { authHeader } from "./stores.js";
    export const path = '/home'

    let queryParams = {}
    
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

    export const origin = "home"

    let posts = [];

    (async () => {
        //@ts-ignore
        posts = (await loadPosts())
        console.log(posts)
    })()

    let destroy = () => {}

    onMount(()=>{
        const eventID = link.on("direct", (cmd) => {
            if (!cmd.val) return;
            if (cmd.val["post_origin"] == origin) {
                posts.unshift(cmd.val)
            }
            if (cmd.val.mode == "delete") {
                let postID = posts.findIndex((a)=>{a["_id"] == cmd.val.id})
                if (posts[postID]) deleteFromArray(posts, postID)
            }
        })
        destroy = ()=>{
            link.off(eventID)
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
</script>
{#key posts}
    {#each posts.map(postsMapThing) as post}
        <Post post={post} />
    {/each}
{/key}
