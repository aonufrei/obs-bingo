<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { login } from '$lib/stores/authStore';
</script>

<div class="container flex h-full items-center justify-center">
	<div class="flex flex-col p-4">
		<h1 class="text-5xl font-bold mb-8">Please, Login</h1>
		<p class="mb-4 italic">
			It is required to save your bingo boards online and to allow you share them with your friends.
		</p>
		<Button class="font-bold" on:click={login}>Login with Google</Button>
	</div>
</div>
