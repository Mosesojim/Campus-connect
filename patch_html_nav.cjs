const fs = require('fs');

let idx = fs.readFileSync('index.html', 'utf8');
idx = idx.replace(
  'id="mobile-home"\n        class="flex flex-col items-center p-2 text-orange-600"',
  'id="mobile-home"\n        class="flex flex-col items-center p-2 text-orange-600"' // This is fine for initial load
);

let prof = fs.readFileSync('profile.html', 'utf8');
prof = prof.replace(
  /id="mobile-profile"\s+class="flex flex-col items-center p-2 text-orange-600"/,
  'id="mobile-profile"\n        class="flex flex-col items-center p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"'
);
fs.writeFileSync('profile.html', prof);
console.log("Patched HTML");
