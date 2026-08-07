require('dotenv').config();

async function run() {
  try {
    const url = process.env.SUPABASE_URL.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "") + "/rest/v1/";
    const res = await fetch(url, {
      headers: {
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY}`
      }
    });
    const data = await res.json();
    if (data.paths) {
      const paths = Object.keys(data.paths);
      const tables = paths.map(p => p.split('/')[1]).filter((v, i, a) => a.indexOf(v) === i && v !== '');
      console.log("Tables:", tables.join(', '));
    } else {
      console.log(data);
    }
  } catch (err) {
    console.error(err.message);
  }
}
run();
