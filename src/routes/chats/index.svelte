<script>
    import { user, chats, isLoggedIn } from "@/lib/stores.js";
    import { goto } from "@roxi/routify";
    import Topbar from "@/lib/Topbar.svelte"
    import Container from "@/lib/Container.svelte"
	let favoritedChats, nonFavoritedChats, sortedChats;
    if(!$isLoggedIn) {$goto("/login")}

    // $: {
    // }
    favoritedChats = $chats
        .filter(_chat => $user.favorited_chats.includes(_chat._id))
        .sort((a, b) => {
            //return $user.favorited_chats.indexOf(a._id) - $user.favorited_chats.indexOf(b._id);
            return b.last_active - a.last_active;
        });

    nonFavoritedChats = $chats
        .filter(_chat => !$user.favorited_chats.includes(_chat._id))
        .sort((a, b) => {
            return b.last_active - a.last_active;
        });

    sortedChats = favoritedChats.concat(nonFavoritedChats);
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