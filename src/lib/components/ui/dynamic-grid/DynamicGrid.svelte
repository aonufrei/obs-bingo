<script lang="ts">
	import { BINGO_GUEST, BINGO_OWNER } from '$lib/constants';
	import type { ListItem } from '$lib/utils';

	export let showResults: boolean = false;
	export let rows: number = 0;
	export let columns: number = 0;
	export let items: ListItem[] = [];
	export let interactive: boolean = false;
	export let moreStyles: string = '';
	export let onItemClicked: (id: string) => void = () => {};

	function getColors(doneBy: string) {
		if (doneBy === BINGO_OWNER) {
			return 'bg-red-500';
		} else if (doneBy === BINGO_GUEST) {
			return 'bg-sky-500';
		} else {
			return '';
		}
	}
</script>

<div
	class={`${moreStyles} grid gap-1`}
	style={`grid-template-columns: repeat(${columns}, minmax(0, 1fr)); grid-template-rows: repeat(${rows}, minmax(0, 1fr));`}
>
	{#each items as item, id}
		<button
			on:click={(_) => (interactive && item.id !== undefined ? onItemClicked(item.id) : undefined)}
			class={`${interactive ? 'cursor-pointer' : 'cursor-default'} ${showResults && item.doneBy ? getColors(item.doneBy) : ''} flex items-center justify-center overflow-hidden border-2`}
		>
			<span>{item?.value || ''}</span>
		</button>
	{/each}
</div>
