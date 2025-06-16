import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables.");
}

// Log the environment variables (optional)
console.log("Supabase URL:", process.env.SUPABASE_URL);
console.log(
  "Using Service Role Key:",
  Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
);

// Create the Supabase client with server-side role
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default supabase;
