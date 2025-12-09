export const config = {
  runtime: "nodejs18.x"
};

import { Pool } from "pg";

// pool global
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// CORS para Vercel (ESM)
function applyCors(req, res) {
  const allowed = [
    "https://znerationtech.com",
    "https://www.znerationtech.com",
    "https://zneration-editorial-futures.vercel.app"
  ];

  const origin = req.headers.origin;

  if (allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }

  return false;
}

// DEFAULT EXPORT — VERCEL ESM COMPATÍVEL
export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  try {
    const result = await pool.query(`
      SELECT
        t.id,
        t.name,
        t.slug,
        t.logo,
        t.short_description AS "shortDescription",
        t.images,
        c.name AS category
      FROM technologies t
      LEFT JOIN categories c ON c.id = t.category_id
      ORDER BY t.id;
    `);

    return res.status(200).json(result.rows);

  } catch (err) {
    console.error("🔥 API ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
