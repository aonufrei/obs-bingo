import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export interface ListItem {
	value: string;
	editable: boolean;
}

export interface BingoState {
	rows: number
	cols: number
	seed: number
	data: ListItem[]
	owner: string
	user1Token?: string
	user2Token?: string
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === "none" ? "" : style.transform;

	const scaleConversion = (
		valueA: number,
		scaleA: [number, number],
		scaleB: [number, number]
	) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (
		style: Record<string, number | string | undefined>
	): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, "");
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export function toggleTheme() {
	if (document.documentElement.classList.contains('dark')) {
		document.documentElement.classList.remove('dark')
		localStorage.setItem('theme', 'light')
	} else {
		document.documentElement.classList.add('dark')
		localStorage.setItem('theme', 'dark')
	}
}

export function shuffle<T>(array: T[], seed: number): T[] {
	const arrayCopy = [...array]
	let currentIndex = arrayCopy.length,
		temporaryValue,
		randomIndex;
	let random = function () {
		var x = Math.sin(seed++) * 100000;
		return x - Math.floor(x);
	};
	while (0 !== currentIndex) {
		randomIndex = Math.floor(random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = arrayCopy[currentIndex];
		arrayCopy[currentIndex] = arrayCopy[randomIndex];
		arrayCopy[randomIndex] = temporaryValue;
	}
	return arrayCopy;
}
