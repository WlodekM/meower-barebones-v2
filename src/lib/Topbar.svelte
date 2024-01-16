<script>
	import { isGuest, user, isLoggedIn } from '@/lib/stores.js'
    import { goto } from "@roxi/routify";
</script>
<div class="top">
    <h1 id="logo">Meower Barebones</h1>
    <div id="controls">
        {#if $isLoggedIn}
            Logged in as {$user.username}
            {#if $isGuest}
                (Guest)
            {/if}
        {:else}
            <span color="red">Not logged in</span>
        {/if}
        <!-- <div id=spacer style="width:25px;"></div> -->
        <!-- <label for="badwords">Show bad words:</label><input type="checkbox" id="badwords"> -->
        <div id="spacer" style="width:50px;"></div>
        <button on:click={()=>{
            $isLoggedIn = false;
            $isGuest = false;
            $goto("/login")
        }}>Log out</button>
    </div>
</div>

<style>
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