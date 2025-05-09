import { writable } from 'svelte/store';
import { auth, signInWithPopup, provider, signOut, type User } from '$lib/firebase';

const authStore = writable<{
    isLoggedIn: boolean;
    user?: User;
    initialized: boolean;
}>({
    isLoggedIn: false,
    initialized: false,
});

auth.onAuthStateChanged((firebaseUser) => {
    authStore.set({
        isLoggedIn: firebaseUser !== null,
        user: firebaseUser || undefined,
        initialized: true,
    });
});

async function login() {
    try {
        const result = await signInWithPopup(auth, provider);
        authStore.set({
            isLoggedIn: true,
            user: result.user,
            initialized: true,
        });
    } catch (error) {
        console.error("Login failed: ", error);
    }
}

async function logout() {
    try {
        await signOut(auth);
        authStore.set({
            isLoggedIn: false,
            initialized: true,
        });
    } catch (error) {
        console.error("Logout failed: ", error);
    }
}

const subscribe = authStore.subscribe

export { authStore, login, logout, subscribe }