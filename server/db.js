import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase environment variables.");
}

// Log for debugging (optional, can be removed in production)
console.log("Supabase URL:", SUPABASE_URL);
console.log(
  "Using Service Role Key:",
  Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
