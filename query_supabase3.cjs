require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, ""),
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

async function main() {
  const { data: d1, error: e1 } = await supabase.from('requests').select('*').limit(1);
  console.log("requests:", e1 ? e1.message : "Exists");

  const { data: d2, error: e2 } = await supabase.from('client_requests').select('*').limit(1);
  console.log("client_requests:", e2 ? e2.message : "Exists");
  
  const { data: d3, error: e3 } = await supabase.from('bookings').select('*').limit(1);
  console.log("bookings:", e3 ? e3.message : "Exists");
}

main();
