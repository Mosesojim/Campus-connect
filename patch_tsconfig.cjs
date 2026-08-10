const fs = require('fs');
let code = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
code.compilerOptions.esModuleInterop = true;
fs.writeFileSync('tsconfig.json', JSON.stringify(code, null, 2));
console.log("Patched tsconfig.json");
