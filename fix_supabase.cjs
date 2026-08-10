const fs = require('fs');

let code = fs.readFileSync('src/lib/supabase.ts', 'utf8');
code = code.replace(/import\.meta\.env/g, "(import.meta as any).env");
fs.writeFileSync('src/lib/supabase.ts', code);
console.log("Fixed supabase types");
