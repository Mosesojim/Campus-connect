const { createClient } = require('@supabase/supabase-js');
const supabase = createClient("https://invalid-project-id.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqZ2V0dHhndWhmcHlpd21xenRmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDU3MDM3MSwiZXhwIjoyMTAwMTQ2MzcxfQ.BS0Ub7UkWi-ywJRGoCRcfbli38szbWrKGbp0Lzfh9wk");
async function run() {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email: 'test@example.com', password: 'password' });
    console.log("Error:", error);
  } catch (e) {
    console.log("Exception:", e.message);
  }
}
run();
