<script lang="ts">
	import DynamicGrid from '$lib/components/ui/dynamic-grid/DynamicGrid.svelte';
	import { db } from '$lib/firebase';
	import { type BingoState, shuffle, withMissingItems } from '$lib/utils';
	import {
		type DocumentSnapshot,
		type DocumentData,
		DocumentReference,
		doc,
		onSnapshot,
		setDoc
	} from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import { page } from '$app/stores';
	import { bingoIdStore } from '$lib/stores/bingoStore';
	import { BINGO_NONE, BINGO_OWNER } from '$lib/constants';

	const previewParam = $page.url.searchParams.get('preview');
	const playerParam = $page.url.searchParams.get('player') || BINGO_OWNER;
	let isPreview = $state('true' === previewParam);
	let bingoId = derived(bingoIdStore, ($store) => $store || '', '');

	let bingoRef: DocumentReference<DocumentData, DocumentData> | undefined = $state(undefined);
	let bingoState: BingoState | undefined = $state(undefined);
	let loadingBoard: boolean = $state(true);

	function updateStateFromSnapshot(snapshot: DocumentSnapshot<DocumentData, DocumentData>) {
		if (snapshot.exists()) {
			bingoState = snapshot.data() as BingoState;
		} else {
			console.error("Snapshot doesn't exist");
		}
	}

	onMount(async () => {
		bingoRef = doc(db, 'bingos', $bingoId);

		if (bingoRef) {
			onSnapshot(bingoRef, (snapshot) => {
				console.log('updated');
				updateStateFromSnapshot(snapshot);
				loadingBoard = false;
			});
		}
	});

	function onCellSelected(id: string) {
		console.log(`Item ${id} clicked`);
		if (bingoRef && bingoState) {
			const bingoStateCopy = { ...bingoState };
			bingoStateCopy.data.forEach((it) => {
				if (it.id === id) {
					if (!it.doneBy || it.doneBy === BINGO_NONE) {
						it.doneBy = playerParam;
					} else if (it.doneBy === playerParam) {
						it.doneBy = BINGO_NONE;
					}
				}
			});
			setDoc(bingoRef, bingoStateCopy);
		}
	}
</script>

{#if bingoState}
	<div class="flex flex-1">
		<DynamicGrid
			moreStyles="flex-1"
			showResults={true}
			interactive={!isPreview}
			onItemClicked={onCellSelected}
			rows={bingoState?.rows}
			columns={bingoState?.cols}
			items={withMissingItems(
				bingoState?.rows * bingoState?.cols,
				shuffle(bingoState?.data || [], bingoState?.seed || 0),
				() => ({
					value: ''
				})
			)}
		/>
	</div>
{:else if loadingBoard}
	<h1>Loading...</h1>
{:else}
	<h1>Bingo game not found</h1>
{/if}
