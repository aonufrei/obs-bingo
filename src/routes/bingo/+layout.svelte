<script lang="ts">
	import { page } from '$app/stores';
	import { bingoIdStore } from '$lib/stores/bingoStore';
	import { BINGO_ID_PARAM } from '$lib/constants';
	import { authStore } from '$lib/stores/authStore';
	import LoginLayout from '$lib/components/ui/login-layout/LoginLayout.svelte';

	let { children } = $props();

	$bingoIdStore = $page.url.searchParams.get(BINGO_ID_PARAM) || null;
</script>

{#if !$authStore.isLoggedIn}
	<LoginLayout></LoginLayout>
{:else}
	<div class="flex h-dvh flex-col">
		{@render children()}
	</div>
{/if}
