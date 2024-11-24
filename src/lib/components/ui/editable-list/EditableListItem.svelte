<script lang="ts">
	import { PenIcon, Trash2 } from 'lucide-svelte';
	import Button from '../button/button.svelte';
	import Input from '../input/input.svelte';

	export let index = -1;
	export let text = '';
	export let isEditable: boolean;
	export let onItemUpdated: (index: number, value: string) => void = () => {};
	export let onItemDeleted: (index: number) => void = () => {};

	$: itemValue = text || '';

	function updateItem(value: string) {
		isEditable = false;
		onItemUpdated(index, value);
	}

	function deleteItem(index: number) {
		isEditable = false;
		onItemDeleted(index);
	}
	function changeItemState() {
		isEditable = !isEditable;
	}
</script>

<div class="align-stretch mb-2 flex items-center gap-2">
	<Button variant="outline" size="icon" on:click={changeItemState}><PenIcon /></Button>
	{#if isEditable}
		<div class="flex flex-1 justify-between gap-2">
			<Input class="flex-1" autocomplete="off" bind:value={itemValue} />
			<div>
				<Button
					on:click={() => {
						itemValue = text || '';
						changeItemState();
					}}
					variant="ghost">Cancel</Button
				>
				<Button on:click={() => updateItem(itemValue)}>Save</Button>
			</div>
		</div>
	{:else}
		<li class="flex-1 text-start">{text}</li>
		<Button on:click={(_) => deleteItem(index)} variant="destructive" size="icon"><Trash2 /></Button
		>
	{/if}
</div>
