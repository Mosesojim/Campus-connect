const fs = require('fs');

function fix(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  // Replace the environment variable read in getSupabase to include the hardcoded fallback just in case
  code = code.replace(
    'let supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;',
    'let supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://kjgettxguhfpyiwmqztf.supabase.co";'
  );
  
  code = code.replace(
    'process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;',
    'process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqZ2V0dHhndWhmcHlpd21xenRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NzAzNzEsImV4cCI6MjEwMDE0NjM3MX0.D_lxRdfzFQSQcllLe2X-ErPzaDOZUrEl7E3b2JEPmO4";'
  );

  fs.writeFileSync(file, code);
}

fix('api-router.ts');
fix('api/index.ts');
console.log("Fixed env fallback in backend");
