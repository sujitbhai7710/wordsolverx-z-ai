<script lang="ts">
  // Footer is static.
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
          Daily puzzle answers, answer archives, Wordle solver tools, and guide content for players
          who want fast, useful puzzle help.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <a
            href="https://www.facebook.com/wordsolverx/"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-full border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:text-green-600 hover:border-green-400 dark:border-gray-600 dark:text-gray-300 dark:hover:text-green-400"
          >
            Facebook
          </a>
          <a
            href="https://www.pinterest.com/wordsolverx/"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-full border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:text-green-600 hover:border-green-400 dark:border-gray-600 dark:text-gray-300 dark:hover:text-green-400"
          >
            Pinterest
          </a>
          <a
            href="https://t.me/wordsolverx"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-full border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:text-green-600 hover:border-green-400 dark:border-gray-600 dark:text-gray-300 dark:hover:text-green-400"
          >
            Telegram
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
            <a href="/archive" class="text-base text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors duration-150">
              Answer Archive
            </a>
          </li>
          <li>
            <a href="/5-letter-wordle-solver" class="text-base text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors duration-150">
              5-Letter Wordle Solver
            </a>
          </li>
          <li>
            <a href="/solver" class="text-base text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors duration-150">
              Solver Tools
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
              About
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
          <li>
            <a href="/terms-of-service" class="text-base text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors duration-150">
              Terms & Conditions
            </a>
          </li>
          <li>
            <a href="/disclaimer" class="text-base text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors duration-150">
              Disclaimer
            </a>
          </li>
        </ul>
      </div>

      <div class="md:col-span-2 lg:col-span-1">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
          Get in Touch
        </h3>
        <p class="mt-4 text-base text-gray-600 dark:text-gray-300">
          Reach WordSolverX for support, corrections, or partnership inquiries.
        </p>
        <a
          href="mailto:wordsolverx@gmail.com"
          class="mt-4 inline-flex rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30"
        >
          wordsolverx@gmail.com
        </a>
        <p class="mt-4 text-sm text-gray-600 dark:text-gray-300">
          We review messages about page corrections, solver issues, and new puzzle requests.
        </p>
      </div>
    </div>

    <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <p class="text-base text-gray-600 dark:text-gray-300 text-center md:text-left">
          &copy; {new Date().getFullYear()} WordSolverX. All rights reserved.
        </p>
        <p class="mt-4 md:mt-0 text-sm text-gray-600 dark:text-gray-300 text-center md:text-right">
          Wordle is a trademark of The New York Times Company. WordSolverX is not affiliated with NYT.
        </p>
      </div>
    </div>
  </div>
</footer>
