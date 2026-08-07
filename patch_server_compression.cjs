const fs = require('fs');
let serverTs = fs.readFileSync('server.ts', 'utf8');

if (!serverTs.includes('import compression')) {
  serverTs = serverTs.replace(
    'import express from "express";',
    'import express from "express";\nimport compression from "compression";'
  );
  
  serverTs = serverTs.replace(
    '  const app = express();',
    '  const app = express();\n  app.use(compression());'
  );
  
  fs.writeFileSync('server.ts', serverTs);
  console.log("Added compression to server.ts");
} else {
  console.log("Compression already exists");
}
