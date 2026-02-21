<script lang="ts">
  // Footer is mostly static, no script needed
</script>

<footer class="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-inner border-t border-gray-200 dark:border-gray-700 mt-auto">
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div class="lg:col-span-1">
        <div class="flex items-center space-x-2">
          <span class="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
            <span class="text-white font-bold text-lg">W</span>
          </span>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            WordSolverX
          </h3>
        </div>
        <p class="mt-4 text-base text-gray-600 dark:text-gray-300">
          Your daily resource for Wordle, Phoodle, Quordle answers, strategies, and tools to improve your gameplay.
        </p>
        <div class="mt-6 flex space-x-4">
          <a href="https://twitter.com" class="text-gray-500 hover:text-green-600 dark:hover:text-green-400" aria-label="Twitter">
            <span class="sr-only">Twitter</span>
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
            </svg>
          </a>
          <a href="https://github.com" class="text-gray-500 hover:text-green-600 dark:hover:text-green-400" aria-label="GitHub">
            <span class="sr-only">GitHub</span>
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
            </svg>
          </a>
        </div>
      </div>

      <div>
        <h3 class="text-base font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
          Quick Links
        </h3>
        <ul class="mt-4 space-y-3">
          <li>
            <a href="/today" class="text-base text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors duration-150">
              Today's Answer
            </a>
          </li>
          <li>
            <a href="/yesterday" class="text-base text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors duration-150">
              Yesterday's Answer
            </a>
          </li>
          <li>
            <a href="/archive" class="text-base text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors duration-150">
              Answer Archive
            </a>
          </li>
          <li>
            <a href="/wordle-solver" class="text-base text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors duration-150">
              Wordle Solver
            </a>
          </li>
          <li>
            <a href="/all-wordle-solver" class="text-base text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors duration-150">
              All Wordle Solver
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="text-base font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
          Resources
        </h3>
        <ul class="mt-4 space-y-3">
          <li>
            <a href="/guides" class="text-base text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors duration-150">
              Guides & Tips
            </a>
          </li>
          <li>
            <a href="/about" class="text-base text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors duration-150">
              About Us
            </a>
          </li>
          <li>
            <a href="/contact" class="text-base text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors duration-150">
              Contact
            </a>
          </li>
          <li>
            <a href="/privacy-policy" class="text-base text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors duration-150">
              Privacy Policy
            </a>
          </li>
        </ul>
      </div>

      <div class="md:col-span-2 lg:col-span-1">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
          Stay Updated
        </h3>
        <p class="mt-4 text-base text-gray-600 dark:text-gray-300">
          Get notified about new features and tips
        </p>
        <div class="mt-4">
          <div class="flex rounded-md shadow-sm">
            <input
              type="email"
              class="focus:ring-green-500 focus:border-green-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Your email"
            />
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <p class="text-base text-gray-500 dark:text-gray-400 text-center md:text-left">
          &copy; {new Date().getFullYear()} WordSolverX. All rights reserved.
        </p>
        <p class="mt-4 md:mt-0 text-sm text-gray-500 dark:text-gray-400 text-center md:text-right">
          Wordle is a trademark of The New York Times Company. This site is not affiliated with NYT.
        </p>
      </div>
    </div>
  </div>
</footer>
