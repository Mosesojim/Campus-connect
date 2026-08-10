import { createClient } from "@supabase/supabase-js";

let supabaseUrl = "https://placeholder.supabase.co";
let supabaseAnonKey = "placeholder";

try {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || supabaseUrl;
    supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || supabaseAnonKey;
  }
} catch (e) {
  // Ignored
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
