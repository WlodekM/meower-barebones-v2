<script>
    import { user, chats, isLoggedIn, ulist } from "@/lib/stores.js";
    import { goto } from "@roxi/routify";
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
                <h1 style="margin: 0;margin-bottom: 8px;">
                    {chat.nickname}
                </h1>
                {@const members = chat.members.length > 10
                    ? chat.members.slice(0, 9)
                    : chat.members}
                Members: {#each members as member}
                    <span style="color: {$ulist?.includes(member) ? "lime" : "gray"};">{member}</span>
                    {#if members.indexOf(member) != members.length -1},&nbsp;{/if}
                {/each}
                {#if chat.members.length > 10}
                    ...
                {/if}
            </Container>
            <div style="margin-bottom: 8px;"></div>
        {:else if chat.type == 1}
            <Container>
                <h1 style="margin: 0;margin-bottom: 8px;">
                    {chat.members.filter(
						username => username !== $user.name
					)[0]}
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