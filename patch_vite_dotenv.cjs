const fs = require('fs');
let code = fs.readFileSync('vite.config.ts', 'utf8');

const injectCode = `
import dotenv from 'dotenv';
import fs from 'fs';

try {
  if (fs.existsSync('.env')) {
    dotenv.config({ path: '.env' });
  } else if (fs.existsSync('.env.example')) {
    dotenv.config({ path: '.env.example' });
  }
} catch (e) {}
`;

if (!code.includes('dotenv')) {
  code = code.replace("import {defineConfig} from 'vite';", "import {defineConfig} from 'vite';\n" + injectCode);
  fs.writeFileSync('vite.config.ts', code);
  console.log("Patched vite.config.ts with dotenv");
}
