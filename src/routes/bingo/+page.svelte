<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import DynamicGrid from '$lib/components/ui/dynamic-grid/DynamicGrid.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import EditableListItem from '$lib/components/ui/editable-list/EditableListItem.svelte';
	import * as Resizable from '$lib/components/ui/resizable';
	import ThemeToggle from '$lib/components/ui/theme-toggle/ThemeToggle.svelte';
	import { shuffle } from '$lib/utils';

	interface ListItem {
		value: string;
		editable: boolean;
	}

	const MAX_SIZE = 7;
	const MIN_SIZE = 2;

	let rows = $state(1);
	let cols = $state(1);
	let seed = $state(Math.floor(Math.random() * 100000))
	let taskName = $state('');

	let items = $state<ListItem[]>([
		{ value: 'Hello world1', editable: false },
		{ value: 'Hello world2', editable: false },
		{ value: 'Hello world3', editable: false },
		{ value: 'Hello world4', editable: false },
		{ value: 'Hello world5', editable: false },
		{ value: 'Hello world6', editable: false },
		{ value: 'Hello world7', editable: false },
		{ value: 'Hello world8', editable: false },
		{ value: 'Hello world9', editable: false },
		{ value: 'Hello world10', editable: false }
	]);

	function generateSeed(): number {
		return Math.floor(Math.random() * 100000)
	}

	function handleAddNewTask(value: string) {
		const trimmedTask = value.trim();
		trimmedTask !== '' ? addElement(value) : undefined;
	}

	// crud operations
	function addElement(value: string) {
		items = [...items, { value: value, editable: false }];
	}

	function editElement(value: string, index: number) {
		items = [...items.map((it, i) => (i === index ? { ...it, value: value } : it))];
	}

	function deleteElement(index: number) {
		items = [...items.filter((_, i) => i !== index)];
	}
</script>

<div class="flex min-h-full flex-col">
	<nav class="border-b p-4">
		<div class="container mx-auto flex justify-between">
			<span class="text-2xl font-bold">Bingo</span>
			<ThemeToggle />
		</div>
	</nav>
	<Resizable.PaneGroup direction="horizontal" class="container flex-1">
		<Resizable.Pane>
			<div class="border-r-4 pt-4">
				<div class="p-4">
					<div class="mb-4">
						<Label for="_grid-rows">Rows:</Label>
						<Input
							type="number"
							id="_grid-rows"
							max={MAX_SIZE}
							min={MIN_SIZE}
							bind:value={rows}
							class="max-w-xs"
						/>
					</div>
					<div>
						<Label for="_grid-cols">Columns:</Label>
						<Input
							type="number"
							id="_grid-cols"
							max={MAX_SIZE}
							min={MIN_SIZE}
							bind:value={cols}
							class="max-w-xs"
						/>
					</div>
				</div>
				<hr />
				<div class="flex gap-4 p-4">
					<Input class="flex-1" placeholder="Task name here" bind:value={taskName} />
					<Button on:click={(_) => handleAddNewTask(taskName)}>Add one more task</Button>
				</div>
				<ul class="p-4">
					{#each items as item, index}
						<EditableListItem
							on:itemUpdated={(e) => {
								const updatedText = e.detail;
								editElement(updatedText, index);
							}}
							on:itemDeleted={(e) => {
								const itemToDelete = e.detail;
								deleteElement(itemToDelete);
							}}
							{index}
							text={item.value}
							isEditable={false}
						></EditableListItem>
					{/each}
				</ul>
			</div>
		</Resizable.Pane>
		<Resizable.Handle />
		<Resizable.Pane>
			<div class="container mx-auto pt-4">
				<div class="flex gap-2 justify-between mb-4">
					<Input class="flex-1" bind:value={seed} />
					<Button on:click={_ => seed = generateSeed()}>Randomize</Button>
				</div>
				<DynamicGrid {rows} columns={cols} items={shuffle(items, seed).map((it) => it.value)} />
			</div></Resizable.Pane
		>
	</Resizable.PaneGroup>
</div>
