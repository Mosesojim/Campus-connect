const fs = require('fs');
let mainTs = fs.readFileSync('src/main.ts', 'utf8');

mainTs = mainTs.replace(
  /\} else if \(hash === "#search"\) \{\n\s*sections\.search\?\.classList\.remove\("hidden"\);\n\s*\}/,
  `} else if (hash === "#search") {
    sections.search?.classList.remove("hidden");
    sections.hero?.classList.remove("hidden");
  }`
);

fs.writeFileSync('src/main.ts', mainTs);
console.log("Patched main.ts hash logic for search");
