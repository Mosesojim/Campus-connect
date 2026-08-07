const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, ""), process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY);
async function run() {
  const { error } = await supabase.from('providers').update({ role: 'provider' }).eq('email', 'victoramushi@gmail.com');
  console.log("Update error:", error);
}
run();
