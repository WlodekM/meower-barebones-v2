<script>
    import { user, chats, isLoggedIn } from "@/lib/stores.js";
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
                <h1>
                    {chat.nickname}
                </h1>
                {chat.members.length > 10
                    ? chat.members.slice(0, 9).join(", ") + "..."
                    : chat.members.join(", ")}
            </Container>
            <div style="margin-bottom: 8px;"></div>
        {:else if chat.type == 1}
            <Container>
                <h1>
                    {chat.members.filter(
						username => username !== $user.name
					)[0]}
                </h1>
                <!-- {chat.members.length > 10
                    ? chat.members.slice(0, 9).join(", ") + "..."
                    : chat.members.join(", ")} -->
            </Container>
            <div style="margin-bottom: 8px;"></div>
        {/if}
    {/each}
</div>