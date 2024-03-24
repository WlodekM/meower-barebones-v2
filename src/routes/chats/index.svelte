<script>
    import { user, chats, isLoggedIn, ulist, authHeader } from "@/lib/stores.js";
    import { goto, url } from "@roxi/routify";
    import { apiUrl } from "@/lib/urls.js";
    import UsernameDisplay from "@/lib/UsernameDisplay.svelte";
    import Topbar from "@/lib/Topbar.svelte"
    import Container from "@/lib/Container.svelte"
	let sortedChats;
    if(!$isLoggedIn) {$goto("/login")}
    async function loadPost(path) {
        const params = new URLSearchParams({
            autoget: "1",
            page: (1).toString(),
        }).toString();
        const resp = await fetch(`${apiUrl}${path}?${params}`, {headers: $authHeader})
        if (!resp.ok) {
            throw new Error('Response code is not OK; code is ' + resp.status)
        }
        const json = await resp.json()

        const result = json.autoget[0]
        return result
    }

    sortedChats = $chats
        .sort((a, b) => {
            return b.last_active - a.last_active;
        });
</script>

<Topbar />

<div style="padding: 8px;">
    {#each sortedChats as chat}
        {#if chat.type == 0}
            <a href={`/chats/${chat._id}`} style="text-decoration: none;">
                <Container>
                    <h1>
                        {chat.nickname} <span style="color: gray;font-size: 0.5em;">({chat._id})</span>
                    </h1>
                    {@const members = chat.members.length > 10
                        ? chat.members.slice(0, 9)
                        : chat.members}
                    Members: {#each members as member}
                        <span>
                            <UsernameDisplay member={member} />{#if members.indexOf(member) != members.length -1},&nbsp;{/if}
                        </span>
                    {/each}
                    {#if chat.members.length > 10}
                        ...
                    {/if}
                    <br>
                    {#await loadPost(`posts/${chat._id}`) then post}
                        <i>
                            {post.u}: {post.p}
                        </i>
                    {/await}
                </Container>
            </a>
            <div style="margin-bottom: 8px;"></div>
        {:else if chat.type == 1}
            <a href={`/chats/${chat._id}`} style="text-decoration: none;">
                <Container>
                    <h1 style="margin: 0;">
                        {chat.members.filter(
                            username => username !== $user.name
                        )[0]}
                        {#if $ulist?.includes(chat.members.filter(
                            username => username !== $user.name
                        )[0])}
                            <span style="color: lime;font-size: 0.5em;">Online</span>
                        {:else}
                            <span style="color: gray;font-size: 0.5em;">Offline</span>
                        {/if} <span style="color: gray;font-size: 0.5em;">({chat._id})</span>
                    </h1>
                    <!-- {chat.members.length > 10
                        ? chat.members.slice(0, 9).join(", ") + "..."
                        : chat.members.join(", ")} -->
                    {#await loadPost(`posts/${chat._id}`) then post}
                        <i>
                            {post.u}: {post.p}
                        </i>
                    {/await}
                </Container>
            </a>
            <div style="margin-bottom: 8px;"></div>
        {/if}
    {/each}
</div>

<style>
    h1 {
        margin: 0;
        margin-bottom: 8px;
        /* cursor: pointer;
        text-decoration: underline; */
    }
</style>