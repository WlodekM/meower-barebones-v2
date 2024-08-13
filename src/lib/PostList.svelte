<script>
    import { onDestroy, onMount } from "svelte"
    import Post from "./Post.svelte";
    import * as clm from "./clm";
    import { apiUrl } from '@/lib/urls.js'
    import { authHeader, user, isGuest, isLoggedIn } from "./stores.js";
    import Container from "./Container.svelte"
	import { emojify } from "@/lib/emojis.js";
	import autosize from 'svelte-autosize';
	// import EmojiPicker from "svelte-emoji-picker";
    import { shiftHeld } from "./key.js";

    export let path = '/home'
    export let origin = "home"
    export let chat = "home"
    export let update = true
    // export let expandUserList = false
    export let enablePosting = true
    let postAttachments = [];

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
        const resp = await fetch(`${apiUrl}${path}?${params}`, {headers: $authHeader})
        if (!resp.ok) {
            throw new Error('Response code is not OK; code is ' + resp.status)
        }
        const json = await resp.json()

        const result = json.autoget
        return result
    }

    function processPost(post) {
        if ("lower_username" in post) {
            // @ts-ignore
            const user = {
                id: id++,
                ...post,
            };
            return user;
        }
        if (post.post_origin === "inbox") {
            if (post.u === "Server") {
                post.u = "Announcement";
            } else {
                post.u =
                    path === "inbox"
                        ? "Notification"
                        : `Notification to ${post.u}`;
            }
        }
		//@ts-ignore
		if (window.mixins) {
			//@ts-ignore
			if (!window.mixins) window.mixins = []
			//@ts-ignore
			window.mixins.forEach(mixin => {
				if(mixin.type == "prePostRender") {
					post = mixin.function(post)
				}
			});
		}
        return {
            id: id++,
            post_id: post._id,
            post_origin: post.post_origin,
            attachments: post.attachments,
            user: post.u,
            content: post.p,
            unfiltered_content: post.unfiltered_p,
            bridged: post.bridged,
            date: post.t.e,
            edited_at: post.edited_at,
            isDeleted: post.isDeleted,
            mod_deleted: post.mod_deleted,
            deleted_at: post.deleted_at,
            reply_to: post.reply_to
        };
		// if ($user.hide_blocked_users) {
		// 	// @ts-ignore
		// 	result = result.filter(
		// 		post =>
		// 			$relationships[post._id] !== 2 &&
		// 			$relationships[post.u] !== 2
		// 	);
		// }
		// const numPages = json["pages"];

		// if (firstLoad) dispatch("loaded");
		// firstLoad = false;
		// return {
		// 	numPages,
		// 	result,
		// };
    }

	function deleteFromArray(array, index) {
		array.splice(index, 1)
	}

    let posts = [];

    (async () => {
        //@ts-ignore
        posts = (await loadPosts())
    })()


    if(update) {
        let destroy = () => {}

        if(destroy) destroy()
        onMount(()=>{
            const eventID = clm.link.on("direct", (cmd) => {
                if (!cmd.val) return;
                if (cmd.val["post_origin"] == origin) {
                    let temp = posts
                    temp.unshift(cmd.val)
                    posts = temp
                    if (cmd.val.mode == "delete") {
                        let postID = posts.findIndex((a)=>{a["_id"] == cmd.val.id})
                        if (posts[postID]) deleteFromArray(posts, postID)
                    }
                }
            })
            destroy = ()=>{
                clm.link.off(eventID)
            }
        })
        onDestroy(destroy)
    }
    
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
		return processPost(thePost)
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
    
    // thanks eri for the code :>
    //TODO - add eris to the credits
    function addAttachment(file) {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        // const element = document.createElement('div');

        const attachment = {file};
        attachment.req = new Promise((resolve, reject) => {
            attachment.cancel = (message) => {
                console.error(`Failed uploading ${file.name}`, message)
                xhr.abort();
                // element.remove();
                postAttachments = postAttachments.filter(item => item !== attachment);
                reject(message);
            };
            postAttachments.push(attachment);

            if (file.size > (50 << 20)) {
                attachment.cancel("Files must not exceed 50MiB.");
                return;
            }

            // element.classList.add("attach-pre-outer");
            // element.title = file.name;
            // if (getComputedStyle(document.documentElement).getPropertyValue('--color-scheme').trim() === 'light') {
            //     element.classList.add(`lightpre`);
            // }
            // element.innerHTML = `
            // <div class="attachment-wrapper">
            // <div class="attachment-progress" style="--pre: 0%;">
            // <span>0%</span>
            // </div>
            // <div class="attachment-name">
            // <span>${file.name}</span>
            // </div>
            // <div class="delete-attach">
            // <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15 3.999V2H9V3.999H3V5.999H21V3.999H15Z"></path><path fill="currentColor" d="M5 6.99902V18.999C5 20.101 5.897 20.999 7 20.999H17C18.103 20.999 19 20.101 19 18.999V6.99902H5ZM11 17H9V11H11V17ZM15 17H13V11H15V17Z"></path></svg>
            // </div>
            // </div>
            // `;
            // element.querySelector(".attachment-wrapper").querySelector(".delete-attach").onclick = () => { attachment.cancel(""); };
            if (file.type.includes("image/") && file.size < (10 << 20)) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    // const img = document.createElement("img");
                    // img.classList.add("image-pre");
                    // img.src = reader.result;
                    // img.onclick = () => {
                    //     openImage(reader.result);
                    // };
        
                    // const attachmentMedia = document.createElement("div");
                    // attachmentMedia.classList.add("attachment-media");
                    // attachmentMedia.appendChild(img);

                    // const attachmentWrapper = element.querySelector(".attachment-wrapper")
                    // attachmentWrapper.insertBefore(attachmentMedia, attachmentWrapper.querySelector(".attachment-name"));
                };
                reader.readAsDataURL(file);
            } else {
                // const fileType = document.createElement("span");
                // fileType.classList.add("other-in");
                // fileType.innerText = file.name.split('.').pop().toLowerCase();

                // const otherPre = document.createElement("div");
                // otherPre.classList.add("other-pre");
                // otherPre.appendChild(fileType);

                // const attachmentOther = document.createElement("div");
                // attachmentOther.classList.add("attachment-other");
                // attachmentOther.appendChild(otherPre);

                // const attachmentWrapper = element.querySelector(".attachment-wrapper")
                // attachmentWrapper.insertBefore(attachmentOther, attachmentWrapper.querySelector(".attachment-name"));
            }
            
            // document.getElementById('images-container').appendChild(element);

            xhr.open("POST", "https://uploads.meower.org/attachments");
            xhr.setRequestHeader("Authorization", localStorage.getItem("token"));
            xhr.upload.onprogress = (ev) => {
                const percentage = `${Number((ev.loaded / ev.total) * 100).toFixed(2)}%`;
                // element.querySelector(".attachment-progress").style.setProperty('--pre', `${percentage}`);
                // element.querySelector(".attachment-progress span").innerText = `${percentage}`;
            };
            xhr.onload = () => {
                // element.querySelector(".attachment-progress").style.setProperty('--pre', `0`);
                // const attachmentProgress = element.querySelector(".attachment-progress").querySelector("span");
                // attachmentProgress.remove();

                resolve(JSON.parse(xhr.response));
            };
            xhr.onerror = (error) => {
                attachment.cancel(error);
            };
            formData.append("file", file);
            xhr.send(formData);
        });
    }

    function selectFiles() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.click();
        postAttachments = [];
        input.onchange = function(e) {
            //@ts-ignore
            for (const file of e.target.files) {
                addAttachment(file);
            }
        };
    }

    let submitBtn
    let txt = "";
