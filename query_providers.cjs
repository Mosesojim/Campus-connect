require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, ""),
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

async function main() {
  const { data, error } = await supabase.from('providers').select('*').limit(1);
  console.log(JSON.stringify(data?.[0], null, 2));
}

main();
