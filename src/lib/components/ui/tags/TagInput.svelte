<script lang="ts">
	import { Button } from '../button';
	import { Input } from '../input';
	import Tag from './Tag.svelte';

	type TagProps = {
		tagList: string[];
		maxTagsAmount: number;
		tagValidationFunc: (value: string) => string | undefined;
	};
	const { tagList = $bindable<string[]>(), maxTagsAmount, tagValidationFunc }: TagProps = $props();

	let inputValue = $state<string>('');
	let errorMessage = $state<string | undefined>();

	function handleAddTag() {
		errorMessage = tagValidationFunc(inputValue);
		if (errorMessage) return;
		tagList.push(inputValue);
		inputValue = '';
	}
</script>

{#if tagList.length !== 0}
	<span class="flex max-w-xs flex-wrap gap-2 pb-4 pt-2">
		{#each tagList as tag, idx}
			<Tag
				variant="secondary"
				label={tag}
				onRemove={() => {
					tagList.splice(idx, 1);
				}}
			/>
		{/each}
	</span>
{/if}
<div class="flex gap-2">
	<Input
	type="text"
	id="companions_field"
	on:input={() => (errorMessage = undefined)}
	on:change={handleAddTag}
	bind:value={inputValue}
	placeholder="example@email.com"
	disabled={tagList.length >= maxTagsAmount}
	autocomplete="off"
	class="max-w-xs"
/>
<Button onclick={handleAddTag}>Add</Button>
</div>

{#if errorMessage !== undefined}
	<p class="text-sm text-red-500">{errorMessage}</p>
{/if}