</script>
{#if enablePosting}
<div class="posting">
    <!-- style="resize: none;width:calc(100% - (11px * 2) - 100px)" -->
    <textarea rows="2" class="type-message" bind:this={postInput} use:autosize bind:value={txt}
    on:keydown={event => {
        if (
            event.key == "Enter" &&
            !shiftHeld
        ) {
            event.preventDefault();
            if (!submitBtn.disabled) submitBtn.click();
        }
    }}></textarea>
    <!-- <EmojiPicker bind:value={txt} /> -->
    <button id="postbutton" on:click={()=>{
		let post = postInput.value
		post = emojify(post)
		//@ts-ignore
		if (window.mixins) {
			//@ts-ignore
			if (!window.mixins) window.mixins = []
			//@ts-ignore
			window.mixins.forEach(mixin => {
				if(mixin.type == "prePost") {
					post = mixin.function(post)
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
        post = post + " "
        postPost(post, origin)
        if (postError) {
            //@ts-ignore
            if (window.mixins) {
                //@ts-ignore
                if (!window.mixins) window.mixins = []
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
			if (!window.mixins) window.mixins = []
			//@ts-ignore
			window.mixins.forEach(mixin => {
				if(mixin.type == "onPosted") {
					mixin.function(post)
				}
			});
		}
	}}
    bind:this={submitBtn}
    >Post!</button>
</div>
{/if}

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