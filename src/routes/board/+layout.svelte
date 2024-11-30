<script lang="ts">
	import Header from '$lib/components/ui/header/Header.svelte';
	import { type User, db } from '$lib/firebase';
	import { subscribe } from '$lib/stores/authStore';

	let { children } = $props();

	let user = $state<User | undefined>(undefined);
	let isLogged = $state(false);

	subscribe((value) => {
		user = value.user;
		isLogged = value.isLoggedIn;
	});
</script>

<Header {isLogged} {user} />
{@render children()}
