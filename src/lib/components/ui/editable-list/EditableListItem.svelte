<script lang="ts">
	import { PenIcon } from 'lucide-svelte';
	import Button from '../button/button.svelte';
	import Input from '../input/input.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher<{ itemUpdated: string; itemDeleted: number }>();

	export let index = -1;
	export let text = '';
	export let isEditable: boolean;

	$: itemValue = text || '';

	function onUpdateItem(value: string) {
		isEditable = false;
		dispatch('itemUpdated', value);
	}

	function onDeleteItem(index: number) {
		isEditable = false;
		dispatch('itemDeleted', index);
	}
</script>

<div class="align-stretch mb-2 flex justify-start items-center gap-2">
	<Button variant="outline" size="icon" on:click={(_) => (isEditable = !isEditable)}
		><PenIcon /></Button
	>
	{#if isEditable}
		<div class="flex flex-1 justify-between gap-2">
			<Input class="flex-1" bind:value={itemValue} />
			<div class="flex gap-2">
				<Button on:click={(_) => onUpdateItem(itemValue)}>Save</Button>
				<Button on:click={(_) => onDeleteItem(index)} variant="destructive">Delete</Button>
			</div>
		</div>
	{:else}
		<li class="text-center">{text}</li>
	{/if}
</div>
