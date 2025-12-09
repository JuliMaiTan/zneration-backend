export const config = {
  runtime: "nodejs18.x"
};

import { Pool } from "pg";

// --- DB CONNECTION ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// --- CORS ---
function setCors(req, res) {
  const allowedOrigins = [
    "https://znerationtech.com",
    "https://www.znerationtech.com",
    "https://zneration-editorial-futures.vercel.app"
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

// --- MAIN HANDLER ---
export default async function handler(req, res) {
  try {
    setCors(req, res);

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    const query = `
      SELECT
        t.id,
        t.name,
        t.slug,
        t.logo,
        t.short_description AS "shortDescription",
        c.name AS category
      FROM public.technologies t
      LEFT JOIN public.categories c ON c.id = t.category_id
      ORDER BY t.id;
    `;

    const { rows } = await pool.query(query);
    return res.status(200).json(rows);

  } catch (error) {
    console.error("BACKEND ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}
