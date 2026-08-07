const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data, error } = await supabase.from('client_requests').select('*');
  console.log("Data:", data);
  console.log("Error:", error);
}
test();
