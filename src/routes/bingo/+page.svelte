<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import DynamicGrid from '$lib/components/ui/dynamic-grid/DynamicGrid.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import EditableListItem from '$lib/components/ui/editable-list/EditableListItem.svelte';
	import * as Resizable from '$lib/components/ui/resizable';
	import Header from '$lib/components/ui/header/Header.svelte';
	import { type BingoState, type ListItem, shuffle, withMissingItems } from '$lib/utils';
	import { type User, db } from '$lib/firebase';
	import {
		type DocumentData,
		DocumentReference,
		doc,
		getDoc,
		setDoc,
		collection,
		addDoc
	} from 'firebase/firestore';
	import { subscribe } from '$lib/stores/authStore';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { bingoIdStore } from '$lib/stores/bingoStore';
	import { derived } from 'svelte/store';
	import { BINGO_ID_PARAM } from '$lib/constants';

	const MAX_SIZE = 7;
	const MIN_SIZE = 2;

	let bingoId = derived(bingoIdStore, ($store) => $store || '', '');
	let rows = $state(1);
	let cols = $state(1);
	let seed = $state(0);
	let taskName = $state('');
	let user = $state<User | undefined>(undefined);
	let isLogged = $state(false);
	let bingoRef: DocumentReference<DocumentData, DocumentData> | undefined = $state(undefined);

	let data = $state<ListItem[]>([]);

	subscribe((value) => {
		console.log(value);
		user = value.user;
		isLogged = value.isLoggedIn;
		console.log('owner', user?.uid);
	});

	async function loadBingo(ref: DocumentReference<DocumentData, DocumentData>) {
		const snapshot = await getDoc(ref);
		if (snapshot.exists()) {
			const bingoState = snapshot.data() as BingoState;
			cols = bingoState.cols;
			rows = bingoState.rows;
			seed = bingoState.seed;
			data = bingoState.data;
		} else {
			console.error("Snapshot doesn't exist");
		}
	}

	onMount(async () => {
		bingoRef = doc(db, 'bingos', $bingoId);
		if (bingoRef) await loadBingo(bingoRef);
	});

	function generateSeed(): number {
		return Math.floor(Math.random() * 100000);
	}

	function handleAddNewTask(value: string) {
		const trimmedTask = value.trim();
		trimmedTask !== '' ? addElement(value) : undefined;
		taskName = '';
	}

	async function revertChanges() {
		if (bingoRef) await loadBingo(bingoRef);
	}

	function updateSearchParams(key: string, value: string) {
		let query = new URLSearchParams($page.url.searchParams.toString());
		query.set(key, value);
		goto(`?${query.toString()}`);
	}

	async function saveBingo() {
		const bingoState: BingoState = {
			cols: cols,
			rows: rows,
			seed: seed,
			owner: user?.uid || '',
			data: data
		};
		if (bingoRef) {
			console.log('Update');
			setDoc(bingoRef, bingoState);
		} else {
			bingoRef = await addDoc(collection(db, 'bingos'), bingoState);
			console.log('Create new');
			console.log(bingoRef);
			updateSearchParams(BINGO_ID_PARAM, bingoRef?.id);
		}
	}

	// crud operations
	function addElement(value: string) {
		data = [...data, { value: value, editable: false }];
	}

	function editElement(value: string, index: number) {
		data = [...data.map((it, i) => (i === index ? { ...it, value: value } : it))];
	}

	function deleteElement(index: number) {
		data = [...data.filter((_, i) => i !== index)];
	}
</script>

<Header {isLogged} {user} />
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
				{#each data as item, index}
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
			<div class="mb-4 flex items-center justify-between gap-2">
				<div>
					<Label for="_random-seed">Random Seed:</Label>
					<Input id="_random-seed" class="flex-1" bind:value={seed} />
				</div>
				<Button on:click={(_) => (seed = generateSeed())}>Randomize</Button>
			</div>
			<DynamicGrid
				{rows}
				columns={cols}
				items={withMissingItems(rows * cols, shuffle(data, seed), () => ({
					id: '',
					value: ''
				}))}
			/>
		</div></Resizable.Pane
	>
</Resizable.PaneGroup>

<nav class="border-t p-4">
	<div class="container mx-auto flex items-center justify-end gap-2">
		<Button on:click={revertChanges} variant="destructive">Revert Changes</Button>
		<Button on:click={saveBingo}>Save</Button>
	</div>
</nav>
