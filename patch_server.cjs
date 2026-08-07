const fs = require('fs');
let serverTs = fs.readFileSync('server.ts', 'utf8');

const regex = /app\.get\("\/api\/client-requests\/:email"[\s\S]*?app\.get\("\/api\/providers",/m;

const replacement = `app.get("/api/client-requests/:email", async (req, res) => {
    try {
      const email = req.params.email;
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('client_requests')
        .select('*')
        .eq('provider_email', email)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      res.json(data || []);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/my-requests/:email", async (req, res) => {
    try {
      const email = req.params.email;
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('client_requests')
        .select('*')
        .eq('client_email', email)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      res.json(data || []);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/client-requests/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const id = req.params.id;
      const supabase = getSupabase();
      
      const { error } = await supabase
        .from('client_requests')
        .update({ status })
        .eq('id', id);
        
      if (error) {
         throw error;
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/requests", async (req, res) => {
    try {
      const { provider_email, client_email, client_name, service_name, details, date, time } = req.body;
      const supabase = getSupabase();
      
      const newReq = {
        provider_email,
        client_email,
        client_name,
        title: service_name || "Service Request",
        description: \`Date: \${date} Time: \${time} Details: \${details}\`,
        status: "open",
        budget: "Negotiable"
      };
      
      const { error } = await supabase
        .from('client_requests')
        .insert([newReq]);
        
      if (error) {
         throw error;
      }
      res.json({ success: true, message: "Request sent successfully" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/providers",`;

serverTs = serverTs.replace(regex, replacement);

fs.writeFileSync('server.ts', serverTs);
console.log("Patched server.ts successfully");
