const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, ""), process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY);
async function run() {
  const { data, error } = await supabase.from('client_requests').select('*').limit(1);
  console.log("Error from client_requests:", error);
  const { data: d2, error: e2 } = await supabase.from('requests').select('*').limit(1);
  console.log("Error from requests:", e2);
  const { data: d3, error: e3 } = await supabase.from('client_request').select('*').limit(1);
  console.log("Error from client_request:", e3);
}
run();
