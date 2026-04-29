import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function findPages(dir) {
  const results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results.push(...findPages(fullPath));
    } else if (item.name === '+page.svelte') {
      results.push(fullPath);
    }
  }
  return results;
}

const interactiveDir = path.join(__dirname, 'src', 'routes', '(interactive)');
const contentDir = path.join(__dirname, 'src', 'routes', '(content)');

const allPages = [
  ...findPages(interactiveDir),
  ...(fs.existsSync(contentDir) ? findPages(contentDir) : [])
];

// Filter archive and solver pages (not answer-today pages)
const arcAndSolver = allPages.filter(p => {
  const rel = path.relative(__dirname, p);
  return (rel.includes('-archive') || rel.includes('-solver')) && !rel.includes('answer-today');
});

// Also include wordle-answer-archive
const wordleArchive = allPages.filter(p => p.includes('wordle-answer-archive'));
const pages = [...new Set([...arcAndSolver, ...wordleArchive])];

const authorImport = `import AuthorCard from '$lib/components/AuthorCard.svelte';`;
const authorConstants = `import { PRESTON_HAYES_AUTHOR_NAME, PRESTON_HAYES_AUTHOR_IMAGE, PRESTON_HAYES_AUTHOR_DESCRIPTION } from '$lib/authors';`;
const authorComponent = `
    <div class="mt-12">
      <AuthorCard
        name={PRESTON_HAYES_AUTHOR_NAME}
        image={PRESTON_HAYES_AUTHOR_IMAGE}
        description={PRESTON_HAYES_AUTHOR_DESCRIPTION}
      />
    </div>`;

let modified = 0;
let skipped = 0;
let errors = 0;

for (const filePath of pages) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const relPath = path.relative(__dirname, filePath);
    
    // Skip if already has AuthorCard
    if (content.includes('AuthorCard')) {
      console.log(`SKIP (already has AuthorCard): ${relPath}`);
      skipped++;
      continue;
    }

    // Add imports
    if (content.includes('<script lang="ts">')) {
      const lastImportMatch = content.match(/import .+ from .+;\n(?!import)/g);
      if (lastImportMatch) {
        const lastImport = lastImportMatch[lastImportMatch.length - 1];
        const idx = content.lastIndexOf(lastImport) + lastImport.length;
        content = content.slice(0, idx) + authorImport + '\n  ' + authorConstants + '\n' + content.slice(idx);
      } else {
        // Add after <script> tag
        content = content.replace('<script lang="ts">', `<script lang="ts">\n  ${authorImport}\n  ${authorConstants}`);
      }
    } else if (content.includes('<script>')) {
      content = content.replace('<script>', `<script>\n  ${authorImport}\n  ${authorConstants}`);
    } else {
      console.log(`ERROR (no script tag): ${relPath}`);
      errors++;
      continue;
    }

    // Add AuthorCard before closing </main> or </article> or at end of page content
    if (content.includes('</main>')) {
      content = content.replace('</main>', `${authorComponent}\n  </main>`);
    } else if (content.includes('</article>')) {
      content = content.replace('</article>', `${authorComponent}\n  </article>`);
    } else {
      // Find last </div> before </body> or end of component
      const bodyClose = content.lastIndexOf('</body>');
      if (bodyClose > -1) {
        content = content.slice(0, bodyClose) + authorComponent + '\n' + content.slice(bodyClose);
      } else {
        // Add before the last closing tags
        const lastClose = content.lastIndexOf('</div>');
        if (lastClose > -1) {
          content = content.slice(0, lastClose) + authorComponent + '\n    ' + content.slice(lastClose);
        }
      }
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`MODIFIED: ${relPath}`);
    modified++;
  } catch (err) {
    console.log(`ERROR: ${path.relative(__dirname, filePath)} - ${err.message}`);
    errors++;
  }
}

console.log(`\nDone: ${modified} modified, ${skipped} skipped, ${errors} errors out of ${pages.length} pages`);