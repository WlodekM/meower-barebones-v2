<script>
	import { isGuest, user, isLoggedIn, page } from '@/lib/stores.js'
    import * as clm from "./clm.js";
    import { goto, isActive } from "@roxi/routify";
    import { tick } from "svelte"
</script>
<div class="top">
    <h1 id="logo">Meower Barebones</h1>
    <div class="links">
        <span class:bold={$isActive("/home") ? "bold" : "normal"}    on:click={()=>{$goto("/home")}}>Home</span>
        <span class:bold={$isActive("/chats") ? "bold" : "normal"}   on:click={()=>{$goto("/chats")}}>Chats</span>
        <span class:bold={$isActive("/credits") ? "bold" : "normal"} on:click={()=>{$goto("/credits")}}>Credits</span>
        <!-- divider -->
        <span> | </span>
        {#if $isLoggedIn}
            Logged in as {$user.name}
            {#if $isGuest}
                (Guest)
            {/if}
        {:else}
            <span color="red">Not logged in</span>
        {/if}
        <!-- <div id=spacer style="width:25px;"></div> -->
        <!-- <label for="badwords">Show bad words:</label><input type="checkbox" id="badwords"> -->
        <button on:click={()=>{
            $isLoggedIn = false;
            $isGuest = false;
            $goto("/login")
        }}>Log out</button>
    </div>
</div>

<style>
    .bold {
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