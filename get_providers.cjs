const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, ""), process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY);
async function run() {
  const { data, error } = await supabase.from('providers').select('*').limit(1);
  console.log("Error from providers:", error);
  console.log("Data:", data);
}
run();
