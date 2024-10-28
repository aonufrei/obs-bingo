<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import DynamicGrid from '$lib/components/ui/dynamic-grid/DynamicGrid.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Resizable from '$lib/components/ui/resizable';

	let rows = 1;
	let cols = 1;

	const items = [
		"Hello world1",
		"Hello world2",
		"Hello world3",
		"Hello world4",
		"Hello world5",
		"Hello world6",
		"Hello world7",
		"Hello world8",
		"Hello world9",
		"Hello world10",
	];
</script>

<div class="h-full">
	<nav class="p-4">
		<div class="container mx-auto">
			<span>Bingo</span>
		</div>
	</nav>
	<Resizable.PaneGroup direction="horizontal">
		<Resizable.Pane>
			<div class="flex-1 border-r-4">
				<div class="p-4">
					<div>
						<Label for="_grid-rows">Rows:</Label>
						<Input type="number" id="_grid-rows" bind:value={rows} class="max-w-xs" />
					</div>
					<div>
						<Label for="_grid-cols">Columns:</Label>
						<Input type="number" id="_grid-cols" bind:value={cols} class="max-w-xs" />
					</div>
				</div>
				<hr />
				<ul>
					{#each items as item}
						<li>{item}</li>
					{/each}
				</ul>
			</div>
		</Resizable.Pane>
		<Resizable.Handle />
		<Resizable.Pane>
			<div class="container mx-auto">
                <DynamicGrid rows={rows} columns={cols} items={items} />
			</div></Resizable.Pane>
	</Resizable.PaneGroup>
</div>
