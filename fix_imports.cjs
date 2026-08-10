const fs = require('fs');

let code = fs.readFileSync('api-router.ts', 'utf8');
code = code.replace("import fs from 'fs';", "import * as fs from 'fs';");
code = code.replace("import path from 'path';", "import * as path from 'path';");
code = code.replace("import dotenv from 'dotenv';", "import * as dotenv from 'dotenv';");
fs.writeFileSync('api-router.ts', code);

code = fs.readFileSync('api/index.ts', 'utf8');
code = code.replace("import fs from 'fs';", "import * as fs from 'fs';");
code = code.replace("import path from 'path';", "import * as path from 'path';");
code = code.replace("import dotenv from 'dotenv';", "import * as dotenv from 'dotenv';");
fs.writeFileSync('api/index.ts', code);

console.log("Fixed imports");
