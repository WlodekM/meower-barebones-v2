<script>
	import { isGuest, user, isLoggedIn } from '@/lib/stores.js'
    import { goto, isActive } from "@roxi/routify";
    import { onMount, tick } from "svelte"

    let currentPath = window.location.pathname;
    let updater = {}
</script>
{#key updater}
    <div class="top">
        <h1 id="logo" on:click={()=>{$goto("/home")}}>Meower Barebones</h1>
        <div class="links">
            {#if $isLoggedIn}
                <button class:active={$isActive("/home")}    on:click={()=>{$goto("/home")}}    disabled={!$isLoggedIn}>Home</button>
                <button class:active={$isActive("/chats")}   on:click={()=>{$goto("/chats")}}   disabled={!$isLoggedIn}>Chats</button>
                <button class:active={$isActive("/credits")} on:click={()=>{$goto("/credits")}} disabled={!$isLoggedIn}>Credits</button>
                {#if $user.debug}
                    <button class:active={$isActive("/debug")} on:click={()=>{$goto("/debug")}} disabled={!$isLoggedIn}>Debug</button>
                {/if}
                <a href="{`/users/${$user.name}`}">
                    <button class:active={$isActive(`/users/[username]`, { username: $user.name })}>Settings</button>
                </a>
                <!-- divider -->
                <span> | </span>
                Logged in as {$user.name}
                {#if $isGuest}
                    (Guest)
                {/if}
                <button on:click={()=>{
                    $goto("/logout")
                }}>Log out</button>
            {:else}
                <span color="red">Not logged in</span>
                <button on:click={()=>{
                    $goto("/login")
                }}>Log in</button>
            {/if}
            <!-- <div id=spacer style="width:25px;"></div> -->
            <!-- <label for="badwords">Show bad words:</label><input type="checkbox" id="badwords"> -->
        </div>
    </div>
{/key}

<style>
    .active {
        font-weight: bold;
        /* 👍 */
    }

    .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: hsl(0, 0%, 25%);
    }

    .top h1 {
        cursor: pointer;
        padding-inline: 8px;
        padding-block-start: 0.67em;
        padding-block-end: 0.67em;
        height: 100%;
        margin: 0;
        transition: background 0.5s;
    }

    .top h1:hover {
        background: rgba(255, 255, 255, 0.25);
    }
</style>