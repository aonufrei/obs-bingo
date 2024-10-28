<script lang="ts">
	export let rows: number = 0;
	export let columns: number = 0;
	export let items: string[] = [];

</script>

<div class="container-fluid">
	<table class="border">
		<tbody>
			{#each { length: rows } as _, rIndex}
				<tr>
					{#each { length: columns } as _, cIndex}
						<td class="border p-4 font-bold text-center">{items[rIndex * columns + cIndex] || ''}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
