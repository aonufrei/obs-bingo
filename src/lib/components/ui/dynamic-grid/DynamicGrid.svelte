<script lang="ts">
	export let rows;
	export let columns;
	export let items: string[] = [];

	$: gridClass = `grid grid-cols-${columns} grid-rows-${rows} gap-2`;
</script>

<div class={gridClass}>
	<table class="border">
		<tbody>
			{#each { length: rows || 0} as _, rIndex}
				<tr>
					{#each {length: columns || 0} as _, cIndex}
						<td class="border">{items[rIndex * rows + cIndex] || ''}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
	<!-- {#each Array(rows * columns) as _, index}
    <div class="bg-blue-500 text-white flex items-center justify-center p-4">
      {items[index] || ""}
    </div>
  {/each} -->
</div>
