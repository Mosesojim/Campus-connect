const fs = require('fs');

let code = fs.readFileSync('api-router.ts', 'utf8');
if (!code.includes('import crypto')) {
  code = 'import crypto from "crypto";\n' + code;
  fs.writeFileSync('api-router.ts', code);
}

code = fs.readFileSync('api/index.ts', 'utf8');
if (!code.includes('import crypto')) {
  code = 'import crypto from "crypto";\n' + code;
  fs.writeFileSync('api/index.ts', code);
}
console.log("Fixed crypto");
