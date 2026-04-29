<script lang="ts">
  import AuthorCard from '$lib/components/AuthorCard.svelte';
  import { PRESTON_HAYES_AUTHOR_NAME, PRESTON_HAYES_AUTHOR_IMAGE, PRESTON_HAYES_AUTHOR_DESCRIPTION } from '$lib/authors';
	import WordlebotPage from '$lib/components/wordlebot/WordlebotPage.svelte';

	let { data }: { data: { config: import('$lib/wordlebot-wasm/types').WordlebotPageConfig } } = $props();
</script>

<WordlebotPage config={data.config} />
