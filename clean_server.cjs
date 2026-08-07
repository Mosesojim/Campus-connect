const fs = require('fs');
let serverTs = fs.readFileSync('server.ts', 'utf8');

serverTs = serverTs.replace(/const inMemoryRequests: any\[\] = \[\];\nlet reqIdCounter = 1;\n/g, '');

fs.writeFileSync('server.ts', serverTs);
console.log("Cleaned up variables");
