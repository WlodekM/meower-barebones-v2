<script>
	import Container from "@/lib/Container.svelte";
</script>
<center style="padding: 5px;">
	<Container style="width: fit-content;max-height: 100vh;">
		<h1>404 - Page Not Found</h1>
		<span
			>Whoops! It looks like you followed an invalid link... Or, you were just
			looking for cat pictures.</span
		>
	
		<div style="margin-top:5px; max-height: 100%">
			{#if (Math.random() * 5) <= 2}
				<img
					src="https://cataas.com/cat"
					alt="Random cat"
					style="max-height: calc(100vh - 10em)"
				/>
			{:else}
				<img
					src="https://meower.org/assets/cat_disks.jpg"
					alt="cat disks"
					style="max-height: calc(100vh - 10em)"
				/>
			{/if}
		</div>
	</Container>
</center>