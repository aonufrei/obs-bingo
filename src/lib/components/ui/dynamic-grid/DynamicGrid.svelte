<script lang="ts">
	import type { ListItem } from '$lib/utils';

	export let rows: number = 0;
	export let columns: number = 0;
	export let items: ListItem[] = [];
	export let interactive: boolean = false;

	function onItemClicked(id: string) {}
</script>

<div
	class={`grid aspect-square gap-1`}
	style={`grid-template-columns: repeat(${columns}, minmax(0, 1fr)); grid-template-rows: repeat(${rows}, minmax(0, 1fr));`}
>
	{#each items as item, id}
		<button
			on:click={(_) => (interactive ? onItemClicked(`${id}`) : undefined)}
			class={`${interactive ? 'cursor-pointer' : 'cursor-default'} flex items-center justify-center overflow-hidden border-2`}
		>
			<span>{item?.value || ''}</span>
		</button>
	{/each}
</div>
