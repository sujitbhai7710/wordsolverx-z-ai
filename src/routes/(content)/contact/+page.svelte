<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
</script>

<svelte:head>
  <title>Contact WordSolverX | Support, Feedback, and Corrections</title>
  <meta
    name="description"
    content="Contact WordSolverX for support, corrections, feedback, partnerships, or questions about our puzzle answer pages and solver tools."
  />
  <link rel="canonical" href="https://wordsolver.tech/contact" />
  <meta property="og:title" content="Contact WordSolverX | Support, Feedback, and Corrections" />
  <meta
    property="og:description"
    content="Reach WordSolverX by email for site updates, corrections, support, and business inquiries."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://wordsolver.tech/contact" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Contact WordSolverX | Support, Feedback, and Corrections" />
  <meta
    name="twitter:description"
    content="Get in touch with WordSolverX for support, feedback, and puzzle site updates."
  />
  <meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
  {@html `<script type="application/ld+json">${JSON.stringify([
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact WordSolverX',
      description: 'Contact page for WordSolverX support, feedback, and business inquiries.',
      url: 'https://wordsolver.tech/contact',
      email: 'wordsolverx@gmail.com'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Contact WordSolverX',
      description: 'Contact WordSolverX for support, corrections, feedback, and business questions.',
      url: 'https://wordsolver.tech/contact'
    }
  ])}</script>`}
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
  <Breadcrumbs />

  <!-- Page header -->
  <div class="mb-12">
    <h1 class="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-[1.1]">
      Contact WordSolverX
    </h1>
    <p class="mt-3 text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
      Questions, corrections, feature requests, or business inquiries — email us and we'll take a look.
    </p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
    <!-- Email section -->
    <div class="lg:col-span-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800/50 p-6">
      <h2 class="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">Email Us Directly</h2>
      <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
        For support, corrections, business inquiries, or general feedback about the site:
      </p>
      <a
        href="mailto:wordsolverx@gmail.com"
        class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/40 text-teal-700 dark:text-teal-300 font-bold hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        wordsolverx@gmail.com
      </a>

      <div class="mt-8">
        <h3 class="text-base font-bold text-slate-900 dark:text-slate-50 mb-3">What to Contact Us About</h3>
        <ul class="space-y-2.5">
          {#each [
            { label: 'Answer corrections', desc: 'Wrong answer on a daily page or in the archive' },
            { label: 'Solver issues', desc: 'Tool producing incorrect results or broken functionality' },
            { label: 'New game requests', desc: 'A daily puzzle game you play that we don\'t cover yet' },
            { label: 'Business inquiries', desc: 'Partnerships, media, or advertising questions' },
            { label: 'Site feedback', desc: 'Usability problems, design suggestions, or content ideas' },
            { label: 'Privacy or legal', desc: 'Questions about data handling, terms, or content removal' },
          ] as item}
            <li class="flex items-start gap-3 text-sm">
              <span class="mt-0.5 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>
              <div>
                <span class="font-semibold text-slate-900 dark:text-slate-100">{item.label}</span>
                <span class="text-slate-500 dark:text-slate-400"> — {item.desc}</span>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <!-- Social section -->
    <div class="lg:col-span-2 space-y-4">
      <h2 class="text-xl font-bold text-slate-900 dark:text-slate-50 mb-1">Follow WordSolverX</h2>
      <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">We post daily answers and solver tips on these platforms.</p>

      {#each [
        { name: 'Facebook', url: 'https://www.facebook.com/wordsolverx/', handle: 'facebook.com/wordsolverx' },
        { name: 'Pinterest', url: 'https://www.pinterest.com/wordsolverx/', handle: 'pinterest.com/wordsolverx' },
        { name: 'Telegram', url: 'https://t.me/wordsolverx', handle: 't.me/wordsolverx' },
      ] as social}
        <a
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-teal-300 dark:hover:border-teal-700 hover:bg-teal-50/30 dark:hover:bg-teal-900/10 transition-all duration-200 group"
        >
          <span class="font-semibold text-sm text-slate-900 dark:text-slate-100">{social.name}</span>
          <span class="text-xs text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{social.handle}</span>
        </a>
      {/each}
    </div>
  </div>

  <!-- Tips for contacting -->
  <div class="mt-10 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800/50 p-6">
    <h2 class="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">Before You Write</h2>
    <div class="prose prose-slate dark:prose-invert max-w-none text-sm">
      <p>
        Including the page URL, game name, and date helps us review your message faster. If you're reporting a solver issue, describe what you entered (letters and colors) and what result you expected versus what you got. Screenshots help, but plain text is usually enough — we can reproduce most issues from a description of the inputs.
      </p>
      <p>
        For new game requests, tell us the game name, the URL where it's played, and roughly how many daily players it has. We prioritize games with established player bases because those benefit the most people. That said, we add niche games too if they're well-built and have a consistent daily cycle.
      </p>
      <p>
        We read every message. Response time varies — simple corrections are usually fixed within a day, while feature requests take longer because they require development work. If you don't hear back within a week, send a follow-up.
      </p>
    </div>
  </div>

  <!-- Additional SEO content -->
  <div class="mt-16">
    <div class="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-20">
      <h2 class="text-slate-900 dark:text-slate-50">How We Handle Feedback</h2>
      <p>
        Every message we receive goes into a queue and gets reviewed by a real person. We don't use automated responses or chatbots — if you email us, you'll get a human-written reply. For corrections specifically, we try to verify the issue against the game's source data before making changes. Sometimes what looks like a wrong answer is actually correct but unexpected (like when Wordle uses a obscure word), so verification prevents us from "fixing" things that aren't broken.
      </p>
      <p>
        Feature requests are tracked in a backlog. We can't promise timelines, but we can tell you whether a request is likely to be implemented. High-impact features — things that benefit a large number of players — get prioritized. If your request is niche but well-thought-out, it might still happen, just not immediately.
      </p>
      <p>
        Business and media inquiries get routed separately. If you're a journalist writing about puzzle culture, a game developer who wants your game covered, or an advertiser interested in the site, use the same email but mention your context in the subject line. It helps us route the message to the right person.
      </p>
    </div>
  </div>
</div>
