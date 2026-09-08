const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  'app.use(express.static(distPath));',
  'app.use(express.static(distPath, { extensions: ["html"] }));'
);

fs.writeFileSync('server.ts', code);
console.log("Patched server.ts");
