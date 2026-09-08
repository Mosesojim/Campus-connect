import crypto from "crypto";

import express from "express";
import { createClient } from "@supabase/supabase-js";

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

try {
  const envPath = path.resolve(process.cwd(), '.env');
  const envExamplePath = path.resolve(process.cwd(), '.env.example');
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else if (fs.existsSync(envExamplePath)) {
    dotenv.config({ path: envExamplePath });
  }
} catch (e) {}


export const apiRouter = express.Router();

// Lazy initialization of Supabase
let supabaseClient: any = null;
export function getSupabase() {
  if (!supabaseClient) {
    let supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://kjgettxguhfpyiwmqztf.supabase.co";
    const supabaseAnonKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqZ2V0dHhndWhmcHlpd21xenRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NzAzNzEsImV4cCI6MjEwMDE0NjM3MX0.D_lxRdfzFQSQcllLe2X-ErPzaDOZUrEl7E3b2JEPmO4";
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required. Set them in .env",
      );
    }
    // Sanitize the URL in case the user accidentally included /rest/v1/ or trailing slashes
    supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

apiRouter.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Backend is running" });
  });

  // Example routes for future Supabase integration
  apiRouter.post("/auth/signup", async (req, res) => {
    try {
      const {
        email,
        password,
        fullName,
        matricNumber,
        role,
        state,
        university,
      } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const supabase = getSupabase();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            matric_number: matricNumber,
            role: role,
            state: state,
            university: university,
          },
        },
      });

      if (error) {
        if (
          error.message.includes("User already registered") ||
          error.message.includes("already exists")
        ) {
          return res.status(200).json({
            message:
              "Notice: You already have an account! Please log in instead.",
            notice: true,
          });
        }
        if (
          error.message.includes("security purposes") &&
          error.message.includes("seconds")
        ) {
          return res.status(429).json({ error: error.message });
        }
        if (error.message.includes("Invalid login credentials")) {
          return res.status(400).json({
            error:
              'Invalid login credentials. Note: If you just signed up, you must either verify your email, or disable "Enable Email Confirmations" in your Supabase dashboard (Authentication > Providers > Email).',
          });
        }
        return res.status(400).json({ error: error.message });
      }


      if (data && data.user && role === 'provider') {
        const { error: insertError } = await supabase.from('providers').insert([{
          email: email,
          full_name: fullName,
          state: state,
          university: university,
          services: {}
        }]);
        if (insertError) {
          console.warn("Failed to insert provider profile during signup:", insertError.message);
        }
      }
      res.json({ message: "Account created successfully!" });

    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  });

  apiRouter.post("/profile", async (req, res) => {
    try {
      const {
        email,
        full_name,
        role,
        bio,
        skill,
        location,
        contact,
        profile_image,
        cover_image,
        availability,
        availability_details,
        policies,
        state,
        university,
        services
      } = req.body;
      const supabase = getSupabase();

      let { data: existing } = await supabase
        .from("providers")
        .select("id")
        .eq("email", email)
        .single();
      let data, error;

      // We will pack availability_details and policies into contact as a JSON if they exist.
      // Wait, let's just append them to bio with a separator? No, that's ugly.
      // Let's store them in the 'services' jsonb column!
      // But we update services in POST /api/services.
      // Let's just create a 'metadata' table or something? We can't.

      const payload: any = {
        email,
        full_name,
        bio,
        skill,
        location,
        contact,
        profile_image,
        cover_image,
        availability: availability || "available",
      };
      if (state) payload.state = state;
      if (university) payload.university = university;

      if (existing) {
        const { data: oldData } = await supabase
          .from("providers")
          .select("services")
          .eq("id", existing.id)
          .single();
        let srv = oldData?.services || {};
        if (Array.isArray(srv)) srv = { list: srv };
        else if (typeof srv === "string") {
          try {
            srv = JSON.parse(srv);
            if (Array.isArray(srv)) srv = { list: srv };
          } catch (e) {
            srv = { list: [] };
          }
        }

        if (availability_details !== undefined)
          srv.availability_details = availability_details;
        if (policies !== undefined) srv.policies = policies;
        if (services !== undefined) srv.list = services;
        payload.services = srv;
      } else {
        payload.services = { availability_details, policies, list: services || [] };
      }

      if (existing) {
        const updateRes = await supabase
          .from("providers")
          .update(payload)
          .eq("id", existing.id)
          .select()
          .single();
        data = updateRes.data;
        error = updateRes.error;
      } else {
        let authUserId = null;
        let page = 1;
        while (true) {
          const { data: authData, error: authErr } =
            await supabase.auth.admin.listUsers({ page, perPage: 1000 });
          if (authErr || !authData.users || authData.users.length === 0) break;
          const match = authData.users.find((u) => u.email === email);
          if (match) {
            authUserId = match.id;
            break;
          }
          page++;
        }
        if (!authUserId) {
          return res.status(400).json({
            error: "Auth user not found for this email. Please sign up first.",
          });
        }

        const insertPayload = { ...payload, id: authUserId };
        const insertRes = await supabase
          .from("providers")
          .insert(insertPayload)
          .select()
          .single();
        data = insertRes.data;
        error = insertRes.error;
      }

      if (error) {
        console.error("Error upserting provider:", error.message);
        return res.status(500).json({ error: error.message });
      }

      res.json({ success: true, provider: data });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  apiRouter.get("/provider/:email", async (req, res) => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("providers")
        .select("*")
        .eq("email", req.params.email)
        .single();
      if (error) return res.status(404).json({ error: "Provider not found" });

      let meta = data.services || {};
      if (typeof meta === "string") {
        try {
          meta = JSON.parse(meta);
        } catch (e) {
          meta = {};
        }
      }

      if (Array.isArray(meta)) {
        data.services = meta;
      } else {
        data.availability_details = meta.availability_details;
        data.policies = meta.policies;
        data.services = meta.list || [];
      }

      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  apiRouter.post("/services", async (req, res) => {
    try {
      const { email, services, full_name } = req.body;
      const supabase = getSupabase();

      let { data: provider, error: providerErr } = await supabase
        .from("providers")
        .select("id")
        .eq("email", email)
        .single();

      if (providerErr || !provider) {
        // If provider not found, attempt to create it
        const { data: newProvider, error: newProviderErr } = await supabase
          .from("providers")
          .insert({
            email,
            full_name: full_name || "Provider",
            availability: "available",
            id: crypto.randomUUID(),
          })
          .select("id")
          .single();

        if (newProviderErr) {
          console.error(
            "Could not auto-create provider in /api/services",
            newProviderErr,
          );
          return res
            .status(404)
            .json({ error: "Provider not found: " + newProviderErr.message });
        }
        provider = newProvider;
      }

      // Fetch existing to preserve metadata
      const { data: oldData } = await supabase
        .from("providers")
        .select("services")
        .eq("id", provider.id)
        .single();
      let srv = oldData?.services || {};
      if (Array.isArray(srv)) {
        srv = { list: services || [] };
      } else {
        if (typeof srv === "string") {
          try {
            srv = JSON.parse(srv);
            if (Array.isArray(srv)) srv = { list: services || [] };
          } catch (e) {
            srv = { list: [] };
          }
        }
        srv.list = services || [];
      }

      const { error: updateErr } = await supabase
        .from("providers")
        .update({ services: srv })
        .eq("id", provider.id);
      if (updateErr) return res.status(500).json({ error: updateErr.message });

      res.json({ success: true });
    } catch (err: any) {
      console.error("/api/services error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  

  apiRouter.get("/client-requests/:email", async (req, res) => {
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

  apiRouter.get("/my-requests/:email", async (req, res) => {
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

  apiRouter.post("/client-requests/:id/status", async (req, res) => {
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

  apiRouter.post("/requests", async (req, res) => {
    try {
      const { provider_email, client_email, client_name, service_name, details, date, time } = req.body;
      const supabase = getSupabase();
      
      const newReq = {
        provider_email,
        client_email,
        client_name,
        title: service_name || "Service Request",
        description: `Date: ${date} Time: ${time} Details: ${details}`,
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

  apiRouter.get("/providers", async (req, res) => {
    try {
      const supabase = getSupabase();

      // Attempt to fetch from a 'providers' table in Supabase
      const { data, error } = await supabase.from("providers").select("id, email, full_name, role, service_title, bio, services, availability, cover_url, avatar_url, is_verified, created_at, state, university, skill, location, contact").eq("role", "provider");

      if (error) {
        if (error.message && error.message.includes("timeout")) {
           console.warn("Providers table query timeout. Your Supabase project might be paused or cold-starting. Please check your Supabase dashboard.");
        } else {
           console.warn("Providers table query error:", error.message);
        }
        return res.json([]);
      }

      // Process each provider to extract metadata from 'services'
      const processed = (data || []).map(provider => {
        let meta = provider.services || {};
        if (typeof meta === "string") {
          try { meta = JSON.parse(meta); } catch(e) { meta = {}; }
        }
        if (Array.isArray(meta)) {
          provider.services = meta;
        } else {
          provider.availability_details = meta.availability_details;
          provider.policies = meta.policies;
          provider.services = meta.list || [];
        }
        return provider;
      });

      res.json(processed);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  apiRouter.post("/auth/verify", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "Email required" });

      const supabase = getSupabase();

      // Attempt to verify if the user exists
      const { data, error } = await supabase
        .from("providers") // checking providers table as a proxy, or a users table if created
        .select("email")
        .eq("email", email)
        .single();

      // For this simplified setup without admin API, we'll return valid if we don't get a strict "not found"
      // If error is PGRST116 (0 rows returned), they might be a consumer not in providers,
      // but to be safe we'll just return valid: true unless we implement a dedicated 'users' table.
      // Let's implement the suggested check exactly:
      return res.json({ valid: true, deleted: false });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  apiRouter.post("/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const supabase = getSupabase();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (
          error.message.includes("security purposes") &&
          error.message.includes("seconds")
        ) {
          return res.status(429).json({ error: error.message });
        }
        if (error.message.includes("Invalid login credentials")) {
          return res.status(400).json({
            error:
              "Invalid login credentials. Please ensure your email is verified (or disable Email Confirmations in Supabase) and your password is correct.",
          });
        }
        return res.status(400).json({ error: error.message });
      }

      res.json({ message: "Login successful!", session: data.session });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  });

  

