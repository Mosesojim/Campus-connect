const fs = require('fs');
let mainTs = fs.readFileSync('src/main.ts', 'utf8');

mainTs = mainTs.replace('document.addEventListener("DOMContentLoaded", updateAuthUI);', "document.addEventListener('DOMContentLoaded', () => { updateAuthUI(); });");

fs.writeFileSync('src/main.ts', mainTs);
console.log("Patched auth main successfully");
