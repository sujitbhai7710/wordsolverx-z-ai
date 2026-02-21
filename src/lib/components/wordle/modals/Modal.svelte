<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import XMarkIcon from '$lib/components/icons/XMarkIcon.svelte';

    let { isOpen = false, onClose, title = '', children } = $props<{
        isOpen: boolean;
        onClose: () => void;
        title: string;
        children?: any;
    }>();

    function handleEscape(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            onClose();
        }
    }

    function handleBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }

    $effect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleEscape);
        } else {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleEscape);
        }
    });

    onDestroy(() => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
    });
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-50 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabindex="-1"
        onclick={handleBackdropClick}
        onkeydown={() => {}}
    >
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- Background overlay -->
            <div
                class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 transition-opacity duration-300 ease-in-out"
                aria-hidden="true"
            ></div>

            <!-- Modal positioning -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <!-- Modal content -->
            <div
                class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full p-6 animate-modalShowUp"
            >
                <!-- Header -->
                <div class="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700 mb-4">
                    <h2 id="modal-title" class="text-xl font-bold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500">
                        {title}
                    </h2>
                    <button
                        onclick={onClose}
                        class="rounded-full p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Close modal"
                    >
                        <XMarkIcon class="h-6 w-6" />
                    </button>
                </div>

                <!-- Content -->
                <div class="max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
                    {@render children?.()}
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    @keyframes modalShowUp {
        from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }

    :global(.animate-modalShowUp) {
        animation: modalShowUp 0.3s ease-out forwards;
    }

    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.5);
        border-radius: 20px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: rgba(156, 163, 175, 0.8);
    }
</style>
