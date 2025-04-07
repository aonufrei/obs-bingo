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
	import { page } from '$app/stores';

    const bingoIdParam = $page.url.searchParams.get('bingoId') || '';

	let bingoRef: DocumentReference<DocumentData, DocumentData> | undefined = $state(undefined);
	let bingoState: BingoState | undefined = $state(undefined);
	let loadingBoard: boolean = $state(true);

	function updateStateFromSnapshot(snapshot: DocumentSnapshot<DocumentData, DocumentData>) {
		if (!snapshot.exists()) {
			console.error("Snapshot doesn't exist");
		}
		bingoState = snapshot.data() as BingoState;
	}

	onMount(async () => {
		bingoRef = doc(db, 'bingos', bingoIdParam);

		if (!bingoRef) return 
        onSnapshot(bingoRef, (snapshot) => {
				console.log('updated');
				updateStateFromSnapshot(snapshot);
				loadingBoard = false;
			});
	});

</script>

{#if bingoState}
	<div class="flex h-dvh">
		<DynamicGrid
			moreStyles="flex-1"
			showResults={true}
			interactive={false}
			onItemClicked={() => {}}
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
	<h1>Bingo game was not found</h1>
{/if}
