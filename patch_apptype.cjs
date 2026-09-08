const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace('appType: "spa"', 'appType: "mpa"');
fs.writeFileSync('server.ts', code);
console.log("Patched appType to mpa");
