<script lang="ts">
    import { AnalyticsTracker } from '$lib/utils/performance';

    let { children, fallback } = $props<{
        children: import('svelte').Snippet;
        fallback?: import('svelte').Snippet<[Error]>;
    }>();

    let hasError = $state(false);
    let caughtError = $state<Error | null>(null);

    function resetError() {
        hasError = false;
        caughtError = null;
    }
</script>

<svelte:boundary
    onerror={(err) => {
        hasError = true;
        
        // Standardize the error
        caughtError = err instanceof Error ? err : new Error(String(err));
        
        // Log to our tracker
        AnalyticsTracker.trackError(caughtError, 'ErrorBoundary');
        
        // Log to console for dev debugging
        console.error('[ErrorBoundary] Caught exception:', caughtError);
    }}
>
    {#if hasError && caughtError}
        {#if fallback}
            {@render fallback(caughtError)}
        {:else}
            <!-- Default Fallback UI -->
            <div class="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm m-4">
                <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                    <span class="text-3xl">⚠️</span>
                </div>
                <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Something went wrong</h2>
                <p class="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
                    We've encountered an unexpected issue while rendering this part of the page. Our team has been notified.
                </p>
                <div class="flex gap-3">
                    <button 
                        onclick={() => window.location.reload()} 
                        class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-semibold rounded-xl transition-colors"
                    >
                        Refresh Page
                    </button>
                    <button 
                        onclick={resetError} 
                        class="px-5 py-2.5 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-50 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl transition-colors"
                    >
                        Try Again
                    </button>
                </div>
                
                {#if import.meta.env?.DEV}
                    <div class="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left w-full max-w-2xl overflow-auto text-xs font-mono text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800">
                        <p class="font-bold mb-1">{caughtError.name}: {caughtError.message}</p>
                        {#if caughtError.stack}
                            <pre class="whitespace-pre-wrap">{caughtError.stack}</pre>
                        {/if}
                    </div>
                {/if}
            </div>
        {/if}
    {:else}
        {@render children()}
    {/if}
</svelte:boundary>
