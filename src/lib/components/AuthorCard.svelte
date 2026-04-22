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
  class="mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900"
  aria-labelledby="author-heading"
>
  <div class="flex items-start gap-4 p-5 sm:gap-6 sm:p-7">
    <div class="shrink-0 rounded-3xl bg-gradient-to-br from-teal-50 via-white to-sky-50 p-2 shadow-sm ring-1 ring-black/5 dark:from-teal-950/30 dark:via-slate-900 dark:to-sky-950/30 dark:ring-white/10">
      <img
        src={image}
        alt={name}
        width="96"
        height="96"
        class="h-20 w-20 rounded-full object-cover shadow-md sm:h-24 sm:w-24"
        loading="lazy"
        decoding="async"
      />
    </div>

    <div class="min-w-0 flex-1">
      <p class="text-xs font-semibold uppercase tracking-[0.28em] text-teal-600 dark:text-teal-400">
        Author
      </p>
      <h2 id="author-heading" class="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 md:text-3xl">
        {name}
      </h2>
      <p class="mt-3 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg">
        {description}
      </p>
    </div>
  </div>
</section>
