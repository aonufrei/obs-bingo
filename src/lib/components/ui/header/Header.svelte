<script lang="ts">
	import Button from '../button/button.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import ThemeToggle from '../theme-toggle/ThemeToggle.svelte';
	import { type User } from '$lib/firebase';
	import * as Popover from '$lib/components/ui/popover';
	import { login, logout } from '$lib/stores/authStore';

	export let isLogged = false;
	export let user: User | undefined;
</script>

<nav class="border-b p-4">
	<div class="container mx-auto flex items-center justify-between">
		<span class="text-2xl font-bold">Bingo</span>
		<div class="flex items-center gap-4">
			<ThemeToggle />
			{#if isLogged && user !== undefined}
				<div class="align-center flex items-center justify-center gap-4">
					<Popover.Root>
						<Popover.Trigger>
							<Avatar.Root>
								<Avatar.Image src={user.photoURL} alt="Profile Image" />
							</Avatar.Root>
						</Popover.Trigger>
						<Popover.Content><Button class="w-full" variant="destructive" on:click={logout}>Logout</Button></Popover.Content>
					</Popover.Root>
				</div>
			{:else}
				<Button on:click={login}>Login</Button>
			{/if}
		</div>
	</div>
</nav>
