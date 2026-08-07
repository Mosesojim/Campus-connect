const fs = require('fs');
let mainTs = fs.readFileSync('src/main.ts', 'utf8');

mainTs = mainTs.replace(
  /\} else if \(hash === "#search"\) \{\n\s*sections\.search\?\.classList\.remove\("hidden"\);\n\s*sections\.hero\?\.classList\.remove\("hidden"\);\n\s*\}/,
  `} else if (hash === "#search") {
    sections.search?.classList.remove("hidden");
  }`
);

fs.writeFileSync('src/main.ts', mainTs);
console.log("Reverted hero visibility in search");
