<script>
	import PostList from '@/lib/PostList.svelte';
    import { sendCmd, meowerRequest, link } from '@/lib/clm.js'
	import { isGuest, user, isLoggedIn, ulist } from '@/lib/stores.js'
    import UsernameDisplay from "@/lib/UsernameDisplay.svelte";
    import Topbar from "@/lib/Topbar.svelte";
	//@ts-ignore
    import { goto } from "@roxi/routify"
	import Container from "@/lib/Container.svelte";
    if(!$isLoggedIn) {$goto("/login")}
</script>

<Topbar />
<div class="margin" style="margin-top: 8px;">
	<Container>
		<h1 style="margin: 0;margin-bottom: 8px;">Home</h1>
		There are {$ulist.length} users online
		<br>
        <details open>
            <summary style="cursor: pointer;">Members</summary>
            {#each $ulist as member}
                <UsernameDisplay member={member} />{#if $ulist.indexOf(member) != $ulist.length -1},&nbsp;{/if}
            {/each}
        </details>
	</Container>
</div>

<PostList />

<style>
	.margin {
		margin-inline: 8px;
	}
</style>