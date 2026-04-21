<script lang="ts">
        import { generateOrganizationSchema } from '$lib/seo';

        const organizationSchema = generateOrganizationSchema();
</script>

<svelte:head>
        <link rel="icon" type="image/webp" href="/wordsolverx-favicon.webp" />
        <title>WordSolverX | Wordle & Puzzle Solvers</title>
        <meta name="theme-color" content="#10b981" />
        <meta property="og:site_name" content="WordSolverX" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content="https://wordsolver.tech/wordsolverx.webp" />
        <meta name="twitter:image" content="https://wordsolver.tech/wordsolverx.webp" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="apple-touch-icon" href="/wordsolverx-favicon.webp" />
        <meta name="author" content="Preston Hayes" />
        {@html `<script type="application/ld+json">${JSON.stringify(organizationSchema)}</script>`}
</svelte:head>
