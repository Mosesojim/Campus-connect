require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, ""),
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

async function main() {
  const { data, error } = await supabase.from('providers').select('*').limit(1);
  console.log("Providers:", data ? "Exists" : error);
  
  // Try to create table via RPC if there's a generic execute_sql or similar
  const { data: rpcData, error: rpcError } = await supabase.rpc('get_tables');
  console.log("RPC get_tables:", rpcError ? rpcError.message : rpcData);
}

main();
