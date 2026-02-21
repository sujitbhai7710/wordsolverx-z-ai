<script lang="ts">
  import FiVideo from '$lib/components/icons/FiVideo.svelte';
  import FiPlay from '$lib/components/icons/FiPlay.svelte';

  let {
    videoUrl,
    title = "Watch Today's Wordle Solution"
  }: {
    videoUrl: string | null | undefined;
    title?: string;
  } = $props();

  let isVisible = $state(false);
  let isLoaded = $state(false);
  let containerEl: HTMLDivElement | undefined = $state();

  /**
   * Extract YouTube video ID from various URL formats
   */
  function extractYouTubeVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
      /youtube\.com\/embed\/([^&\s?]+)/,
      /youtube\.com\/v\/([^&\s?]+)/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  }

  let videoId = $derived(videoUrl ? extractYouTubeVideoId(videoUrl) : null);
  let embedUrl = $derived(videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&controls=1&mute=0&iv_load_policy=3&rel=0&modestbranding=1`
    : ''
  );

  // Lazy loading with Intersection Observer
  $effect(() => {
    if (!containerEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            isVisible = true;
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    observer.observe(containerEl);

    return () => {
      observer.disconnect();
    };
  });
</script>

{#if videoUrl && videoId}
  <div bind:this={containerEl} class="mb-8 max-w-3xl mx-auto">
    <div
      class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl border-2 border-transparent bg-clip-padding overflow-hidden relative"
      style="background-image: linear-gradient(white, white), linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%); background-origin: border-box; background-clip: padding-box, border-box;"
    >
      <!-- Header -->
      <div class="p-6 pb-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-4">
          <div class="flex-shrink-0 p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
            <FiVideo class="w-6 h-6 text-white" />
          </div>
          <div class="flex-1">
            <h3 class="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {title}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Learn how to solve this puzzle step by step
            </p>
          </div>
          <div class="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700">
            <FiPlay class="w-4 h-4 text-green-600 dark:text-green-400" />
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Video Guide</span>
          </div>
        </div>
      </div>

      <!-- Video Container -->
      <div class="p-6 bg-white dark:bg-gray-800">
        <div class="relative w-full" style="padding-bottom: 56.25%;">
          {#if !isVisible}
            <div class="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl animate-pulse flex items-center justify-center">
              <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-4 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <FiPlay class="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Loading video...</p>
              </div>
            </div>
          {:else}
            {#if !isLoaded}
              <div class="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl animate-pulse flex items-center justify-center z-10">
                <div class="text-center">
                  <div class="w-16 h-16 mx-auto mb-4 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center animate-bounce">
                    <FiPlay class="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Preparing video...</p>
                </div>
              </div>
            {/if}

            <iframe
              class="absolute inset-0 w-full h-full rounded-2xl shadow-inner"
              src={embedUrl}
              {title}
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              loading="lazy"
              onload={() => { isLoaded = true; }}
              style="border: none; opacity: {isLoaded ? 1 : 0}; transition: opacity 0.3s ease-in-out;"
            ></iframe>
          {/if}
        </div>

        <!-- Video description -->
        <div class="mt-4 flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl border border-green-100 dark:border-green-900/30">
          <div class="flex-shrink-0 mt-0.5">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              <span class="font-semibold text-green-700 dark:text-green-400">Pro Tip:</span> Watch the video to see the optimal solving strategy and learn techniques to improve your Wordle game.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
