<script lang="ts">
	import '../../app.css';
	import { subscribe } from '$lib/stores/authStore';

	let { children } = $props();


	subscribe((value) => {
		if (value.isLoggedIn) {
			window.location.href = '/bingo';
		}
	});
</script>

{@render children()}
