<script lang="ts">
	import { X } from 'lucide-svelte';
	import { badgeVariants } from '$lib/components/ui/badge';

	type TagProps = {
		variant: 'default' | 'secondary' | 'destructive' | 'outline' | undefined;
		label: string;
		onRemove: () => void;
	};
	const { variant, label, onRemove }: TagProps = $props();
</script>

<button
	class={badgeVariants({ variant }) + ' hover:cursor-pointer'}
	onclick={() => {
		console.log('Here');
		onRemove();
	}}
>
	<span>{label}</span>
</button>
