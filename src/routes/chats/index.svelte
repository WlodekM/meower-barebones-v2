<script>
    import { user, chats, isLoggedIn, ulist } from "@/lib/stores.js";
    import { goto, url } from "@roxi/routify";
    import UsernameDisplay from "@/lib/UsernameDisplay.svelte";
    import Topbar from "@/lib/Topbar.svelte"
    import Container from "@/lib/Container.svelte"
	let sortedChats;
    if(!$isLoggedIn) {$goto("/login")}

    sortedChats = $chats
        .sort((a, b) => {
            return b.last_active - a.last_active;
        });
</script>

<Topbar />

<div style="padding: 8px;">
    {#each sortedChats as chat}
        {#if chat.type == 0}
            <Container>
                <h1>
                    {chat.nickname} <span style="color: gray;font-size: 0.5em;">({chat._id})</span>
                </h1>
                {@const members = chat.members.length > 10
                    ? chat.members.slice(0, 9)
                    : chat.members}
                Members: {#each members as member}
                    <UsernameDisplay member={member} />
                    {#if members.indexOf(member) != members.length -1},&nbsp;{/if}
                {/each}
                {#if chat.members.length > 10}
                    ...
                {/if}
                <br>
                <a href={`/chats/${chat._id}`}>join</a>
            </Container>
            <div style="margin-bottom: 8px;"></div>
        {:else if chat.type == 1}
            <Container>
                <h1>
                    {chat.members.filter(
						username => username !== $user.name
					)[0]} <span style="color: gray;font-size: 0.5em;">({chat._id})</span>
                </h1>
                {#if $ulist?.includes(chat.members.filter(
                    username => username !== $user.name
                )[0])}
                    <span style="color: lime;">Online</span>
                {:else}
                    <span style="color: gray;">Offline</span>
                {/if}
                <!-- {chat.members.length > 10
                    ? chat.members.slice(0, 9).join(", ") + "..."
                    : chat.members.join(", ")} -->
            </Container>
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