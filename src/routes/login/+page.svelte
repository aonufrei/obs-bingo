<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { login } from '$lib/stores/authStore';
</script>

<Button on:click={login}>Login with Google</Button>
