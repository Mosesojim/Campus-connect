const fs = require('fs');
let serverTs = fs.readFileSync('server.ts', 'utf8');

serverTs = serverTs.replace(/if \(error\.code === 'PGRST205'\) \{/g, "if (error.code === 'PGRST205' || error.message.includes('schema cache') || error.message.includes('find the table')) {");

fs.writeFileSync('server.ts', serverTs);
console.log("Patched server.ts error handling");
