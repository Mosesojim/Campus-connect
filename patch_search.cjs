const fs = require('fs');
let mainTs = fs.readFileSync('src/main.ts', 'utf8');

// Replace search providers function
mainTs = mainTs.replace(
  /\(window as any\)\.searchProviders = function\(\) \{[\s\S]*?renderProviders\(filtered\);\n\}/,
  `(window as any).searchProviders = function() {
   const q = (document.getElementById("searchInput") as HTMLInputElement)?.value.toLowerCase() || "";
   const loc = (document.getElementById("locationFilter") as HTMLSelectElement)?.value || "";
   const all = (window as any).globalProviders || [];
   const filtered = all.filter((p) => {
      const matchQ = (p.full_name||'').toLowerCase().includes(q) || (p.service_title||'').toLowerCase().includes(q) || (p.bio||'').toLowerCase().includes(q) || (p.skill||'').toLowerCase().includes(q);
      const matchLoc = !loc || (p.location||'').includes(loc) || (p.state||'').includes(loc) || (p.university||'').includes(loc);
      return matchQ && matchLoc;
   });
   
   const container = document.getElementById("searchResultsContainer");
   const countEl = document.getElementById("searchResultsCount");
   const noResults = document.getElementById("noResultsNotice");

   if (countEl) {
     countEl.textContent = \`Found \${filtered.length} provider(s)\`;
   }

   if (filtered.length === 0) {
      if (container) container.innerHTML = '';
      if (noResults) {
        noResults.classList.remove("hidden");
        noResults.classList.add("flex");
      }
   } else {
      if (noResults) {
        noResults.classList.add("hidden");
        noResults.classList.remove("flex");
      }
      if (container) {
          container.innerHTML = filtered.map(p => { 
             return \`
              <div class="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group cursor-pointer" onclick="showProfileForUser('\${p.email}')">
                 <div class="h-32 bg-gray-200 dark:bg-gray-700 relative bg-cover bg-center" style="background-image: url('\${p.cover_url || p.cover_image || ''}')">
                    <div class="absolute -bottom-10 left-6">
                      <div class="w-20 h-20 rounded-2xl border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-100 dark:bg-gray-700">
                         <img src="\${p.avatar_url || p.profile_image || 'https://via.placeholder.com/150'}" class="w-full h-full object-cover" />
                      </div>
                    </div>
                 </div>
                 <div class="pt-14 p-6">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                      \${p.full_name}
                      \${p.is_verified ? \`<svg class="w-5 h-5 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>\` : ''}
                    </h3>
                    <p class="text-orange-600 dark:text-orange-400 font-medium text-sm mt-1">\${p.service_title || 'Provider'}</p>
                    <p class="text-gray-500 dark:text-gray-400 text-sm mt-3 line-clamp-2">\${p.bio || 'No bio available.'}</p>
                 </div>
              </div>
             \`;
          }).join('');
      }
   }
}`
);

// Search button clicks
mainTs = mainTs.replace(
  /searchBtn\?\.addEventListener\("click", \(\) => \{\n\s*if \(searchInput\) \{\n\s*\/\/ performSearch\(searchInput\.value\);\n\s*\} else \{\n\s*\/\/ performSearch\(""\);\n\s*\}\n\}\);/,
  `searchBtn?.addEventListener("click", () => {
  window.location.hash = "#search";
  if ((window as any).searchProviders) {
    (window as any).searchProviders();
  }
});`
);

mainTs = mainTs.replace(
  /searchInput\?\.addEventListener\("keyup", \(e\) => \{\n\s*if \(e\.key === "Enter"\) \{\n\s*\/\/ performSearch\(searchInput\.value\);\n\s*\}\n\}\);/,
  `searchInput?.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    window.location.hash = "#search";
    if ((window as any).searchProviders) {
      (window as any).searchProviders();
    }
  }
});`
);

// Quick search tags
mainTs = mainTs.replace(
  /if \(searchInput\) searchInput\.value = query;\n\s*\/\/ performSearch\(query\);/,
  `if (searchInput) searchInput.value = query;
    window.location.hash = "#search";
    if ((window as any).searchProviders) {
      (window as any).searchProviders();
    }`
);

// Mobile search behavior in main.ts
mainTs = mainTs.replace(
  /document\.getElementById\("mobile-search"\)\?\.addEventListener\("click", \(\) => \{\n\s*window\.location\.href = "profile\.html#\/services";\n\s*\}\);/,
  `document.getElementById("mobile-search")?.addEventListener("click", () => {
    window.location.hash = "#hero";
    setTimeout(() => {
      document.getElementById("searchInput")?.focus();
    }, 100);
  });`
);

fs.writeFileSync('src/main.ts', mainTs);
console.log("Patched src/main.ts search logic");
