<script lang="ts">
	import { PenIcon, Trash2, Plus, LoaderCircle } from 'lucide-svelte';
	import * as Table from '$lib/components/ui/table';
	import * as Dialog from '$lib/components/ui/dialog';
	import { db } from '$lib/firebase';
	import {
		collection,
		query,
		where,
		deleteDoc,
		DocumentReference,
		onSnapshot
	} from 'firebase/firestore';
	import { authStore } from '$lib/stores/authStore';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { BingoState } from '$lib/utils';

	interface BingoInfo {
		ref: DocumentReference;
		id: string;
		name: string;
		rows: number;
		cols: number;
		recordsAmount: number;
	}

	let userBingos: BingoInfo[] = $state([]);
	let isDeletingBingo: boolean = $state(false);
	let isDialogOpened: boolean = $state(false);

	async function deleteBingoBoard(bingo: BingoInfo) {
		isDeletingBingo = true;
		await deleteDoc(bingo.ref);
		isDialogOpened = false;
		isDeletingBingo = false;
	}

	$effect(() => {
		if (!$authStore.isLoggedIn) {
			return;
		}
		const q = query(collection(db, 'bingos'), where('owner', '==', $authStore.user?.uid));
		onSnapshot(q, (snapshot) => {
			userBingos = [
				...snapshot.docs.map((doc) => {
					const bingoState = doc.data() as BingoState;
					return {
						ref: doc.ref,
						id: doc.id,
						name: bingoState.name || 'No name',
						cols: bingoState.cols,
						rows: bingoState.rows,
						recordsAmount: bingoState.data.length
					} as BingoInfo;
				})
			];
		});
	});
</script>

<div class="container pt-8">
	<div class="flex flex-col">
		<div class="mb-4 flex items-start">
			<Button href="/bingo/create"><Plus class="mr-2" />Create a New Board</Button>
		</div>

		{#if userBingos.length === 0}
			<p>You have not created any bingo-boards yet</p>
		{:else}
			<Table.Root>
				<Table.Caption>Your Bingo Boards</Table.Caption>
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-[40px]"></Table.Head>
						<Table.Head class="w-[100px]">ID</Table.Head>
						<Table.Head>Board Name</Table.Head>
						<Table.Head class="text-center">Size</Table.Head>
						<Table.Head class="text-center">Records amount</Table.Head>
						<Table.Head class="text-right">Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each userBingos as bingo}
						<Table.Row>
							<Table.Cell>
								<Button variant="outline" size="icon" href={`/bingo/create?bingoId=${bingo.id}`}
									><PenIcon /></Button
								>
							</Table.Cell>
							<Table.Cell class="font-medium">{bingo.id}</Table.Cell>
							<Table.Cell>{bingo.name}</Table.Cell>
							<Table.Cell class="text-center">{bingo.rows}x{bingo.cols}</Table.Cell>
							<Table.Cell class="text-center">{bingo.recordsAmount}</Table.Cell>
							<Table.Cell class="text-right">
								<Dialog.Root
									bind:open={isDialogOpened}
									onOpenChange={(state) => {
										console.log(state);
									}}
								>
									<Dialog.Trigger
										><Button variant="destructive" size="icon"><Trash2 /></Button></Dialog.Trigger
									>
									<Dialog.Content>
										<Dialog.Header>
											<Dialog.Title>Are you sure sure?</Dialog.Title>
											<Dialog.Description>
												This action cannot be undone. This will permanently delete board "{bingo.name}"
												from our servers.
											</Dialog.Description>
										</Dialog.Header>
										<Dialog.Footer>
											<Dialog.Close><Button variant="outline">Cancel</Button></Dialog.Close>
											<Button
												disabled={isDeletingBingo}
												variant="destructive"
												on:click={async (_) => await deleteBingoBoard(bingo)}
												>{#if isDeletingBingo}
													<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
												{:else}
													Delete
												{/if}
											</Button>
										</Dialog.Footer>
									</Dialog.Content>
								</Dialog.Root></Table.Cell
							>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		{/if}
		
	</div>
</div>
