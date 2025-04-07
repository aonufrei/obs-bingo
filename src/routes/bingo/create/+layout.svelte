<script lang="ts">
	import { page } from '$app/stores';
	import { bingoIdStore } from '$lib/stores/bingoStore';
	import { BINGO_ID_PARAM } from '$lib/constants';

	let { children } = $props();

	$bingoIdStore = $page.url.searchParams.get(BINGO_ID_PARAM) || null;
</script>

<div class="flex h-dvh flex-col">
	{@render children()}
</div>