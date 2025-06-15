import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

console.log("Supabase Connection String:", process.env.SUPABASE_DB_URL);
console.log("Type of Connection String:", typeof process.env.SUPABASE_DB_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default pool;
