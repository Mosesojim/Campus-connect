const fs = require('fs');
let code = fs.readFileSync('api-router.ts', 'utf8');

const dotenvInject = `
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

try {
  const envPath = path.resolve(process.cwd(), '.env');
  const envExamplePath = path.resolve(process.cwd(), '.env.example');
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else if (fs.existsSync(envExamplePath)) {
    dotenv.config({ path: envExamplePath });
  }
} catch (e) {}
`;

if (!code.includes('dotenv')) {
  code = code.replace('import { createClient } from "@supabase/supabase-js";', 'import { createClient } from "@supabase/supabase-js";\n' + dotenvInject);
  fs.writeFileSync('api-router.ts', code);
  console.log("Patched api-router.ts with dotenv");
}
