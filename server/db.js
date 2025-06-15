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

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("DB Connection Failed:", err);
  } else {
    console.log("DB Connected. Time is:", res.rows[0]);
  }
});

export default pool;
