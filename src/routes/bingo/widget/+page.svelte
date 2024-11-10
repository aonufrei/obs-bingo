<script lang="ts">
	import DynamicGrid from '$lib/components/ui/dynamic-grid/DynamicGrid.svelte';
	import { db } from '$lib/firebase';
	import { type BingoState, shuffle, withMissingItems } from '$lib/utils';
	import {
		type DocumentSnapshot,
		type DocumentData,
		DocumentReference,
		doc,
		onSnapshot
	} from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import { bingoIdStore } from '$lib/stores/bingoStore';

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
</script>

{#if bingoState}
	<DynamicGrid
		interactive={true}
		rows={bingoState?.rows}
		columns={bingoState?.cols}
		
		items={withMissingItems(bingoState?.rows * bingoState?.cols, shuffle(bingoState?.data || [], bingoState?.seed || 0), () => ({
			value: ''
		}))}
	/>
{:else if loadingBoard}
	<h1>Loading...</h1>
{:else}
	<h1>Bingo game not found</h1>
{/if}
