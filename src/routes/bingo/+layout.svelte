<script lang="ts">
	import { LoaderCircle } from 'lucide-svelte';
	import Header from '$lib/components/ui/header/Header.svelte';
	import { authStore } from '$lib/stores/authStore';

	let { children } = $props();

	let isLogged = $derived($authStore.isLoggedIn);
	let user = $derived($authStore.user);
	$effect(() => {
		if ($authStore.initialized && !isLogged) {
			window.location.href = '/login';
		}
	});
</script>

{#if !$authStore.initialized || !$authStore.isLoggedIn}
	<div class="flex h-dvh flex-col items-center justify-center">
		<LoaderCircle class="animate-spin" />
	</div>
{:else}
	<Header {isLogged} {user} />
	{@render children()}
{/if}
