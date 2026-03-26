<script lang="ts">
  let {
    name,
    image,
    description
  }: {
    name: string;
    image: string;
    description: string;
  } = $props();
</script>

<section
  class="mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900"
  aria-labelledby="author-heading"
>
  <div class="flex items-start gap-4 p-5 sm:gap-6 sm:p-7">
    <div class="shrink-0 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-2 shadow-sm ring-1 ring-black/5 dark:from-emerald-950/30 dark:via-gray-900 dark:to-sky-950/30 dark:ring-white/10">
      <img
        src={image}
        alt={name}
        class="h-20 w-20 rounded-full object-cover shadow-md sm:h-24 sm:w-24"
        loading="lazy"
        decoding="async"
      />
    </div>

    <div class="min-w-0 flex-1">
      <p class="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600 dark:text-emerald-400">
        Author
      </p>
      <h2 id="author-heading" class="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-3xl">
        {name}
      </h2>
      <p class="mt-3 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-300 md:text-lg">
        {description}
      </p>
    </div>
  </div>
</section>
