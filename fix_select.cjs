const fs = require('fs');

let code = fs.readFileSync('api-router.ts', 'utf8');

// Replace .select("*") with explicit columns for /providers
code = code.replace(
  'const { data, error } = await supabase.from("providers").select("*").eq("role", "provider");',
  'const { data, error } = await supabase.from("providers").select("id, email, full_name, role, service_title, bio, services, availability, cover_url, avatar_url, is_verified, created_at, state, university, skill, location, contact").eq("role", "provider");'
);

fs.writeFileSync('api-router.ts', code);
console.log("Patched api-router.ts select");
