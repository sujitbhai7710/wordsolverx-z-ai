<script lang="ts">
	interface Props {
		letter?: string;
		state?: 'empty' | 'filled' | 'correct' | 'present' | 'absent';
		position?: number;
		size?: 'small' | 'medium' | 'large';
		isActiveRow?: boolean;
		isActiveTile?: boolean;
	}

	let {
		letter = '',
		state = 'empty',
		position = 0,
		size = 'medium',
		isActiveRow = false,
		isActiveTile = false
	}: Props = $props();

	// Determine tile size based on prop
	const sizeClasses = {
		small: 'w-10 h-10 md:w-11 md:h-11 text-lg md:text-xl',
		medium: 'w-12 h-12 md:w-14 md:h-14 text-2xl md:text-3xl',
		large: 'w-14 h-14 md:w-16 md:h-16 text-3xl md:text-4xl'
	};

    const getTileStyle = () => {
        if (state === 'correct') return 'bg-[#6aaa64] border-[#6aaa64] text-white shadow-md transform-gpu';
        if (state === 'present') return 'bg-[#c9b458] border-[#c9b458] text-white shadow-md transform-gpu';
        if (state === 'absent') return 'bg-[#787c7e] border-[#787c7e] text-white shadow-inner transform-gpu';
        if (isActiveRow) {
            if (isActiveTile) return 'bg-white dark:bg-slate-800 border-indigo-400 dark:border-indigo-500 text-slate-800 dark:text-white shadow-[0_4px_12px_-2px_rgba(0,0,0,0.1)] scale-[1.08] -translate-y-0.5 transform-gpu';
            return 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-500 text-slate-800 dark:text-white shadow-sm transform-gpu';
        }
        return 'bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-900 border-dashed dark:border-slate-700 dark:text-gray-100 opacity-70 transform-gpu';
    };

	// Get accessible label for screen readers
	const getAriaLabel = () => {
		if (!letter) {
			return `Position ${position + 1}, empty`;
		}
		const stateText = state === 'empty' ? 'filled' : state;
		return `Position ${position + 1}, letter ${letter}, ${stateText}`;
	};
</script>

<div
	role="gridcell"
	aria-label={getAriaLabel()}
	aria-roledescription="game tile"
	aria-live={isActiveTile ? "polite" : "off"}
	tabindex={-1}
	class="{sizeClasses[size]} flex items-center justify-center font-black uppercase rounded-xl border-2 transition-all duration-300 ease-out {getTileStyle()} {letter ? (isActiveTile ? 'scale-[1.08]' : 'scale-100') : 'scale-[0.97]'}"
>
	{letter}
</div>
