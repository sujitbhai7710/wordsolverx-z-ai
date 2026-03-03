<script lang="ts">
  let name = $state('');
  let email = $state('');
  let subject = $state('');
  let message = $state('');
  let formSubmitted = $state(false);

  function handleSubmit(e: Event) {
    e.preventDefault();
    console.log('Form submitted:', { name, email, subject, message });
    formSubmitted = true;
    name = ''; email = ''; subject = ''; message = '';
  }
</script>

<svelte:head>
  <title>Contact Us - WordSolverX</title>
  <meta name="description" content="Contact WordSolverX for support, feedback, content suggestions, partnerships, or technical questions about our puzzle answers and solver tools." />
  <link rel="canonical" href="https://wordsolverx.com/contact" />
  <meta property="og:title" content="Contact Us - WordSolverX" />
  <meta property="og:description" content="Reach the WordSolverX team for support, feedback, partnerships, and puzzle tool questions." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://wordsolverx.com/contact" />
  <meta property="og:site_name" content="WordSolverX" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Contact Us - WordSolverX" />
  <meta name="twitter:description" content="Send a message to the WordSolverX team and get help with site questions or feedback." />
  <meta name="twitter:image" content="https://wordsolverx.com/wordsolverx.webp" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact WordSolverX',
    description: 'Contact page for WordSolverX support, feedback, and business inquiries.',
    url: 'https://wordsolverx.com/contact'
  })}</script>`}
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <div class="text-center mb-12">
    <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">Contact Us</h1>
    <p class="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">Have questions or feedback? We'd love to hear from you!</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div class="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Information</h2>
        <div class="space-y-4">
          <div><h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3><p class="mt-1 text-sm text-gray-900 dark:text-white">contact@wordsolverx.com</p></div>
          <div><h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Social Media</h3><div class="mt-1 space-y-1"><p class="text-sm text-gray-900 dark:text-white">Twitter: @WordleHelperApp</p><p class="text-sm text-gray-900 dark:text-white">Instagram: @wordlehelper</p></div></div>
          <div><h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Office Hours</h3><p class="mt-1 text-sm text-gray-900 dark:text-white">Monday - Friday: 9am - 5pm EST</p></div>
        </div>
        <div class="mt-8 prose prose-green dark:prose-invert max-w-none">
          <h3>About Our Support</h3>
          <p>Our team typically responds to inquiries within 24-48 hours.</p>
          <p>We're happy to help with:</p>
          <ul><li>Website functionality questions</li><li>Wordle strategy advice</li><li>Content suggestions</li><li>Partnership inquiries</li><li>Technical support</li></ul>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Send Us a Message</h2>
        {#if formSubmitted}
          <div class="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
            <div class="flex">
              <svg class="h-5 w-5 text-green-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
              <div class="ml-3"><h3 class="text-sm font-medium text-green-800 dark:text-green-300">Message Sent</h3><p class="mt-2 text-sm text-green-700 dark:text-green-200">Thank you for contacting us! We'll get back to you soon.</p></div>
            </div>
          </div>
        {:else}
          <form onsubmit={handleSubmit} class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input type="text" id="name" bind:value={name} required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input type="email" id="email" bind:value={email} required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
              <select id="subject" bind:value={subject} required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="feedback">Website Feedback</option>
                <option value="content">Content Suggestion</option>
                <option value="partnership">Partnership Opportunity</option>
              </select>
            </div>
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
              <textarea id="message" rows="5" bind:value={message} required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
            </div>
            <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Send Message</button>
          </form>
        {/if}
      </div>
    </div>
  </div>

  <div class="mt-10 bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Why Contact WordSolverX?</h2>
    <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
      We use feedback from players to improve page accuracy, add new puzzle tools, and fix issues quickly. If a daily answer page looks wrong, a solver needs an update, or you want a new game added, this is the fastest way to reach the team.
    </p>
  </div>
</div>
