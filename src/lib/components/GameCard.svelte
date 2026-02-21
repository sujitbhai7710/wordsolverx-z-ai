<script lang="ts">
  let {
    name,
    href,
    description,
    color,
    icon,
    isPopular = false,
    disabled = false,
    actionText = 'Play Now',
  }: {
    name: string;
    href: string;
    description: string;
    color: string;
    icon: string;
    isPopular?: boolean;
    disabled?: boolean;
    actionText?: string;
  } = $props();

  function handleClick(e: MouseEvent) {
    if (disabled) e.preventDefault();
  }
</script>

<a
  {href}
  class="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 {disabled ? 'opacity-75 cursor-default' : ''}"
  onclick={handleClick}
>
  <div class="absolute inset-0 bg-gradient-to-br {color} opacity-90 transition-opacity duration-300 group-hover:opacity-100"></div>

  <!-- Shine Effect -->
  <div class="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 transform"></div>

  <div class="relative p-6 h-full flex flex-col justify-between">
    <div>
      <div class="flex justify-between items-start mb-4">
        <div class="bg-white/20 p-3 rounded-xl backdrop-blur-sm shadow-inner text-white text-2xl font-bold">
          {icon}
        </div>
        {#if isPopular}
          <span class="bg-white text-xs font-bold px-2 py-1 rounded-full text-gray-800 shadow-sm uppercase tracking-wider">
            Popular
          </span>
        {/if}
      </div>

      <h3 class="text-2xl font-bold text-white mb-2 tracking-tight">{name}</h3>
      <p class="text-white/80 text-sm leading-relaxed font-medium">
        {description}
      </p>
    </div>

    <div class="mt-8">
      {#if !disabled}
        <div class="inline-flex items-center text-sm font-bold text-white uppercase tracking-wider group-hover:underline decoration-2 underline-offset-4">
          {actionText}
          <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      {:else}
        <div class="inline-block bg-black/20 rounded-lg px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
          Coming Soon
        </div>
      {/if}
    </div>
  </div>
</a>
